<?php

class API {

  private $result = null;
  private $found = false;

  public function __construct($scraper) {
    if (!$scraper instanceof ScraperInterface)
      die('ScraperInterface not implemented in scraper');

    if (empty($scraper->getCourseExams()))
      return;

    $found = true;
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
