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
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).populate('assignedTo', 'name');
    res.json(inquiries);
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry (status / add note)
// @route   PUT /api/inquiries/:id
// @access  Private
export const updateInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }

    if (req.body.status) inquiry.status = req.body.status;
    if (req.body.assignedTo !== undefined) inquiry.assignedTo = req.body.assignedTo || null;

    // Append a note if provided
    if (req.body.note) {
      inquiry.notes.push({ text: req.body.note });
    }

    const updated = await inquiry.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }
    await inquiry.deleteOne();
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    next(error);
  }
};
