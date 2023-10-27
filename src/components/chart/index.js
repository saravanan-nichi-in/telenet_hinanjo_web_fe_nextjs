import React from 'react';
import { Chart } from 'primereact/chart';

const Doughnut = ({ labels, data, title, style,bgClr,hvrClr }) => {
    
    const chartData = {
        labels,
        datasets: [
            {
                data: data, // Set a minimum value of 0.1 for data points
                backgroundColor: bgClr, // Generate colors based on data length
                hoverBackgroundColor: hvrClr
            }]
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: () => null,
                    label: function(context) {
                        let val = context.raw || '';
                        if (context.raw == 1) {
                            val = '0'; // Display "0" on hover if value is 0
                        }
                        return context.label+" "+val;
                    }
                }
            },
            legend: {
                position: "bottom",
                align: "center",
                labels: {
                    usePointStyle: true,
                    pointStyle: "rect",
                    color: '#495057',
                }
            },

        },
        maintainAspectRatio: false, // This prevents the chart from maintaining a constant aspect ratio
        responsive: true,
        aspectRatio: 1,
        animation: {
            animateRotate: false // Disable rotation animation
        }
        
    };

    return (
        <Chart type="doughnut" data={chartData} options={options} />
    );
}

export default Doughnut;
