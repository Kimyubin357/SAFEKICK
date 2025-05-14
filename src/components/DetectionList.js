import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DetectionList() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/devices')
      .then(res => setLogs(res.data))
      .catch(err => console.error('❌ 데이터 가져오기 실패:', err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col h-full overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">📝 헬멧 감지 목록</h2>
      <ul className="divide-y ">
        {logs.map((item, idx) => (
          <li key={idx} className="py-3 flex items-center space-x-4">
            <img src={item.img} alt="감지 이미지" className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{item.user}</p>
              <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full text-white 
              ${item.detected ? 'bg-green-500' : 'bg-red-500'}`}>
              {item.detected ? '착용' : '미착용'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DetectionList;
