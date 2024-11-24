import * as tf from '@tensorflow/tfjs';

export const trainModel = async (data) => {
    // Preprocessing: Convert categorical product descriptions to numbers
    const productMap = {};
    let productCount = 0;
    data.forEach((item) => {
        if (!productMap[item.product_description]) {
            productMap[item.product_description] = productCount++;
        }
        item.product_encoded = productMap[item.product_description];
    });

    // Prepare tensors
    const inputs = data.map((item) => [
        item.sales_date,
        item.product_encoded,
    ]);
    const outputs = data.map((item) => item.quantity_sold);

    const inputTensor = tf.tensor2d(inputs);
    const outputTensor = tf.tensor1d(outputs);

    // Normalize data
    const inputMax = inputTensor.max(0);
    const inputMin = inputTensor.min(0);
    const outputMax = outputTensor.max();
    const outputMin = outputTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedOutputs = outputTensor.sub(outputMin).div(outputMax.sub(outputMin));

    // Build model
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [2], units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError',
    });

    // Train model
    await model.fit(normalizedInputs, normalizedOutputs, {
        epochs: 50,
        shuffle: true,
    });

    return { model, inputMin, inputMax, outputMin, outputMax };
};

export const forecastSales = (model, inputMin, inputMax, outputMin, outputMax, futureData) => {
    const futureTensor = tf.tensor2d(futureData);

    const normalizedFuture = futureTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const predictions = model.predict(normalizedFuture);

    return predictions.mul(outputMax.sub(outputMin)).add(outputMin).dataSync();
};
