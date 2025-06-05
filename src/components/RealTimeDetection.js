import React from 'react';

function RealTimeDetection({ detection }) {
  const handleLiveStreaming = async () => {
  try {
    const res = await fetch('http://localhost:5000/live', {
      method: 'POST',
    });

    const data = await res.json();
    if (data.status) {
      alert('✅ camera.py 실행 요청이 전송되었습니다!');
    }
  } catch (err) {
    console.error(err);
    alert('❌ 실행 실패: 서버와 통신할 수 없습니다.');
  }
};
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col h-full w-full">
      <h2 className="text-xl font-bold mb-4">실시간 감지</h2>

      {detection ? (
        <>
          {/* 상단: 이미지 + 사용자 정보 */}
          <div className="flex-1 flex flex-row gap-6 items-center justify-center">
            <img
              src={`data:image/jpeg;base64,${detection.img}`}
              alt="감지 이미지"
              className="w-48 h-48 object-cover rounded-lg"
            />
            <div className="text-sm space-y-2 mt-1">
              <p>
                <strong className="inline-block w-20">사용자</strong>
                <span className="font-semibold">{detection.user}</span>
              </p>
              <p>
                <strong className="inline-block w-20">착용여부</strong>
                <span
                  className={`text-xs px-2 py-1 rounded-full text-white font-semibold ${
                    detection.detected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {detection.detected ? '착용' : '미착용'}
                </span>
                
              </p>
              <p>
                <strong className="inline-block w-20">탑승 시간</strong>
                {new Date(detection.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <button
              onClick={handleLiveStreaming} 
              className='font-xs px-2 py-1 rounded-full bg-black text-white font-semibold'>Live Streaming</button>
            </div>
          </div>

          {/* 구분선: 프레임 가운데에 위치 */}
          <hr className=" top-1/2 left-0 w-full border-t border-gray-300 z-0" />

          {/* 하단 상세 정보 */}
          <div className='flex-1 flex items-center justify-center'>
          <div className="text-sm space-y-2 leading-relaxed">
            <p>
              <strong className="inline-block w-20">기기 ID</strong>
              {detection.vehicleid}
            </p>
            <p>
              <strong className="inline-block w-20">배터리</strong>
              {detection.battery}%
            </p>
            <p>
              <strong className="inline-block w-20">위치 정보</strong>
              위도 {detection.latitude}, 경도 {detection.longitude}
            </p>
            <p>
              <strong className="inline-block w-20">도시명</strong>
              {detection.cityname}
            </p>
            <p>
              <strong className="inline-block w-20">제공자</strong>
              {detection.providername}
            </p>
          </div>
          </div>
        </>
      ) : (
        <p>데이터 없음</p>
      )}
    </div>
  );
}

export default RealTimeDetection;
