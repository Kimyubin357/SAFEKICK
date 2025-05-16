import React, { useEffect, useState } from 'react';
import axios from 'axios';

import DetectionList from './components/DetectionList';
import PMMap from './components/PMMap';

function App() {
  const [helmetLogs, setHelmetLogs] = useState([]);
  const [pmList, setPmList] = useState([]);
  const [selectedDetection, setSelectedDetection] = useState(null);

  useEffect(() => {
    // MongoDB 데이터 불러오기
    axios.get('http://localhost:5000/devices')
      .then(res => setHelmetLogs(res.data))
      .catch(err => console.error('❌ helmet 데이터 불러오기 실패:', err));

    // 공공 API 데이터 불러오기
    axios.get('http://localhost:5000/public')
      .then(res => setPmList(res.data))
      .catch(err => console.error('❌ 공공 API 불러오기 실패:', err));
  }, []);

  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col p-7">
      <h1 className="text-3xl font-bold mb-6">SAFE KICK</h1>

      <div className="grid grid-cols-3 gap-4 flex-1 h-0">
       
          {/* 왼쪽: 장치 목록 */}
          <DetectionList helmetLogs={helmetLogs} />
      
        {/* 가운데: 실시간 감지 */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center h-full">
          <h2 className="text-xl font-semibold mb-4">실시간 감지</h2>
          {selectedDetection ? (
            <>
              <img src={selectedDetection.imageUrl} alt="latest" className="w-40 h-40 rounded-lg object-cover mb-4" />
              <div className="text-left w-full max-w-xs space-y-1 text-sm">
                <p><strong>사용자:</strong> {selectedDetection.user}</p>
                <p><strong>착용여부:</strong> 
                  <span className={`ml-2 font-semibold ${selectedDetection.helmet ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedDetection.helmet ? '착용' : '미착용'}
                  </span>
                </p>
                <p><strong>탑승 시간:</strong> {selectedDetection.time}</p>
              </div>
            </>
          ) : <p>데이터 없음</p>}
        </div>

     
          {/* 오른쪽: 지도 */}
          <PMMap pmList={pmList} />
      
        
        
      </div>
    </div>
    
    
  );
  
}

export default App;
