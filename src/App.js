import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import SalesChart from './components/ForecastVisualization';
import { trainModel, forecastSales } from './components/ModelTraining';

const App = () => {
    const [data, setData] = useState([]);
    const [actualSales, setActualSales] = useState([]);
    const [predictedSales, setPredictedSales] = useState([]);

    const handleDataProcessed = async (processedData) => {
        setData(processedData);

        // Train the model with processed data
        const { model, inputMin, inputMax, outputMin, outputMax } = await trainModel(processedData);

        // Generate forecasts for the next 6 months
        const futureData = Array.from({ length: 6 }, (_, i) => [i + 13, 0]); // Example encoding
        const predictions = forecastSales(model, inputMin, inputMax, outputMin, outputMax, futureData);

        setActualSales(processedData.map((item) => item.quantity_sold));
        setPredictedSales(Array.from(predictions));
    };

    return (
        <div>
            <h1>Sales Forecasting Application</h1>
            <FileUpload onDataProcessed={handleDataProcessed} />
            {actualSales.length > 0 && predictedSales.length > 0 && (
                <SalesChart actual={actualSales} predicted={predictedSales} />
            )}
        </div>
    );
};

export default App;
