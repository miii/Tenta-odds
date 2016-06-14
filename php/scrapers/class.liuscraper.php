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
    preg_match('/<TD>.+?:([a-zåäö0-9 \-+:]+)([0-9]+\.[0-9]+).+?<BR>/i', $matches[1][0], $courseInfo);
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
          'hp' => null
        );
      }

      $eventData['examtype'] = $examTypeID;
      $eventData['hp'] = (float) $info[3];
      $eventData['date'] = $info[4];

      $this->examTypes[$examTypeID]['hp'] = $eventData['hp'];

      // Save all grades
      foreach($grades as $grade)
        $eventData['grades'][$grade[1]] = (int) $grade[2];

      // Add missing grades
      $gradesList = array('U', 3, 4, 5);
      foreach($gradesList as $j => $grade)
        if (!isset($eventData['grades'][$grade]))
          $eventData['grades'][$grade] = 0; // Set participants to 0

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

    for($i = 0; $i < count($this->examTypes); $i++) {
      if ($this->examTypes[$i]['hp'] > $mainExamHP) {
        $mainExamTypeID = $i;
        $mainExamHP = $this->examTypes[$i]['hp'];
      }
    }

    // Don't pick main exam if no exam HP is above 50% of course HP
    if ($mainExamHP < (0.5 * $this->courseHp))
      return;

    $totalParticipants = 0;
    $totalExams = 0;

    foreach($this->exams as $exam) {
      if ($exam['examtype'] !== $mainExamTypeID)
        continue;

      $totalParticipants += $exam['participants'];
      $totalExams++;
    }

    // Get mean participants
    $meanParticipants = 1.2 * $totalParticipants / $totalExams;

    for ($i = 0; $i < count($this->exams); $i++) {

      if ($this->exams[$i]['examtype'] == $mainExamTypeID) {
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
