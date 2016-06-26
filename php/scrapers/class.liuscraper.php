<?php

class LIUScraper implements ScraperInterface {

  private $courseName;
  private $courseHp;
  private $exams = array();
  private $examTypes = array();
  private $courseCode;

  public function __construct($courseCode) {
    $this->courseCode = $courseCode;
  }

  public function getCourseName() {
    return $this->courseName;
  }

  public function getCourseHp() {
    return $this->courseHp;
  }

  public function getCourseCode() {
    return $this->courseCode;
  }

  public function getCourseExams() {
    return $this->exams;
  }

  public function getCourseExamTypes() {
    return $this->examTypes;
  }

  public function fetchData() {
    // Fetch HTML content from LIU
    $content = file_get_contents("http://www4.student.liu.se/tentaresult/?kurskod={$this->courseCode}&search=S%F6k");
    $content = utf8_encode(str_replace("\n", '', $content));

    // Fetch every tenta event
    preg_match_all('/<TR VALIGN="TOP" BGCOLOR="#[A-F0-9]{6}">(.+?)<\/TABLE>/', $content, $matches);
    if (empty($matches[0]))
        return;

    // Find and set course name and HP
    preg_match('/<TD>.+?:([a-zåäö0-9 \/\-+:]+)([0-9]+\.[0-9]+).+?<BR>/i', $matches[1][0], $courseInfo);
    $this->courseName = trim($courseInfo[1]);
    $this->courseHp = (float) $courseInfo[2];

    // Loop through all events
    foreach ($matches[1] as $i => $event) {

      // Find meta type, HP etc.
      preg_match('/<BR>([A-Z0-9]+):([a-zåäö \-,;0-9]+)([0-9]+\.[0-9]+).+?([0-9]{4}-[0-9]{2}-[0-9]{2})/i', $event, $info);
      // Find result data
      preg_match_all('/([A-Z0-9]).<\/TD><TD>([0-9]+)<\/TD><\/TR>/i', $event, $grades, PREG_SET_ORDER);

      $eventData = array();

      $examcode = $info[1];
      $type = trim($info[2]);
      $examTypeID = array_search($examcode, array_column($this->examTypes, 'code'));
      if ($examTypeID === false) {
        $examTypeID = count($this->examTypes);
        $this->examTypes[$examTypeID] = array(
          'code' => $examcode,
          'name' => $type,
          'hp' => (float) $info[3],
          'lastUsed' => strtotime($info[4])
        );
      }

      $eventData['examtype'] = $examTypeID;
      $eventData['hp'] = (float) $info[3];
      $eventData['time'] = strtotime($info[4]);

      // Save all grades
      foreach($grades as $grade) {
        $grade[1] = ($grade[1] == 'D' || $grade[1] == 'G' || $grade[1] == 'T') ? '3' : $grade[1];
        $eventData['grades']['grade' . $grade[1]] = (int) $grade[2];
      }

      // Add missing grades
      $gradesList = array('U', 3, 4, 5);
      foreach($gradesList as $j => $grade)
        if (!isset($eventData['grades']['grade' . $grade]))
          $eventData['grades']['grade' . $grade] = 0; // Set participants to 0

      // Get participants of a single event
      $eventData['participants'] = array_sum($eventData['grades']);

      // Save data to instance
      $this->exams[] = $eventData;

    }

    $this->_sortCourseExams();

  }

  private function _validateInput() {
    // Validate course code given by the user
    if (preg_match("/^[a-z]{3}[0-9]{3}$/i", $this->courseCode))
      $this->valid = true;
  }

  private function _sortCourseExams() {

    $mainExamTypeID = null;
    $mainExamHP = -1;
    $timeThreshold = strtotime("-1 year");

    for($i = 0; $i < count($this->examTypes); $i++) {
      if ($this->examTypes[$i]['lastUsed'] < $timeThreshold)
        break;

      if ($this->examTypes[$i]['hp'] == $mainExamHP)
        $mainExamTypeID = null;

      if ($this->examTypes[$i]['hp'] > $mainExamHP) {
        $mainExamTypeID = $i;
        $mainExamHP = $this->examTypes[$i]['hp'];
      }
    }

    // Don't pick main exam if no exam HP is above 50% of course HP
    if ($mainExamHP < (0.5 * $this->courseHp) || is_null($mainExamTypeID))
      return;

    $totalParticipants = 0;
    $totalExams = 0;

    foreach($this->exams as $exam) {
      if ($exam['examtype'] !== $mainExamTypeID)
        continue;

      if ($this->examTypes[$exam['examtype']]['lastUsed'] < $timeThreshold)
        break;

      $totalParticipants += $exam['participants'];
      $totalExams++;
    }

    // Get mean participants
    $meanParticipants = 1.1 * $totalParticipants / $totalExams;

    for ($i = 0; $i < count($this->exams); $i++) {

      if ($this->exams[$i]['examtype'] == $mainExamTypeID) {
        if ($this->examTypes[$mainExamTypeID]['lastUsed'] < $timeThreshold)
          break;

        // Use mean participants as a threeshold when searching for main exams
        if ($this->exams[$i]['participants'] > $meanParticipants)
          $this->exams[$i]['retry'] = false;
        else
          $this->exams[$i]['retry'] = true;
      }

    }

  }

}

?>
