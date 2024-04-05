import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const ACCESS_TOKEN = "5c3b94adb6f0b03bcd71109dc2f422e6"


const ExhibitionChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchExhibitionDetails = async () => {
      const promises = data.map(async (exhibition) => {
        const response = await fetch(
          `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.exhibitions.getInfo&access_token=${ACCESS_TOKEN}&exhibition_id=${exhibition.id}`
        );
        const json = await response.json();
        return { countObjects: json.exhibition.count_objects, dateStart: exhibition.date_start };
      });

      const exhibitionDetails = await Promise.all(promises);
      setChartData(exhibitionDetails);
    };

    fetchExhibitionDetails().catch(console.error);
  }, [data]);

  const cleanData = (fetchedData) => {
    const formattedData = fetchedData.map((entry) => ({
      date: entry.dateStart,
      CountObjects: parseInt(entry.countObjects)
    }));
    return formattedData.reverse();
  };
  

  return (
    <div>
      <LineChart width={600} height={300} data={cleanData(chartData)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="CountObjects" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default ExhibitionChart;
