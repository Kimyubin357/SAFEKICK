import React, { useEffect, useState } from 'react';
import axios from 'axios';

import DetectionList from './components/DetectionList';
import PMMap from './components/PMMap';
import RealTimeDetection from './components/RealTimeDetection';

function App() {
  const [helmetLogs, setHelmetLogs] = useState([]);
  const [pmList, setPmList] = useState([]);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [selectedPM, setSelectedPM] = useState(null); // 🔹 지도에서 마커 선택 상태

  useEffect(() => {
    axios.get('http://localhost:5000/devices')
      .then(res => {
        setHelmetLogs(res.data);
        if (res.data.length > 0) {
          setSelectedDetection(res.data[0]); // ✅ 첫 항목을 초기 선택값으로
          setSelectedPM(res.data[0]); // 초기 감지 항목에 대한 마커 선택
        }
      })
      .catch(err => console.error('❌ helmet 데이터 불러오기 실패:', err));

    axios.get('http://localhost:5000/public')
      .then(res => setPmList(res.data))
      .catch(err => console.error('❌ 공공 API 데이터 불러오기 실패:', err));
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/events");

    eventSource.onopen = () => {
      console.log("✅ SSE 연결 성공");
    };

    eventSource.onmessage = (e) => {
      try {
        const newItem = JSON.parse(e.data);
        console.log("📥 새 데이터 수신:", newItem);
        setHelmetLogs(prev => [newItem, ...prev]);
        setSelectedDetection(newItem); // ✅ 최신 감지를 가운데에 표시
        setSelectedPM(newItem); // 🔹 insert된 데이터를 지도에서 선택
      } catch (err) {
        console.error("❌ 데이터 파싱 오류:", err);
      }
    };

    eventSource.onerror = (e) => {
      console.error("❌ SSE 오류:", e);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex flex-col p-7 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6">SAFE KICK</h1>

      <div className="grid grid-cols-3 gap-4 flex-1 h-0">
        {/* 왼쪽: 장치 목록 */}
        <DetectionList
          helmetLogs={helmetLogs}
          onSelect={(item) => {
            setSelectedDetection(item);
            setSelectedPM(item); // 리스트에서 선택 시 지도 반영
          }}
        />

        {/* 가운데: 실시간 감지 */}
        <RealTimeDetection detection={selectedDetection} />

        {/* 오른쪽: 지도 */}
        <PMMap 
          pmList={pmList} 
          helmetLogs={helmetLogs} // 추가
          selectedPM={selectedPM} // 현재 선택된 마커
          onSelectPM={(pm) => setSelectedPM(pm)} // 지도에서 클릭 시 반응
        />
      </div>
    </div>
  );
}

export default App;
