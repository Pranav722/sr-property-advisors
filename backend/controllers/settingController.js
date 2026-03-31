import Setting from '../models/Setting.js';

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        email: 'info@srpropertyadvisors.com',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        address: 'Downtown, Mumbai, India',
        workingHours: 'Mon-Sat: 9AM - 6PM',
        facebook: '',
        instagram: '',
        twitter: '',
      });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings.set(req.body);
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
