<?php

class API {

  private $result = null;
  private $found = false;

  public function __construct($scraper) {
    // Scraper not implemented correctly, kill script
    if (!$scraper instanceof ScraperInterface)
      die('Dev: ScraperInterface not implemented in scraper');

    // Return if no course exams was found
    if (empty($scraper->getCourseExams()))
      return;

    $this->found = true; // If course exams was found

    $this->result['name'] = $scraper->getCourseName();
    $this->result['hp'] = $scraper->getCourseHp();
    $this->result['code'] = $scraper->getCourseCode();
    $this->result['exams'] = $scraper->getMainCourseExams();
  }

  public function getJSON() {
    $data = array(
      'found' => $this->found,
      'result' => $this->result
    );
    return json_encode($data);
  }

}

?>
