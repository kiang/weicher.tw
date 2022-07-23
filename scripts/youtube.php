<?php
$youtubePath = __DIR__ . '/youtube';
$youtubeUrl = 'https://www.googleapis.com/youtube/v3/search?key=&channelId=UCI0g-MeQBe92yzjfVgMw6zQ&order=date&maxResults=50&part=snippet,id';
if(!file_exists($youtubePath)) {
  mkdir($youtubePath, 0777);
}
$page1 = $youtubePath . '/page1.json';
if(!file_exists($page1)) {
  file_put_contents($page1, file_get_contents($youtubeUrl));
}
$pageJson = json_decode(file_get_contents($page1), true);

$pageCount = 1;
while(!empty($pageJson['nextPageToken'])) {
  ++$pageCount;
  $page = $youtubePath . '/page' . $pageCount . '.json';
  if(!file_exists($page)) {
    error_log($youtubeUrl . '&pageToken=' . $pageJson['nextPageToken']);
    file_put_contents($page, file_get_contents($youtubeUrl . '&pageToken=' . $pageJson['nextPageToken']));
  }
  $pageJson = json_decode(file_get_contents($page), true);
}
