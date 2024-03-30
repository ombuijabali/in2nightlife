import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [clubData, setClubData] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState('');
  const [selectedMusic, setSelectedMusic] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/clubs/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setClubData(data);
      } catch (error) {
        console.error('Error fetching club data:', error);
      }
    };
    fetchData();
  }, []);

  const getDrinksOptions = () => {
    const drinks = clubData.map((club) => club.drinks);
    return [...new Set(drinks)];
  };

  const getMusicOptions = () => {
    const music = clubData.map((club) => club.music);
    return [...new Set(music)];
  };

  const drinksData = clubData.reduce((acc, club) => {
    acc[club.drinks] = (acc[club.drinks] || 0) + 1;
    return acc;
  }, {});

  const musicData = clubData.reduce((acc, club) => {
    acc[club.music] = (acc[club.music] || 0) + 1;
    return acc;
  }, {});

  const formatChartData = (data) => Object.keys(data).map((key) => ({ name: key, value: data[key] }));

  const renderCustomizedCell = (data) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FEF', '#EF82A2', '#50EF82', '#82A2EF'];
    return data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ));
  };


  return (
    <div className="analytics-container">
      <div className="filters">
        <select className="drink-select" value={selectedDrink} onChange={(e) => setSelectedDrink(e.target.value)}>
          <option value="">All Drinks</option>
          {getDrinksOptions().map((drink) => (
            <option key={drink} value={drink}>{drink}</option>
          ))}
        </select>
        <select className="music-select" value={selectedMusic} onChange={(e) => setSelectedMusic(e.target.value)}>
          <option value="">All Music</option>
          {getMusicOptions().map((music) => (
            <option key={music} value={music}>{music}</option>
          ))}
        </select>
      </div>

      <div className="PieChartContainer">
        <h2>Drinks Distribution</h2>
        <PieChart width={230} height={230}>
          <Pie dataKey="value" isAnimationActive={false} data={formatChartData(drinksData)} cx="50%" cy="50%" label>
            {renderCustomizedCell(formatChartData(drinksData))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className="PieChartContainer">
        <h2>Music Distribution</h2>
        <PieChart width={230} height={230}>
          <Pie dataKey="value" isAnimationActive={false} data={formatChartData(musicData)} cx="50%" cy="50%" label>
            {renderCustomizedCell(formatChartData(musicData))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );

};

export default Analytics;
