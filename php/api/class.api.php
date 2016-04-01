<?php

class API {

  private $result = null;
  private $found = false;
  private $errorCode = false;
  private $timestamp = null;

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
      'errorCode' => $this->errorCode,
      'result' => $this->result,
      'timestamp' => $this->timestamp
    );
    return json_encode($data);
  }

  public function getData() {
    list($cacheTimestamp, $cache) = $this->cache->getCachedData();

    if (!empty($cache)) {
      $this->found = true;
      $this->result = $cache;
      $this->timestamp = $cacheTimestamp;
      return;
    }

    $this->_getDataFromScraper();
  }

  private function _getDataFromScraper() {
    $scraper = $this->scraper;
    $scraper->fetchData();

    // Return if no tentamen was found
    if ($scraper->getCourseExams() === false)
      return $this->errorCode = 2;

    // Return if the course does not exists
    if (empty($scraper->getCourseExams()))
      return $this->errorCode = 1;

    $this->found = true; // If course exams was found
    $this->timestamp = time();

    $this->result['name'] = $scraper->getCourseName();
    $this->result['hp'] = $scraper->getCourseHp();
    $this->result['code'] = $scraper->getCourseCode();
    $this->result['exams'] = $scraper->getMainCourseExams();

    $this->cache->saveToCache($this->result);
  }

}

?>
