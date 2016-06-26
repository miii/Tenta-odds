<?php

class Cache {

  private $cachePath = '../../php/cache/%s.cache';
  private $cacheTime = 432000; // 5 days
  private $cacheEnabled = true;

  private $courseName;
  private $cacheFile;
  private $timestampsFile;
  private $timestamps;

  public function __construct($courseName) {
    $this->courseName = $courseName;
    $this->cacheFile = $this->_getCacheFile($courseName);
    $this->timestampsFile = $this->_getCacheFile('timestamps');

    if ($this->cacheEnabled)
      $this->timestamps = $this->_readTimestamps();
  }

  public function getCachedData() {
    if (!$this->cacheEnabled)
      return array(false, false);

    if (file_exists($this->cacheFile))
      return array(
        $this->timestamps[$this->courseName],
        json_decode(file_get_contents($this->cacheFile), true)
      );

    return array(false, false);
  }

  public function saveToCache($data) {
    if (!$this->cacheEnabled)
      return;

    file_put_contents($this->cacheFile, json_encode($data));

    $this->timestamps[$this->courseName] = time();
    $this->_saveTimestamps($this->timestamps);
  }

  public function clean() {
    if (!$this->cacheEnabled)
      return;

    $beforeClean = $this->timestamps;
    $currentTimestamp = time();

    foreach($this->timestamps as $courseName => $timestamp)
      if ($currentTimestamp - $this->cacheTime > $timestamp) {
        unset($this->timestamps[$courseName]);
        if (file_exists($this->_getCacheFile($courseName))) {
          unlink($this->_getCacheFile($courseName));
        }
      }

    if ($beforeClean != $this->timestamps)
      $this->_saveTimestamps($this->timestamps);
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
