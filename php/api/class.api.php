<?php

class API {

  private $result = null;
  private $found = false;

  private $courseName;
  private $scraper;
  private $cache;

  public function __construct($courseName, $scraper, $cache) {
    // Scraper not implemented correctly, kill script
    if (!$scraper instanceof ScraperInterface)
      die('Dev: ScraperInterface not implemented in scraper');

    $this->courseName = $courseName;
    $this->scraper = $scraper;
    $this->cache = $cache;
  }

  public function getJSON() {
    $data = array(
      'found' => $this->found,
      'result' => $this->result
    );
    return json_encode($data);
  }

  public function getData() {
    $cache = $this->cache->getCachedData();

    if (!empty($cache)) {
      $this->found = true;
      $this->result = $cache;
      return;
    }

    $this->_getDataFromScraper();
  }

  private function _getDataFromScraper() {
    $scraper = $this->scraper;
    $scraper->fetchData();

    // Return if no course exams was found
    if (empty($scraper->getCourseExams()))
      return;

    $this->found = true; // If course exams was found

    $this->result['name'] = $scraper->getCourseName();
    $this->result['hp'] = $scraper->getCourseHp();
    $this->result['code'] = $scraper->getCourseCode();
    $this->result['exams'] = $scraper->getMainCourseExams();

    $this->cache->saveToCache($this->result);
  }

}

?>
