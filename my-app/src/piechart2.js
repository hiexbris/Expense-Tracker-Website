import React, { useEffect } from "react";

const PieChart2 = ({ data }) => {
  let chart = null;

  useEffect(() => {
    // Load Google Charts
    const loadGoogleCharts = () => {
      window.google.charts.load("current", { packages: ["corechart"] });
      window.google.charts.setOnLoadCallback(drawChart);
    };

    // Draw the chart when Google Charts is loaded
    const drawChart = () => {
      // Format the data for Google Charts
      const chartData = [
        ['Task', 'Hours per Day'],
        ...data.map(item => [item.name, item.price])
      ];

      // Create a DataTable
      const googleData = window.google.visualization.arrayToDataTable(chartData);

      // Chart options
      const options = {
        pieHole: 0.4, // Makes it a donut chart
        backgroundColor: 'transparent',
        legend: 'none',
    };

      
      // Create and draw the chart
      chart = new window.google.visualization.PieChart(document.getElementById('donutchart'));
      chart.draw(googleData, options);
    };

    loadGoogleCharts(); // Load the Google Charts library

    // Cleanup if necessary (Clear chart when component unmounts)
    return () => {
      if (chart) {
        chart.clearChart(); // Clear the chart before unmounting
      }
    };
  }, [data]); // Re-render the chart when the data changes

  return (
    <div className='acpie' id="donutchart" ></div>
  );
};

export default PieChart2;
