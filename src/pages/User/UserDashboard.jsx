/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import dayjs from 'dayjs';
import { useLoader } from '../../context/LoaderContext';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const UserDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [eventData, setEventData] = useState({ upcoming: 0, past: 0, tickets: 0, bookings: [] });
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortOption, setSortOption] = useState('date-newest');
  const [activeTab, setActiveTab] = useState('overview');
  const { setIsLoading } = useLoader();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  useEffect(() => {
    setTimeout(() => {
      setEventData({
        upcoming: 3,
        past: 19,
        tickets: 12,
        bookings: [
          { name: 'Music Festival', date: 'April 24, 2024' },
          { name: 'Tech Conference', date: 'May 5, 2024' },
          { name: 'Art Expo', date: 'May 15, 2024' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Attendance',
      data: [120, 190, 300, 250, 400],
      borderColor: '#00b5d8',
      tension: 0.4,
      fill: false,
      pointBackgroundColor: '#00b5d8'
    }]
  };

  const generateCalendarDays = (date) => {
    const startOfMonth = date.startOf('month');
    const endOfMonth = date.endOf('month');
    const startDay = startOfMonth.day();
    const totalDays = endOfMonth.date();

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return days;
  };

  const handlePrevMonth = () => setCurrentDate(prev => prev.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentDate(prev => prev.add(1, 'month'));

  const days = generateCalendarDays(currentDate);
  const today = dayjs();

  const sortedBookings = [...eventData.bookings].sort((a, b) => {
    if (sortOption === 'date-newest') return new Date(b.date) - new Date(a.date);
    if (sortOption === 'date-oldest') return new Date(a.date) - new Date(b.date);
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  const textColor = darkMode ? 'text-white' : 'text-black';
  const bgColor = darkMode ? 'bg-black' : 'bg-gray-50';
  const cardColor = darkMode ? 'bg-gray-800/60' : 'bg-gray-50';
  const accentColor = 'text-cyan-500';

  return (
    <div className={`flex ${bgColor} ${textColor} min-h-screen pt-20`}>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button className="bg-cyan-500 text-white px-3 py-2 rounded-lg shadow-md">☰ Menu</button>
      </div>

      <aside className={`hidden md:flex w-64 ${cardColor} px-6 py-10 md:py-12 flex-col justify-between rounded-r-2xl fixed top-20 left-0 h-[calc(100vh-6rem)] z-40`}>
        <div>
          <nav className="space-y-6">
            <button
              className={`w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300 text-gray-400 hover:bg-gray-800/50 hover:text-white ${activeTab === 'overview' ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-500' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="ml-4">📊</span>
              <span className="ml-4">Overview</span>
            </button>
            <button
              className={`w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300 text-gray-400 hover:bg-gray-800/50 hover:text-white ${activeTab === 'attendees' ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-500' : ''}`}
              onClick={() => setActiveTab('attendees')}
            >
              <span className="ml-4">👥</span>
              <span className="ml-4">Attendees</span>
            </button>
            <button
              className={`w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300 text-gray-400 hover:bg-gray-800/50 hover:text-white ${activeTab === 'events' ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-500' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <span className="ml-4">📅</span>
              <span className="ml-4">Events</span>
            </button>
            <button
              className={`w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300 text-gray-400 hover:bg-gray-800/50 hover:text-white ${activeTab === 'settings' ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-500' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="ml-4">⚙</span>
              <span className="ml-4">Settings</span>
            </button>
          </nav>
        </div>
        <div className="pt-6 mt-6 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">EP</div>
            <div>
              <div className="text-sm font-semibold">Event Pro</div>
              <div className="text-xs text-gray-400">Premium Plan</div>
            </div>
          </div>
        </div>
      </aside>

      <main className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 ml-0 md:ml-64 space-y-6`}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2">☀</span>
              <input type="checkbox" className="hidden" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center">
                <span className={`w-4 h-4 bg-white rounded-full transform transition-transform ${darkMode ? 'translate-x-5' : ''}`}></span>
              </span>
              <span className="ml-2">🌙</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <div className={`${cardColor} px-5 py-2.5 rounded-xl`}>
            <div className="text-lg mb-2">Upcoming Events</div>
            <div className="text-white text-2xl font-bold">{eventData.upcoming}</div>
          </div>
          <div className={`${cardColor} px-5 py-2.5 rounded-xl`}>
            <div className="text-lg mb-2">Past Events</div>
            <div className="text-white text-2xl font-bold">{eventData.past}</div>
          </div>
          <div className={`${cardColor} px-5 py-2.5 rounded-xl`}>
            <div className="text-lg mb-2">Booked Tickets</div>
            <div className="text-white text-2xl font-bold">{eventData.tickets}</div>
          </div>
        </div>

        <div className={`${cardColor} px-5 py-2.5 rounded-xl mb-6`}>
          <div className="flex justify-between items-center mb-3">
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-md" onClick={handlePrevMonth}>&lt; Prev</button>
            <div className="text-lg font-semibold">{currentDate.format('MMMM YYYY')}</div>
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-md" onClick={handleNextMonth}>Next &gt;</button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className="group flex justify-center items-center w-10 h-10 cursor-pointer relative"
              >
                <div
                  className={`
                    absolute w-10 h-10 rounded-full
                    ${day === today.date() && day !== 14 && currentDate.isSame(today, 'month') ? 'bg-cyan-500' : ''}
                    group-hover:bg-cyan-500
                    ${day === selectedDate ? 'ring-2 ring-cyan-400' : ''}
                  `}
                ></div>
                <span className={`z-10 ${day === today.date() && day !== 14 && currentDate.isSame(today, 'month') ? 'text-white' : ''}`}>
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardColor} px-5 py-2.5 rounded-xl mb-6`}>
          <div className="text-lg font-semibold mb-4">Event Attendance</div>
          <div className="h-72">
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className={`${cardColor} px-5 py-2.5 rounded-xl`}>
          <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="text-lg font-semibold">Your Bookings</div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none"
            >
              <option value="date-newest">Sort by Date (Newest)</option>
              <option value="date-oldest">Sort by Date (Oldest)</option>
              <option value="name-asc">Sort by Name (A–Z)</option>
              <option value="name-desc">Sort by Name (Z–A)</option>
            </select>
          </div>
          <ul className="divide-y divide-gray-700">
            {sortedBookings.map((booking, index) => (
              <li key={index} className="py-2 flex justify-between text-sm">
                <span>{booking.name}</span>
                <span className="text-white">{booking.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;