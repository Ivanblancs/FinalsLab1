import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Explicitly register all components

const SalesChart = ({ actual, predicted }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        // Destroy any previous chart instance to prevent reuse errors
        if (chartRef.current.chartInstance) {
            chartRef.current.chartInstance.destroy();
        }

        // Create a new Chart instance
        chartRef.current.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: actual.length }, (_, i) => `Month ${i + 1}`),
                datasets: [
                    {
                        label: 'Actual Sales',
                        data: actual,
                        borderColor: 'blue',
                        fill: false,
                    },
                    {
                        label: 'Predicted Sales',
                        data: predicted,
                        borderColor: 'green',
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    x: {
                        type: 'category', // Ensure "category" scale is registered and used
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        // Cleanup function to destroy the chart instance when the component unmounts
        return () => {
            if (chartRef.current.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, [actual, predicted]);

    return <canvas ref={chartRef} />;
};

export default SalesChart;
