export const preprocessData = (data) => {
  const salesData = data.map((item) => ({
    sales_date: parseInt(item.sales_date.split('-')[1]), // Convert month to numerical format
    product_description: item.product_description === 'Product A' ? 0 : 1, // Simple encoding
    quantity_sold: parseInt(item.quantity_sold), // Convert to integer
  }));

  const inputs = salesData.map((item) => [item.sales_date, item.product_description]);
  const outputs = salesData.map((item) => item.quantity_sold);

  const maxQuantity = Math.max(...outputs);

  // Debugging: Check for invalid values
  console.log('Preprocessed Data:', { inputs, outputs, maxQuantity });

  return {
    inputs: inputs,
    outputs: outputs.map((qty) => qty / (maxQuantity || 1)), // Avoid division by zero
    maxQuantity,
  };
};
