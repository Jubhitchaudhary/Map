import React, { useState, useEffect } from 'react';
import './App.css';
import List from './components/List';
import ExhibitionChart from './components/ExhibitionChart';

function App() {
  const [exhibitions, setExhibitions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStartYear, setSelectedStartYear] = useState('');
  const [selectedEndYear, setSelectedEndYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [earliestAcquisitionYear, setEarliestAcquisitionYear] = useState('');
  const [latestAcquisitionYear, setLatestAcquisitionYear] = useState('');

  const callAPI = async () => {
    try {
      const response = await fetch('https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.exhibitions.getList&access_token=5c3b94adb6f0b03bcd71109dc2f422e6&page=1&per_page=20');
      if (!response.ok) {
        throw new Error('Failed to fetch exhibitions');
      }
      const data = await response.json();
      const exhibitions = data.exhibitions;
      setExhibitions(exhibitions);
      
      // Calculate earliest and latest acquisition years
      const acquisitionYears = exhibitions.map(exhibition => new Date(exhibition.date_start).getFullYear());
      setEarliestAcquisitionYear(Math.min(...acquisitionYears));
      setLatestAcquisitionYear(Math.max(...acquisitionYears));
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStartYearChange = (event) => {
    setSelectedStartYear(event.target.value);
  };

  const handleEndYearChange = (event) => {
    setSelectedEndYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedStartYear('');
    setSelectedEndYear('');
    setSelectedMonth('');
  };

  const filteredExhibitions = exhibitions.filter((exhibition) => {
    const titleMatches = exhibition.title.toLowerCase().includes(searchQuery.toLowerCase());
    const startYearMatches = selectedStartYear ? exhibition.date_start.startsWith(selectedStartYear) : true;
    const endYearMatches = selectedEndYear ? exhibition.date_end.startsWith(selectedEndYear) : true;
    const monthMatches = selectedMonth ? exhibition.date_start.split('-')[1] === selectedMonth : true;
    return titleMatches && startYearMatches && endYearMatches && monthMatches;
  });

  // Generate year options
  const yearOptions = [];
  for (let year = 2019; year <= 2024; year++) {
    yearOptions.push(
      <option key={year} value={year}>
        {year}
      </option>
    );
  }

  // Generate month options
  const monthOptions = [];
  for (let month = 1; month <= 12; month++) {
    const formattedMonth = month.toString().padStart(2, '0');
    monthOptions.push(
      <option key={formattedMonth} value={formattedMonth}>
        {formattedMonth}
      </option>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Welcome to the Best page to research about Museum</h1>
      </div>
      <div className="stat-summary">
        <div className="stat-card">Total Exhibitions: {exhibitions.length}</div>
        {earliestAcquisitionYear && latestAcquisitionYear && (
          <div className="stat-card">
          First Year: {earliestAcquisitionYear}
          Last Year: {latestAcquisitionYear}
        </div>
        )}
      </div>
      <div className="filter">
        <input
          type="text"
          placeholder="Search exhibitions..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={selectedStartYear} onChange={handleStartYearChange}>
          <option value="">Start Year</option>
          {yearOptions}
        </select>
        <select value={selectedEndYear} onChange={handleEndYearChange}>
          <option value="">End Year</option>
          {yearOptions}
        </select>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="">Month</option>
          {monthOptions}
        </select>
        <button onClick={handleReset}>Reset</button>
      </div>
      {exhibitions.length > 0 && <List data={filteredExhibitions} />}
      <div className='chart'>
        <ExhibitionChart data={exhibitions}/>
      </div>
    </div>
  );
}

export default App;
