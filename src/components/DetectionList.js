import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format, isSameDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

function DetectionList({ helmetLogs, onSelect }) {
  const [filter, setFilter] = useState('전체');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLogs = helmetLogs.filter(item => {
    const timestamp = new Date(item.timestamp);
    const matchDate = isSameDay(timestamp, selectedDate);
    const matchFilter =
      filter === '전체' ? true : filter === '착용' ? item.detected : !item.detected;
    return matchDate && matchFilter;
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col h-full overflow-hidden relative">
      {/* 상단 타이틀 + 날짜 필터 */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">📝 헬멧 감지 목록</h2>

        <div className="relative">
          <button
            className="text-sm px-3 py-1 border rounded-lg bg-white hover:bg-gray-100"
            onClick={() => setShowCalendar(prev => !prev)}
          >
            📅 {format(selectedDate, 'yyyy-MM-dd')}
          </button>

          {showCalendar && (
            <div className="absolute right-0 mt-2 z-20">
              <DatePicker
                selected={selectedDate}
                onChange={date => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
                inline
              />
            </div>
          )}
        </div>
      </div>

      {/* 행 머리글 */}
      <div className="grid grid-cols-4 gap-4 px-2 py-2 text-sm font-bold border-b border-gray-300 sticky top-0 bg-white z-10">
        <div>이미지</div>
        <div>사용자</div>
        <div>시간</div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className="cursor-pointer hover:text-blue-600 select-none flex items-center gap-1"
          >
            착용 여부 <span>🔽</span>
          </button>
          <div className="text-xs text-gray-500 mt-1">{filter}</div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 rounded shadow z-20">
              {['전체', '착용', '미착용'].map(option => (
                <div
                  key={option}
                  onClick={() => {
                    setFilter(option);
                    setShowDropdown(false);
                  }}
                  className={`px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer ${
                    filter === option ? 'bg-blue-50 font-semibold' : ''
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto pr-1">
        <ul className="divide-y divide-gray-200">
          {filteredLogs.map((item, idx) => (
            <li
              key={item._id || idx}
              className="grid grid-cols-4 gap-4 items-center px-2 py-3 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => onSelect(item)}
            >
              <img
                src={`data:image/jpeg;base64,${item.img}`}
                alt="감지 이미지"
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>{item.user}</div>
              <div>
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
              <div className="p-3 flex justify-center">
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
