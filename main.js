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

var styleParking = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: '#00ff00'
    })
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'blue'
    }),
    text: "P"
  })
});

var styleTainan = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: '#ccff00'
    })
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'blue'
    }),
    text: "G"
  })
});

var styleParks = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: '#00cccc'
    })
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'green'
    }),
    text: "P"
  })
});

var styleAC = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: '#cccc00'
    })
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'red'
    }),
    text: "A"
  })
});

var styleTemple = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: '#00cccc'
    })
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'black'
    }),
    text: "M"
  })
});

var styleTbike = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: '#ffff00'
    })
  }),
  text: new ol.style.Text({
    font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
    fill: new ol.style.Fill({
      color: 'black'
    }),
    text: "T"
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
  var pStyle = styleRed.clone();
  pStyle.getText().setText(p.name);
  return pStyle;
}

var layerPool = {
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
  source: zoneSource
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
      if(p.name) {
        nameFetched = true;
        $('div.mapchoosecontent__introduction__position__name').html(p.name);
        var coordinates = feature.getGeometry().getCoordinates();
        if(isNaN(coordinates[0])) {
          map.getView().setCenter(coordinates[0]);
        } else {
          map.getView().setCenter(coordinates);
        }
        map.getView().setZoom(15);
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

var currentShowingLayer = false;
var vectorSource, vectorReady = {};
$('label.btnLayerPool').click(function() {
  if(false !== currentShowingLayer) {
    map.removeLayer(layerPool[currentShowingLayer]);
  }
  var layerId = $(this).attr('data-id');
  map.addLayer(layerPool[layerId]);
  vectorSource = layerPool[layerId].getSource();
  if(!vectorReady[layerId]) {
    vectorSource.once('change', function(e) {
      if(vectorSource.getState() === 'ready') {
        map.getView().fit(vectorSource.getExtent());
        vectorReady[layerId] = true;
        $('input#controlmapchoosecontent').prop('checked', true);
      }
    });
  } else {
    map.getView().fit(vectorSource.getExtent());
  }
  currentShowingLayer = layerId;
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

    });
  }
})
