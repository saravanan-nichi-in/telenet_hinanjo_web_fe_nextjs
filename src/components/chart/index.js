import React from 'react';
import { Chart } from 'primereact/chart';

const DonutChartDemo = ({ labels, data, title,style }) => {
    const chartData = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#FF5733",
                    "#33FF57",
                    "#5A33FF",
                    "#FF336D",
                    "#FFC233",
                    "#33FFB1"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#FF5733",
                    "#33FF57",
                    "#5A33FF",
                    "#FF336D",
                    "#FFC233",
                    "#33FFB1"
                ]
            }]
    };

    const options = {
        plugins: {
            legend: {
                position: "bottom",
                align: "center",
                labels: {
                    usePointStyle: true,
                    pointStyle: "rect",
                    color: '#495057',
                }
            }
        }
    };

    return (
  
            <Chart type="doughnut" data={chartData} options={options} style={style} />

    );
}

export default DonutChartDemo;
