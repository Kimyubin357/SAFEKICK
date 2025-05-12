// SAFE KICK 디버그 + 상세 정보 표시 버전 (Kakao Map)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';

function PMProviderMap() {
  const [pmList, setPmList] = useState([]);
  const [selectedPM, setSelectedPM] = useState(null);

  useEffect(() => {
    const fetchPMList = async () => {
      try {
        const response = await axios.get('https://apis.data.go.kr/1613000/PersonalMobilityInfoService/getPMListByProvider', {
          params: {
            serviceKey: '8sVO3UHb5EeQak+PS+n1qHdqjYb6VTTbXLk1hgM7F5pg6P/2X+Uiwr3AjGqhS1bN0yw7WN8UJ7OJ6R9LXGpSvA==',
            _type: 'json',
            pageNo: 1,
            numOfRows: 100,
            providerName: 'GBIKE',
            cityCode: 12
          }
        });

        const itemData = response.data.response?.body?.items?.item;
        console.log('✅ 원시 API 응답:', response.data);
        console.log('🛠️ 추출된 item:', itemData);

        if (Array.isArray(itemData)) {
          setPmList(itemData);
        } else if (itemData) {
          setPmList([itemData]);
        } else {
          console.warn('⚠️ PM 데이터가 없음');
          setPmList([]);
        }
      } catch (error) {
        console.error('❌ API 호출 실패:', error);
      }
    };

    fetchPMList();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">세종특별시 GBIKE 킥보드 위치 (상세정보 포함)</h1>
      <Map center={{ lat: 36.4801, lng: 127.2891 }} level={5} style={{ width: '100%', height: '500px' }}>
        {Array.isArray(pmList) && pmList.map((pm, index) => {
          const lat = parseFloat(pm.latitude);
          const lng = parseFloat(pm.longitude);
          const valid = !isNaN(lat) && !isNaN(lng);
          if (!valid) return null;

          return (
            <MapMarker
              key={index}
              position={{ lat, lng }}
              onClick={() => setSelectedPM(pm)}
              title={`PM-${pm.vehicleid}`}
            />
          );
        })}

        {selectedPM && (
          <MapInfoWindow
            position={{ lat: parseFloat(selectedPM.latitude), lng: parseFloat(selectedPM.longitude) }}
            onCloseClick={() => setSelectedPM(null)}
          >
            <div style={{ padding: "8px", minWidth: "180px" }}>
              <div><strong>기기 ID:</strong> {selectedPM.vehicleid}</div>
              <div><strong>배터리:</strong> {selectedPM.battery}%</div>
              <div><strong>제공자:</strong> {selectedPM.providername}</div>
              <div><strong>도시명:</strong> {selectedPM.cityname}</div>
              <div><strong>좌표:</strong> {selectedPM.latitude}, {selectedPM.longitude}</div>
            </div>
          </MapInfoWindow>
        )}
      </Map>
    </div>
  );
}

export default PMProviderMap;
