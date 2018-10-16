var colorBlank = new ol.style.Style({
  fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0.3)'
  }),
  stroke: new ol.style.Stroke({
      color: 'rgba(0,0,0,0.6)',
      width: 2
  })
});

var colorGreen = new ol.style.Style({
  fill: new ol.style.Fill({
      color: 'rgba(0,255,0,0.6)'
  }),
  stroke: new ol.style.Stroke({
      color: 'rgba(0,0,0,0.6)',
      width: 2
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

var zoneSource = new ol.source.Vector({
  url: 'json/zones.json',
  format: new ol.format.GeoJSON()
});

var vector = new ol.layer.Vector({
  source: zoneSource,
  style: colorBlank
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
  var zoneFetched = false;
  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    var p = feature.getProperties();
    if(false === zoneFetched && p.zone_id) {
      zoneFetched = p.zone_id;
      $('.mapchoosecontent__select').val(p.zone_id).trigger('change');
    }
  });
  if(zoneFetched) {
    $('input#controlmapchoosecontent').prop('checked', false);
  }
});

$('label.btnTeam').click(function() {
  var p = $(this).attr('data-id');
  location.href = baseUrl + '/team/' + p + '.html';
  return false;
});

var zoneSourceDone = false;
zoneSource.on('change', function(e) {
  if(false === zoneSourceDone && zoneSource.getState() == 'ready') {
    zoneSourceDone = true;
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
          if(false !== lastFeature) {
            lastFeature.setStyle(colorBlank);
          }
          lastFeature = f;
          lastFeature.setStyle(colorGreen);
          map.getView().fit(lastFeature.getGeometry());
        }
      })
      $('label.btnTeam').each(function() {
        var btnZone = $(this).attr('data-zone');
        if(btnZone == 12 || btnZone == zid) {
          $(this).show();
        } else {
          $(this).hide();
        }
      })
    });
  }
})
