<?php

class LIUScraper implements ScraperInterface {

  private $courseName;
  private $courseHp;
  private $exams = array();
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
    // Do not run if exams was not found when scraping (course does not exists)
    if (empty($this->exams))
      return array();

    // Stores exams
    $examType = null;
    // Find only exams (no tests etc)
    foreach($this->exams as $type => $list) {
      if (strpos(strtolower($type), 'tentamen') !== false) {
        $examType = $type;
        break;
      }
    }

    // If no exam was found, return nothing
    if (!$examType)
      return false;

    // Otherwise, return found exams
    return $this->exams[$examType];
  }

  public function getMainCourseExams() {

    // Do not run if exams was not found when scraping (course does not exists)
    if (empty($this->exams))
      return array();

    // Store main exams
    $mainExams = array();
    $exams = $this->getCourseExams();

    if ($exams === false)
      return false;

    $totalParticipants = 0;
    $totalExams = 0;

    foreach($exams as $exam) {
      $totalParticipants += $exam['participants'];
      $totalExams++;
    }

    // Get mean participants
    $meanParticipants = $totalParticipants / $totalExams;

    foreach($exams as $exam)
      // Use mean participants as a threeshold when searching for main exams
      if ($exam['participants'] > $meanParticipants)
        $mainExams[] = $exam;

    // return found main exams
    return $mainExams;
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
      preg_match('/<BR>[A-Z0-9]+:([a-zåäö \-,;0-9]+)([0-9]+\.[0-9]+).+?([0-9]{4}-[0-9]{2}-[0-9]{2})/i', $event, $info);
      // Find result data
      preg_match_all('/([A-Z0-9]).<\/TD><TD>([0-9]+)<\/TD><\/TR>/i', $event, $grades, PREG_SET_ORDER);

      $eventData = array();
      $type = trim($info[1]);

      $eventData['hp'] = (float) $info[2];
      $eventData['date'] = $info[3];

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
      $this->exams[$type][] = $eventData;

    }

  }

  private function _validateInput() {
    // Validate course code given by the user
    if (preg_match("/^[a-z]{3}[0-9]{3}$/i", $this->courseCode))
      $this->valid = true;
  }

}

?>
