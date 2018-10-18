var styleRed = new ol.style.Style({
  stroke: new ol.style.Stroke({
      color: 'rgba(255,0,0,1)',
      width: 6
  }),
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: '#ff0000'
    })
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'black'
    })
  })
});

var styleZone = new ol.style.Style({
  stroke: new ol.style.Stroke({
      color: 'rgba(255,255,0,1)',
      width: 3
  }),
  fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0.1)'
  })
});

var styleParking = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.3,
    src: 'img/parking@2x.png'
  })
});

var styleTainan = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.3,
    src: 'img/building@2x.png'
  })
});

var styleParks = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.3,
    src: 'img/park@2x.png'
  })
});

var styleAC = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.3,
    src: 'img/activity@2x.png'
  })
});

var styleTemple = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.3,
    src: 'img/temple@2x.png'
  })
});

var styleTbike = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.3,
    src: 'img/bike@2x.png'
  })
});

var lineRed = new ol.style.Style({
  stroke: new ol.style.Stroke({
      color: 'rgba(255,0,0,0.6)',
      width: 6
  }),
  image: new ol.style.RegularShape({
      fill: new ol.style.Fill({
          color: 'rgba(200,0,0,0.6)'
      }),
      stroke: new ol.style.Stroke({
          color: 'rgba(0,0,0,0.3)',
          width: 2
      }),
      points: 3,
      radius: 10,
      radius2: 5
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,1)'
    })
  })
});

var lineWater = new ol.style.Style({
  stroke: new ol.style.Stroke({
      color: 'rgba(0,0,255,1)',
      width: 6
  })
});

var lineGreen = new ol.style.Style({
  stroke: new ol.style.Stroke({
      color: 'rgba(0,255,0,0.6)',
      width: 6
  }),
  image: new ol.style.RegularShape({
      fill: new ol.style.Fill({
          color: 'rgba(0,200,0,0.6)'
      }),
      stroke: new ol.style.Stroke({
          color: 'rgba(0,0,0,0.3)',
          width: 2
      }),
      points: 3,
      radius: 10,
      radius2: 5
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,1)'
    })
  })
});

var lineBlue = new ol.style.Style({
  stroke: new ol.style.Stroke({
      color: 'rgba(0,0,200,0.6)',
      width: 6
  }),
  image: new ol.style.RegularShape({
      fill: new ol.style.Fill({
          color: 'rgba(0,0,200,0.6)'
      }),
      stroke: new ol.style.Stroke({
          color: 'rgba(0,0,0,0.3)',
          width: 2
      }),
      points: 3,
      radius: 10,
      radius2: 5
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,1)'
    })
  })
});

var lineWalk = new ol.style.Style({
  stroke: new ol.style.Stroke({
      color: 'rgba(200,200,0,0.6)',
      width: 6
  })
});

var projection = ol.proj.get('EPSG:3857');
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(20);
var matrixIds = new Array(20);
for (var z = 0; z < 20; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
}
var nlscMatrixIds = new Array(21);
for (var i=0; i<21; ++i) {
  nlscMatrixIds[i] = i;
}

var styleLine = function(feature) {
  var p = feature.getProperties(), lineStyle;
  switch(p['路線']) {
    case '紅線':
    lineStyle = lineRed.clone();
    break;
    case '綠線':
    lineStyle = lineGreen.clone();
    break;
    case '藍線':
    lineStyle = lineBlue.clone();
    break;
  }
  if(p['站名']) {
    lineStyle.getText().setText(p['站名']);
  }
  return lineStyle;
};

var stylePoints = function(f) {
  var p = f.getProperties();
  if(p.icon) {
    var pStyle = new ol.style.Style({
      image: new ol.style.Icon({
        scale: 0.3,
        src: 'img/' + p.icon + '@2x.png'
      })
    });
  } else {
    var pStyle = styleRed.clone();
    pStyle.getText().setText(p.name);
  }
  return pStyle;
}

var mainPool = {
  culture: {
    title: '文化首府',
    layers: ['bus', 'tbike', 'monorail'],
    icon: 'temple-b@2x.png',
    text: '<h3>文化立市：文史觀旅城市</h3><p>打造行人為主體的歷史街區，結合古蹟、文資與美食的城市博物館，並打造多元藝文展演空間，並串聯山海大台南觀旅資源。</p>'
  },
  economic: {
    title: '產經重鎮',
    layers: ['points'],
    icon: 'factory-b@2x.png',
    text: '<h3>百業興盛：產經發展城市</h3><p>實現規模農業經濟與智慧產銷調節，以南科沙崙雙引擎帶動大台南產業發展，並將安平港打造為北觀光、南自貿的智慧港灣。</p>'
  },
  smart: {
    title: '智慧新都',
    layers: ['tainan'],
    icon: 'building-b@2x.png',
    text: '<h3>數據治理：智慧服務城市</h3><p>成立智慧城市辦公室，將智慧服務扣連青創動能，推出數位市民卡強化公共服務及數據治理，進而打造「全場域」的智慧服務城市。</p>'
  },
  creative: {
    title: '創生城鄉',
    layers: ['ac'],
    icon: 'activity-b@2x.png',
    text: '<h3>區域平衡：均衡發展城市</h3><p>於大台南地理中心，打造智慧數位且綠能循環的未來城鎮，並串聯高快速交通網絡、提供綿密多點式公共服務，全力消弭區域落差。</p>'
  },
  hope: {
    title: '希望家園',
    layers: ['park'],
    icon: 'park-b@2x.png',
    text: '<h3>溫暖關懷：宜居築夢城市</h3><p>解決青年問題，增加勞安基金照顧勞工、成立勞檢處落實勞檢，多元滿足育嬰及教育服務，打造有感青創平台。並致力共榮多元族群，且建置愛心倉儲及共同廚房等，增加對弱老的照顧。</p>'
  }
};

var layerPool = {
  bus: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/bus.json',
      format: new ol.format.GeoJSON()
    })
  }),
  points: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/points.json',
      format: new ol.format.GeoJSON()
    }),
    style: stylePoints
  }),
  parking: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/parking.json',
      format: new ol.format.GeoJSON()
    }),
    style: styleParking
  }),
  tbike: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/tbike.json',
      format: new ol.format.GeoJSON()
    }),
    style: styleTbike
  }),
  walking: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/walking.json',
      format: new ol.format.GeoJSON()
    }),
    style: lineWalk
  }),
  monorail: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/lines.json',
      format: new ol.format.GeoJSON()
    }),
    style: styleLine
  }),
  temples: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/temples.json',
      format: new ol.format.GeoJSON()
    }),
    style: styleTemple
  }),
  water: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/water.json',
      format: new ol.format.GeoJSON()
    }),
    style: lineWater
  }),
  park: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/parks.json',
      format: new ol.format.GeoJSON()
    }),
    style: styleParks
  }),
  ac: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/ac.json',
      format: new ol.format.GeoJSON()
    }),
    style: styleAC
  }),
  tainan: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'json/tainan.json',
      format: new ol.format.GeoJSON()
    }),
    style: styleTainan
  })
};

var zoneSource = new ol.source.Vector({
  url: 'json/zones.json',
  format: new ol.format.GeoJSON()
});

var vector = new ol.layer.Vector({
  source: zoneSource,
  style: styleZone
});

var baseLayer = new ol.layer.Tile({
    source: new ol.source.WMTS({
        matrixSet: 'EPSG:3857',
        format: 'image/png',
        url: 'https://wmts.nlsc.gov.tw/wmts',
        layer: 'EMAP',
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: true,
        attributions: '<a href="https://maps.nlsc.gov.tw/" target="_blank">國土測繪圖資服務雲</a>'
    }),
    opacity: 0.5
});

var appView = new ol.View({
  center: ol.proj.fromLonLat([120.20047187805177, 22.997666465378202]),
  zoom: 14
});

var map = new ol.Map({
  layers: [baseLayer, vector],
  controls: ol.control.defaults(),
  target: 'map',
  view: appView
});

var geolocation = new ol.Geolocation({
  projection: appView.getProjection()
});

geolocation.setTracking(true);

geolocation.on('error', function(error) {
        console.log(error.message);
      });

var positionFeature = new ol.Feature();

positionFeature.setStyle(new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({
      color: '#3399CC'
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2
    })
  })
}));

var changeTriggered = false;
geolocation.on('change:position', function() {
  var coordinates = geolocation.getPosition();
  if(coordinates) {
    positionFeature.setGeometry(new ol.geom.Point(coordinates));
    if(false === changeTriggered) {
      var lonLat = ol.proj.toLonLat(coordinates);
      if(lonLat[0] >= 120.19962474795 && lonLat[0] <= 120.21603569449 && lonLat[1] >= 23.06772210296 && lonLat[1] <= 23.081301926211) {
        var mapView = map.getView();
        mapView.setCenter(coordinates);
        mapView.setZoom(17);
      }
      changeTriggered = true;
    }
  }
});

new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [positionFeature]
  })
});

var lastFeature = false;
var lastStyle;

map.on('singleclick', function(evt) {
  var nameFetched = false;
  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    var p = feature.getProperties();
    if(false === nameFetched) {
      if(p.路線) {
        p.name = '輕軌::' + p.路線;
      }
      if(p.name) {
        nameFetched = true;
        $('div.mapchoosecontent__introduction__position__name').html(p.name);
      }
    }
    if(p.areas) {
      $('div.mapchoosecontent__introduction__position__address').html(p.areas);
    }
  });
  $('#location1_intro').show();
  $('.mapchoosecontent__introduction__control').click(function() {
    $('#location1_intro').hide();
    return false;
  });
  $('input#controlmapchoosecontent').prop('checked', false);
});

var currentShowingLayers = false;
var vectorReady = {};
var currentTopic = '';
$('label.btnLayerPool').click(function() {
  $('input#controlmapchoosecontent').prop('checked', true);
  if(false !== currentShowingLayers) {
    for(k in currentShowingLayers) {
      map.removeLayer(layerPool[currentShowingLayers[k]]);
    }
  }
  currentShowingLayers = [];
  currentTopic = $(this).attr('data-id');
  $('div.mapchoosecontent__introduction__title').html(mainPool[currentTopic].title);
  $('div.mapchoosecontent__introduction__icon > img').attr('src', baseUrl + '/img/' + mainPool[currentTopic].icon);
  $('div.mapchoosecontent__introduction__text').html(mainPool[currentTopic].text);
  for(k in mainPool[currentTopic].layers) {
    var layerKey = mainPool[currentTopic].layers[k];
    currentShowingLayers.push(layerKey);
    vectorReady[layerKey] = false;
    map.addLayer(layerPool[layerKey]);
  }
  return false;
});

zoneSource.on('change', function(e) {
  if(zoneSource.getState() == 'ready') {
    var selectOptions = '<option value="">---</option>';
    var targetSelect = $('.mapchoosecontent__select');
    zoneSource.forEachFeature(function(f) {
      var fp = f.getProperties();
      selectOptions += '<option value="' + fp.zone_id + '">' + fp.areas + '</option>';
    })
    targetSelect.html(selectOptions);
    targetSelect.change(function() {
      var zid = $(this).val();
      zoneSource.forEachFeature(function(f) {
        if(f.get('zone_id') == zid) {
          map.getView().fit(f.getGeometry());
        }
      })
      $('input#controlmapchoosecontent').prop('checked', true);
    });
  }
})
