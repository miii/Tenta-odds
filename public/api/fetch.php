<?php

class TentaStats {

  private $courseName;
  private $courseHp;
  private $tests;

  private $courseCode;
  private $valid = false; // True if course code is valid

  public function __construct($courseCode) {
    $this->courseCode = strtoupper($courseCode);
    // Validate course code
    $this->_validateInput();

    // Skip fetch etc. if course code is not valid
    if (!$this->valid)
      return;

    // If course code is correct, fetch data from LIU
    $this->_fetch();
  }

  public function getCourseName() {
    return $this->courseName;
  }

  public function isValid() {
    return $this->valid;
  }

  public function getTests() {
    return $this->tests;
  }

  private function _validateInput() {
    // Validate course code given by the user
    if (preg_match("/^[a-z]{3}[0-9]{3}$/i", $this->courseCode))
      $this->valid = true;
  }

  private function _fetch() {
    // Fetch HTML content from LIU
    $content = file_get_contents("http://www4.student.liu.se/tentaresult/?kurskod={$this->courseCode}&search=S%F6k");
    $content = str_replace("\n", '', $content);

    // Fetch every tenta event
    preg_match_all('/<TR VALIGN="TOP" BGCOLOR="#[A-F0-9]{6}">(.+?)<\/TABLE>/', $content, $matches);

    // Find and set course name and HP
    preg_match('/<TD>.+?:([A-Za-z- ]+)([0-9]\.[0-9]).+?<BR>/', $matches[1][0], $courseInfo);
    $this->courseName = trim($courseInfo[1]);
    $this->courseHp = (float) $courseInfo[2];

    // Loop through all events
    foreach ($matches[1] as $i => $event) {

      // Find meta type, HP etc.
      preg_match('/<BR>[A-Z0-9]+:([A-Za-z- ,]+)([0-9]\.[0-9]).+?([0-9]{4}-[0-9]{2}-[0-9]{2})/', $event, $info);
      // Find result data
      preg_match_all('/([A-Z0-9]).<\/TD><TD>([0-9]+)<\/TD><\/TR>/', $event, $grades, PREG_SET_ORDER);

      $eventData = array();
      $type = trim($info[1]);

      $eventData['hp'] = (float) $info[2];
      $eventData['date'] = strtotime($info[3]);

      // Save all grades
      foreach($grades as $grade)
        $eventData['grades'][$grade[1]] = $grade[2];

      $eventData['participants'] = array_sum($eventData['grades']);

      // Save data to instance
      $this->tests[$type][] = $eventData;

    }

  }

}

//header('Content-Type: application/json');
$course = @$_GET['course'];
$tentaStats = new TentaStats($course);

var_dump($tentaStats);

?>
