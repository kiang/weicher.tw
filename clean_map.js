$(function() {
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
    layers: [baseLayer],
    controls: ol.control.defaults(),
    target: 'map',
    view: appView
  });
})
