<?php
require_once 'vendor/autoload.php';

$loader = new Twig_Loader_Filesystem(__DIR__ . '/twig');
$twig = new Twig_Environment($loader, array(
  'autoescape' => false,
));

$urlRoot = 'https://huang.olc.tw/wp/wp-json/wp/v2';
$pubUrl = 'http://localhost/~kiang/weicher/pub';
//$pubUrl = 'https://huang.olc.tw/pub';
$pubUrl = 'https://weicher.tw';
$baseUrl = 'https://huang.olc.tw/wp/';
$targetUrl = '';
$politics = require 'politics.php';
$team = require 'team.php';

$videos = array();
foreach(glob(__DIR__ . '/youtube/*.json') AS $jsonFile) {
  $json = json_decode(file_get_contents($jsonFile), true);
  foreach($json['items'] AS $item) {
    if(empty($item['id']['videoId'])) {
      continue;
    }
    $videos[] = array(
      'id' => $item['id']['videoId'],
      'title' => $item['snippet']['title'],
      'date' => date('Y/m/d', strtotime($item['snippet']['publishedAt'])),
      'img' => $item['snippet']['thumbnails']['high']['url'],
    );
  }
}

file_put_contents(__DIR__ . '/pub/videos.html', $twig->render('videos.html', array(
  'baseUrl' => $pubUrl,
  'nav' => 'videos',
  'cssFiles' => array(
    'stylesheets/news.css',
  ),
  'cards' => $videos,
  'pageTitle' => '影音專區',
)));

file_put_contents(__DIR__ . '/pub/about.html', $twig->render('about.html', array(
  'baseUrl' => $pubUrl,
  'nav' => 'about',
  'cssFiles' => array(
    'stylesheets/about.css',
  ),
  'pageTitle' => '關於偉哲',
)));

file_put_contents(__DIR__ . '/pub/404.html', $twig->render('about.html', array(
  'baseUrl' => $pubUrl,
  'nav' => 'about',
  'cssFiles' => array(
    'stylesheets/about.css',
  ),
  'pageTitle' => '關於偉哲',
)));

file_put_contents(__DIR__ . '/pub/vision.html', $twig->render('vision.html', array(
  'baseUrl' => $pubUrl,
  'nav' => 'vision',
  'cssFiles' => array(
    'stylesheets/about.css',
  ),
  'pageTitle' => '城市願景館',
)));

// file_put_contents(__DIR__ . '/pub/donate.html', $twig->render('base.html', array(
//   'baseUrl' => $pubUrl,
//   'cssFiles' => array(
//     'stylesheets/about.css',
//   ),
//   'pageTitle' => '關於偉哲',
//   'mainContent' => $twig->render('about.html'),
// )));

$pageCount = 1;
$posts = $urlRoot . '/posts';
$tmpPage = __DIR__ . '/tmp/page1.json';
if(!file_exists($tmpPage)) {
  file_put_contents($tmpPage, file_get_contents($posts));
  foreach($http_response_header AS $line) {
    if(false !== strpos($line, 'X-WP-TotalPages:')) {
      $parts = explode(':', $line);
      $pageCount = intval(trim($parts[1]));
      file_put_contents(__DIR__ . '/tmp/pageCount', $pageCount);
    }
  }
} else {
  $pageCount = file_get_contents(__DIR__ . '/tmp/pageCount');
}
$page1 = json_decode(file_get_contents($tmpPage), true);
$errors = array();
$pages = array();
foreach($page1 AS $post) {
  $item = extractBody($post);
  $pages[$item['id']] = $item;
}

for($i = 2; $i <= $pageCount; $i++) {
  $tmpPage = __DIR__ . '/tmp/page' . $i . '.json';
  if(!file_exists($tmpPage)) {
    file_put_contents($tmpPage, file_get_contents($posts . '?page=' . $i));
  }
  $page = json_decode(file_get_contents($tmpPage), true);
  foreach($page AS $post) {
    $item = extractBody($post);
    $pages[$item['id']] = $item;
  }
}

$cards = array();
$cardCount = 0;
foreach($pages AS $page) {
  if(++$cardCount < 7) {
    $cards[] = $page;
  }
  $htmlFile = 'pub/' . $page['link'];
  $p = pathinfo($htmlFile);
  if(!file_exists($p['dirname'])) {
    mkdir($p['dirname'], 0777, true);
  }
  file_put_contents($htmlFile, $twig->render('base.html', array(
    'baseUrl' => $pubUrl,
    'nav' => 'news',
    'cssFiles' => array(
      'stylesheets/newscontent.css',
    ),
    'pageTitle' => $page['title'],
    'ogDescription' => mb_substr(strip_tags($page['content']), 0, 250) . '...',
    'ogImage' => $page['metaImage'],
    'mainContent' => $twig->render('newscontent.html', array('page' => $page, 'baseUrl' => $pubUrl,)),
  )));
}

file_put_contents(__DIR__ . '/pub/news.html', $twig->render('base.html', array(
  'baseUrl' => $pubUrl,
  'nav' => 'news',
  'cssFiles' => array(
    'stylesheets/news.css',
  ),
  'pageTitle' => '最新消息',
  'mainContent' => $twig->render('news.html', array('cards' => $pages, 'baseUrl' => $pubUrl)),
)));

file_put_contents(__DIR__ . '/pub/index.html', $twig->render('index.html', array(
  'pageTitle' => '首頁',
  'baseUrl' => $pubUrl,
  'cards' => $cards,
)));

file_put_contents(__DIR__ . '/pub/politics.html', $twig->render('base_politics.html', array(
  'baseUrl' => $pubUrl,
  'nav' => 'politics',
  'cssFiles' => array(
    'stylesheets/politics.css',
  ),
  'pageTitle' => '政見介紹',
  'mainContent' => $twig->render('politics.html', array('politics' => $politics, 'baseUrl' => $pubUrl,)),
)));

file_put_contents(__DIR__ . '/pub/politics_map.html', $twig->render('politics_map.html', array(
  'baseUrl' => $pubUrl,
  'nav' => 'politics',
  'cssFiles' => array(
    'stylesheets/politics_map.css',
  ),
  'pageTitle' => '政見地圖',
  'politics' => $politics,
)));

file_put_contents(__DIR__ . '/pub/team.html', $twig->render('team.html', array(
  'baseUrl' => $pubUrl,
  'nav' => 'team',
  'cssFiles' => array(
    'stylesheets/team.css',
  ),
  'pageTitle' => '競選團隊',
)));

foreach($politics AS $politic) {
  $newsInPolitic = array();
  foreach($politic['news'] AS $newsId) {
    $newsInPolitic[] = $pages[$newsId];
  }
  file_put_contents(__DIR__ . '/pub/' . $politic['url'] . '.html', $twig->render('base_politics.html', array(
    'baseUrl' => $pubUrl,
    'nav' => 'politics',
    'cssFiles' => array(
      'stylesheets/politics_content.css',
    ),
    'pageTitle' => '政見::' . $politic['title'],
    'mainContent' => $twig->render('politics_content.html', array(
      'politics' => $politics,
      'politic' => $politic,
      'baseUrl' => $pubUrl,
      'news' => $newsInPolitic,
    )),
  )));
}

$zones = array();
foreach($team AS $politic) {
  if(!isset($zones[$politic['zone']])) {
    $zones[$politic['zone']] = array();
  }
  $zones[$politic['zone']][$politic['title']] = $politic;
}

foreach($team AS $politic) {
  $cards = $zones[$politic['zone']];
  unset($cards[$politic['title']]);
  $ogDescription = $politic['title'] . '::' . mb_substr(str_replace("\n", '', $politic['content']), 0, 250);
  $politic['content'] = nl2br($politic['content']);
  file_put_contents(__DIR__ . '/pub/team/' . $politic['title'] . '.html', $twig->render('base_politics.html', array(
    'baseUrl' => $pubUrl,
    'ogImage' => 'photo/team/' . $politic['title'] . '.jpg',
    'ogDescription' => $ogDescription,
    'nav' => 'team',
    'cssFiles' => array(
      'stylesheets/politics_content.css',
    ),
    'pageTitle' => '團隊::' . $politic['title'],
    'mainContent' => $twig->render('team_content.html', array(
      'politic' => $politic,
      'baseUrl' => $pubUrl,
      'cards' => $cards,
    )),
  )));
}

$fh = fopen(__DIR__ . '/error.csv', 'w');
fputcsv($fh, array('日期', '標題', '網址'));
foreach($errors AS $error) {
  fputcsv($fh, $error);
}

function extractBody($c) {
    global $baseUrl, $targetUrl, $pubUrl, $errors;
    $t = strtotime($c['date']);
    $metaImage = 'img/pic@2x.png';
    $link = substr(str_replace($baseUrl, $targetUrl, $c['link']), 0, -1) . '.html'; //https://huang.olc.tw/wp/2018/09/24/34/
    $content = str_replace($baseUrl, $targetUrl, $c['content']['rendered']);
    $images = extractImages($c['content']['rendered']);
    if(!empty($images)) {
      foreach($images AS $image) {
        $imageFile = 'pub/' . substr($image, 24);
        $p = pathinfo($imageFile);
        if(!file_exists($imageFile)) {
          if(!file_exists($p['dirname'])) {
            mkdir($p['dirname'], 0777, true);
          }
          file_put_contents($imageFile, file_get_contents($image));
        }
      }
      $metaImage = str_replace($baseUrl, $targetUrl, $images[0]);
      $content = str_replace('wp-content/uploads', $pubUrl . '/wp-content/uploads', $content);

      $imgPos = strpos($content, '<img');
      while(false !== $imgPos) {
        $posEnd = strpos($content, '>', $imgPos);
        $imgTag = substr($content, $imgPos, $posEnd - $imgPos + 1);
        $imgTagNew = '<div class="newscontainer__content__img">' . $imgTag . '</div>';
        $posEnd = $imgPos + strlen($imgTagNew);
        $content = str_replace($imgTag, $imgTagNew, $content);
        $imgPos = strpos($content, '<img', $posEnd);
      }
    } else {
      $errors[] = array(
        'date' => date('Y/m/d', $t),
        'title' => $c['title']['rendered'],
        'link' => 'https://weicher.tw/' . $link,
      );
    }

    $result = array(
      'id' => $c['id'],
      'date' => date('Y/m/d', $t),
      'title' => $c['title']['rendered'],
      'link' => $link,
      'content' => $content,
      'metaImage' => $metaImage,
    );
    return $result;
}

function extractImages($c) {
  global $baseUrl;
  $result = array();
  $pos = strpos($c, '<img');
  while(false !== $pos) {
    $pos = strpos($c, $baseUrl, $pos);
    $posEnd = strpos($c, '"', $pos);
    $img = substr($c, $pos, $posEnd - $pos);
    $result[] = $img;

    $pos = strpos($c, $baseUrl, $posEnd);
    $posEnd = strpos($c, '"', $pos);
    $imgs = explode(',', substr($c, $pos, $posEnd - $pos));
    foreach($imgs AS $img) {
      $img = trim($img);
      $imgParts = explode(' ', $img);
      $result[] = $imgParts[0];
    }
    $pos = strpos($c, '<img', $posEnd);
  }
  return $result;
}
