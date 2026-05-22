// @desc    Get health status of the API
// @route   GET /api/health
export const getHealthStatus = (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is healthy and running' });
};

// @desc    Get sample data
// @route   GET /api/data
export const getSampleData = (req, res) => {
  res.status(200).json({
    data: [
      { id: 1, name: 'Sample Item 1' },
      { id: 2, name: 'Sample Item 2' }
    ]
  });
};
