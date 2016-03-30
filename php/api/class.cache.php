<?php

class Cache {

  private $cachePath = '../../php/cache/%s.cache';
  private $cacheTime = 432000; // 5 days
  private $cacheEnabled = false; // Delete in production

  private $courseName;
  private $cacheFile;
  private $timestampsFile;

  public function __construct($courseName) {
    $this->courseName = $courseName;
    $this->cacheFile = $this->_getCacheFile($courseName);
    $this->timestampsFile = $this->_getCacheFile('timestamps');
  }

  public function getCachedData() {
    if (!$this->cacheEnabled)
      return array();

    if (file_exists($this->cacheFile))
      return json_decode(file_get_contents($this->cacheFile));

    return array();
  }

  public function saveToCache($data) {
    if (!$this->cacheEnabled)
      return;

    file_put_contents($this->cacheFile, json_encode($data));

    $timestamps = $this->_readTimestamps();
    $timestamps[$this->courseName] = time();
    $this->_saveTimestamps($timestamps);
  }

  public function clean() {
    if (!$this->cacheEnabled)
      return;

    $timestamps = $this->_readTimestamps();
    $beforeClean = $timestamps;
    $currentTimestamp = time();

    foreach($timestamps as $courseName => $timestamp)
      if ($currentTimestamp - $this->cacheTime > $timestamp) {
        unset($timestamps[$courseName]);
        unlink($this->_getCacheFile($courseName));
      }

    if ($beforeClean != $timestamps)
      $this->_saveTimestamps($timestamps);
  }

  private function _readTimestamps() {
    if (!file_exists($this->timestampsFile)) {
      file_put_contents($this->timestampsFile, json_encode(array()));
      return array();
    }

    return (array) json_decode(file_get_contents($this->timestampsFile));
  }

  private function _saveTimestamps($data) {
    file_put_contents($this->timestampsFile, json_encode($data));
  }

  private function _getCacheFile($filename) {
    return sprintf($this->cachePath, $filename);
  }

}

?>
