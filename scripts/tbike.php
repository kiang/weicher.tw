<?php
$fc = array(
  'type' => 'FeatureCollection',
  'features' => array(),
);
$json = json_decode(file_get_contents('http://tbike.tainan.gov.tw:8081/Service/StationStatus/Json'), true);
foreach($json AS $point) {
  $fc['features'][] = array(
    'type' => 'Feature',
    'properties' => array(
      'name' => 'T-Bike ' . $point['StationName'],
    ),
    'geometry' => array(
      'type' => 'Point',
      'coordinates' => array(
        $point['Longitude'],
        $point['Latitude'],
      ),
    ),
  );
}

file_put_contents(dirname(__DIR__) . '/tbike.json', json_encode($fc));
