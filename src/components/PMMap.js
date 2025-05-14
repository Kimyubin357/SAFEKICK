import React, { useState } from 'react';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';

function PMMap({ pmList }) {
    const [selectedPM, setSelectedPM] = useState(null);
  
    return (
      <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col overflow-auto">
        <h2 className="text-xl font-bold mb-4">🛴 공유 킥보드 지도</h2>
  
        <Map
          center={{ lat: 36.4716, lng: 127.2772 }} // 세종시 중심
          style={{ width: '100%', height: '400px', borderRadius: '12px' }}
          level={5}
        >
          {pmList.map((pm, idx) => {
            const lat = parseFloat(pm.latitude);
            const lng = parseFloat(pm.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;
  
            return (
              <MapMarker
                key={idx}
                position={{ lat, lng }}
                onClick={() => setSelectedPM(pm)}
                image={{
                  src: pm.battery < 30
                    ? '/black-scooter-icon.png'
                    : '/green-scooter-icon.png',
                  size: { width: 32, height: 32 },
                }}
              />
            );
          })}
  
          {selectedPM && (
            <MapInfoWindow
              position={{
                lat: parseFloat(selectedPM.latitude),
                lng: parseFloat(selectedPM.longitude),
              }}
              onCloseClick={() => setSelectedPM(null)}
            >
              <div className="text-sm leading-6">
                <div><strong>기기 ID:</strong> {selectedPM.vehicleid}</div>
                <div><strong>배터리:</strong> {selectedPM.battery}%</div>
                <div><strong>위치 정보:</strong> 위도 {selectedPM.latitude}, 경도 {selectedPM.longitude}</div>
                <div><strong>도시명:</strong> {selectedPM.cityname}</div>
                <div><strong>제공자:</strong> {selectedPM.providername}</div>
              </div>
            </MapInfoWindow>
          )}
        </Map>
      </div>
    );
  }
  
  export default PMMap;