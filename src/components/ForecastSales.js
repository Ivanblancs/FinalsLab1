const forecastSales = (model, productMap, maxQuantity) => {
    const futureInputs = [];
    const futureDates = [];
    const months = [1, 2, 3, 4, 5, 6]; // Next 6 months
  
    Object.keys(productMap).forEach((product) => {
      months.forEach((month) => {
        futureInputs.push([month, productMap[product]]);
        futureDates.push({ month, product });
      });
    });
  
    const inputs = tf.tensor2d(futureInputs);
    const predictions = model.predict(inputs).dataSync();
  
    return futureDates.map((item, i) => ({
      ...item,
      predicted_sales: predictions[i] * maxQuantity,
    }));
  };
  