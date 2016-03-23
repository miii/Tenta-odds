<?php

class LIUScraper implements ScraperInterface {

  private $courseName;
  private $courseHp;
  private $exams = array();
  private $courseCode;

  public function __construct($courseCode) {
    $this->courseCode = strtoupper($courseCode);
    $this->_fetch();
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
    if (empty($this->exams))
      return array();

    $mainExamType = null;
    foreach($this->exams as $type => $list) {
      if (strpos($type, 'tentamen') !== false) {
        $mainExamType = $type;
        break;
      }
      echo $type;
    }

    if (!$mainExamType)
      return array();

    return $this->exams[$mainExamType];
  }

  public function getMainCourseExams() {

    $exams = $this->getCourseExams();
    if (empty($exams))
      return array();

    $mainExams = array();
    $examsPerYear = 3;

    $totalParticipants = 0;
    $totalExams = 0;

    foreach($exams as $exam) {
      $totalParticipants += $exam['participants'];
      $totalExams++;
    }

    $meanParticipants = $totalParticipants / $totalExams;

    foreach($exams as $exam)
      if ($exam['participants'] > $meanParticipants)
        $mainExams[] = $exam;

    return $mainExams;
  }

  private function _validateInput() {
    // Validate course code given by the user
    if (preg_match("/^[a-z]{3}[0-9]{3}$/i", $this->courseCode))
      $this->valid = true;
  }

  private function _fetch() {
    // Fetch HTML content from LIU
    $content = file_get_contents("http://www4.student.liu.se/tentaresult/?kurskod={$this->courseCode}&search=S%F6k");
    $content = utf8_encode(str_replace("\n", '', $content));

    // Fetch every tenta event
    preg_match_all('/<TR VALIGN="TOP" BGCOLOR="#[A-F0-9]{6}">(.+?)<\/TABLE>/', $content, $matches);
    if (empty($matches[0]))
        return;

    // Find and set course name and HP
    preg_match('/<TD>.+?:([a-zåäö -+]+)([0-9]+\.[0-9]+).+?<BR>/i', $matches[1][0], $courseInfo);
    $this->courseName = trim($courseInfo[1]);
    $this->courseHp = (float) $courseInfo[2];

    // Loop through all events
    foreach ($matches[1] as $i => $event) {

      // Find meta type, HP etc.
      preg_match('/<BR>[A-Z0-9]+:([a-zåäö -,]+)([0-9]+\.[0-9]+).+?([0-9]{4}-[0-9]{2}-[0-9]{2})/i', $event, $info);
      // Find result data
      preg_match_all('/([A-Z0-9]).<\/TD><TD>([0-9]+)<\/TD><\/TR>/i', $event, $grades, PREG_SET_ORDER);

      $eventData = array();
      $type = trim($info[1]);

      $eventData['hp'] = (float) $info[2];
      $eventData['date'] = $info[3];

      // Save all grades
      foreach($grades as $grade)
        $eventData['grades'][$grade[1]] = (int) $grade[2];

      $gradesList = array('U', 3, 4, 5);
      foreach($gradesList as $j => $grade)
        if (!isset($eventData['grades'][$grade]))
          $eventData['grades'][$grade] = 0;

      $eventData['participants'] = array_sum($eventData['grades']);

      // Save data to instance
      $this->exams[$type][] = $eventData;

    }

  }

}

?>
