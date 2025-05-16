// ✅ PMMap.js - selectedPM 중심 이동은 유지하되 해제 시 초기화 안 되도록 개선
import React, { useEffect, useRef, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

function PMMap({ pmList, selectedPM, onSelectPM, helmetLogs }) {
  const [mapCenter, setMapCenter] = useState({ lat: 36.4716, lng: 127.2772 });
  const mapRef = useRef();

  // insert 발생 시 자동 선택 + 지도 중심 이동
  useEffect(() => {
    if (helmetLogs.length > 0) {
      const latest = helmetLogs[0];
      if (latest && latest.latitude && latest.longitude) {
        onSelectPM(latest);
      }
    }
  }, [helmetLogs]);

  // selectedPM이 바뀔 때에만 지도 중심 이동
  useEffect(() => {
    if (selectedPM && selectedPM.latitude && selectedPM.longitude) {
      const lat = parseFloat(selectedPM.latitude);
      const lng = parseFloat(selectedPM.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
      }
    }
  }, [selectedPM]);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col overflow-auto relative">
      <h2 className="text-xl font-bold mb-4">🛴 공유 킥보드 지도</h2>

      <div className="relative" style={{ height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
        <Map
          center={mapCenter} // 유지되는 center
          style={{ width: '100%', height: '100%' }}
          level={5}
          onClick={() => onSelectPM(null)}
          ref={mapRef}
        >
          {/* 🔵 공공 데이터 마커 */}
          {pmList.map((pm, idx) => {
            const lat = parseFloat(pm.latitude);
            const lng = parseFloat(pm.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            const isSelected = selectedPM && selectedPM.vehicleid === pm.vehicleid;

            return (
              <MapMarker
                key={`public-${pm.vehicleid || idx}`}
                position={{ lat, lng }}
                onClick={(e) => {
                  e.stopPropagation?.();
                  onSelectPM(pm);
                }}
                image={{
                  src: isSelected
                    ? '/black-scooter-icon.png'
                    : '/green-scooter-icon.png',
                  size: { width: 32, height: 32 },
                }}
              />
            );
          })}

          {/* 🔴 MongoDB 헬멧 감지 데이터 마커 */}
          {helmetLogs.map((log, idx) => {
            const lat = parseFloat(log.latitude);
            const lng = parseFloat(log.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            const isSelected = selectedPM && selectedPM._id === log._id;

            return (
              <MapMarker
                key={`helmet-${log._id || idx}`}
                position={{ lat, lng }}
                onClick={(e) => {
                  e.stopPropagation?.();
                  onSelectPM(log);
                }}
                image={{
                  src: isSelected
                    ? '/black-scooter-icon.png'
                    : '/red-helmet-icon.png',
                  size: { width: 32, height: 32 },
                }}
              />
            );
          })}

          {/* 지도 내부에서 하단에 뜨는 팝업 */}
          <div
            className={`absolute bottom-0 left-0 w-full rounded-lg border-gray-300 bg-white shadow-lg border-t transition-transform duration-300 z-[999] ${
              selectedPM ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ height: '180px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedPM && (
              <div className="p-4 text-sm leading-6">
                <div><strong>기기 ID:</strong> {selectedPM.vehicleid}</div>
                <div><strong>배터리:</strong> {selectedPM.battery}%</div>
                <div><strong>위치:</strong> 위도 {selectedPM.latitude}, 경도 {selectedPM.longitude}</div>
                <div><strong>도시명:</strong> {selectedPM.cityname}</div>
                <div><strong>제공자:</strong> {selectedPM.providername}</div>
              </div>
            )}
          </div>
        </Map>
      </div>
    </div>
  );
}

export default PMMap;
