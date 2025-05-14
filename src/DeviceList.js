import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/devices');
        setDevices(res.data.reverse()); // 최근 기록 먼저
        setSelectedDevice(res.data[res.data.length - 1]); // 최신 기록을 실시간 감지에 표시
      } catch (err) {
        console.error('❌ 장치 목록 조회 실패:', err);
      }
    };
    fetchDevices();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* 감지 조회 테이블 */}
      <div className="w-full lg:w-1/2 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">감지 조회</h2>
        <div className="overflow-y-auto max-h-[400px]">
          <table className="table-auto w-full">
            <thead className="text-left font-semibold border-b">
              <tr>
                <th>이미지</th>
                <th>시간</th>
                <th>착용여부</th>
                <th>사용자</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDevice(device)}>
                  <td><img src={device.imageUrl} alt="helmet" className="w-12 h-12 object-cover rounded" /></td>
                  <td>{device.time}</td>
                  <td>
                    <span className={`text-white px-2 py-1 rounded text-sm ${device.helmet ? 'bg-green-500' : 'bg-red-500'}`}>
                      {device.helmet ? '착용' : '미착용'}
                    </span>
                  </td>
                  <td>{device.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 실시간 감지 */}
      <div className="w-full lg:w-1/2 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">실시간 감지</h2>
        {selectedDevice ? (
          <div className="flex flex-col items-center">
            <img src={selectedDevice.imageUrl} alt="latest" className="w-48 h-48 object-cover rounded-lg mb-4" />
            <div className="text-left w-full max-w-sm">
              <p><strong>사용자:</strong> {selectedDevice.user}</p>
              <p><strong>착용여부:</strong> <span className={`font-semibold ${selectedDevice.helmet ? 'text-green-600' : 'text-red-600'}`}>{selectedDevice.helmet ? '착용' : '미착용'}</span></p>
              <p><strong>탑승 시간:</strong> {selectedDevice.time}</p>
            </div>
          </div>
        ) : (
          <p>선택된 감지 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default DeviceList;
