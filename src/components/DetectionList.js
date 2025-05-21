import React from 'react';

function DetectionList({ helmetLogs, onSelect }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col h-full overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">📝 헬멧 감지 목록</h2>

      {/* 🧭 행 머리글 */}
      <div className="grid grid-cols-4 gap-4 px-2 py-2 text-sm font-bold border-b border-gray-300 sticky top-0 bg-white z-10">
        <div>이미지</div>
        <div>사용자</div>
        <div>시간</div>
        <div>착용 여부</div>
      </div>

      {/* 📜 리스트 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pr-1">
        <ul className="divide-y divide-gray-200">
          {helmetLogs.map((item, idx) => (
            <li
              key={item._id || idx}
              className="grid grid-cols-4 gap-4 items-center px-2 py-3 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => onSelect(item)}
            >
              {/* 이미지 */}
              <img
                src={`data:image/jpeg;base64,${item.img}`}
                alt="감지 이미지"
                className="w-14 h-14 rounded-lg object-cover"
              />

              {/* 사용자 */}
              <div>{item.user}</div>

              {/* 시간 */}
              <div>
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>

              {/* 착용 여부 */}
              <div className='p-4 flex justify-center'>
                <span
                  className={`text-xs px-2 py-1 rounded-full text-white ${
                    item.detected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {item.detected ? '착용' : '미착용'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DetectionList;
