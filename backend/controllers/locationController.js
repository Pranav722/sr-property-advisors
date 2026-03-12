import Location from '../models/Location.js';

// @desc    Fetch all locations
// @route   GET /api/locations
// @access  Public
export const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({});
    res.json(locations);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a location
// @route   POST /api/locations
// @access  Private/Admin
export const createLocation = async (req, res, next) => {
  try {
    const { name, status } = req.body;
    const locationExists = await Location.findOne({ name });

    if (locationExists) {
      res.status(400);
      throw new Error('Location already exists');
    }

    const location = await Location.create({ name, status });
    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
};
