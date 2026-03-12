import Inquiry from '../models/Inquiry.js';

// @desc    Create a new inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res, next) => {
  try {
    const { name, phone, email, interestedProperty, message } = req.body;
    
    const inquiry = new Inquiry({
      name,
      phone,
      email,
      interestedProperty,
      message
    });

    const createdInquiry = await inquiry.save();
    res.status(201).json(createdInquiry);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private
export const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({}).populate('assignedTo', 'name');
    res.json(inquiries);
  } catch (error) {
    next(error);
  }
};
