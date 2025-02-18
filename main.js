const view = new ol.View({
    center: ol.proj.fromLonLat([126.9780, 37.5665]),
    zoom: 10,
  });
  
  const map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        preload: 4,
        source: new ol.source.OSM()
      })
    ],
    view: view
  });
  
  const popupElement = document.getElementById('popup');
  const overlay = new ol.Overlay({
    element: popupElement,
    positioning: 'bottom-center',
    stopEvent: true
  });
  map.addOverlay(overlay);
  
  let features = [];
  fetch('data/asos_stations.json')
    .then(response => response.json())
    .then(data => {
      const vectorSource = new ol.source.Vector();
  
      data.forEach(station => {
        const feature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([station.lon, station.lat])),
          name: station.name.trim(),
          num: station.num.toString(),
          lat: station.lat,
          lon: station.lon
        });
        feature.setStyle(
          new ol.style.Style({
            image: new ol.style.Icon({
              color: '#FFFFFF',
              crossOrigin: 'anonymous',
              src: 'data/dot.svg',
              scale: 1.0
            })
          })
        );
        vectorSource.addFeature(feature);
        features.push(feature);
      });
  
      const vectorLayer = new ol.layer.Vector({
        source: vectorSource
      });
      map.addLayer(vectorLayer);
  
      map.on('pointermove', function (evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
  
        if (feature) {
          const stationName = feature.get('num') + ',' + feature.get('name');
          const coordinates = feature.getGeometry().getCoordinates();
  
          popupElement.innerHTML = stationName;
          overlay.setPosition(coordinates);
        } else {
          overlay.setPosition(undefined); // 클릭한 곳에 마커가 없으면 팝업 숨김
        }
      });
    })
    .catch(error => console.error('Error loading JSON data:', error));
  
  function showPopup() {
    const input = document.getElementById('numInput').value.trim();
    if (!input) {
      alert('입력값 없음');
      return;
    }
  
    if (!isNaN(input)) {
      const feature = features.find(f => f.get('num') === input);
      if (feature) {
        flyTo(ol.proj.fromLonLat([feature.get('lon'), feature.get('lat')]), function() {});
        const coordinates = feature.getGeometry().getCoordinates();
        popupElement.innerHTML = feature.get('num') + ', ' + feature.get('name');
        overlay.setPosition(coordinates);
      } else {
        alert('해당 번호의 관측소를 찾을 수 없습니다.');
        overlay.setPosition(undefined);
      }
    } else {
      const feature = features.find(f => f.get('name') === input);
      if (feature) {
        flyTo(ol.proj.fromLonLat([feature.get('lon'), feature.get('lat')]), function() {});
        const coordinates = feature.getGeometry().getCoordinates();
        popupElement.innerHTML = feature.get('num') + ', ' + feature.get('name');
        overlay.setPosition(coordinates);
      } else {
        alert('해당 이름의 관측소를 찾을 수 없습니다.');
        overlay.setPosition(undefined);
      }
    }
  }
  
  function flyTo(location, done) {
    const duration = 2000;
    const zoom = view.getZoom();
    let parts = 2;
    let called = false;
    function callback(complete) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
  
    view.animate(
      {
        center: location,
        duration: duration,
      },
      callback,
    );
  
    view.animate(
      {
        zoom: zoom - 1,
        duration: duration / 2,
      },
      {
        zoom: zoom,
        duration: duration / 2,
      },
      callback,
    );
  }
  
  // 버튼 클릭 시 showPopup 함수 실행
  document.getElementById('showPopupBtn').addEventListener('click', showPopup);
  
  document.getElementById('numInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      showPopup();
    }
  });
  