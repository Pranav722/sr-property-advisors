import { validationResult, check } from 'express-validator';

// Middleware to catch validation errors
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export const projectValidationRules = () => {
  return [
    check('title', 'Title is required').notEmpty(),
    check('location', 'Location ID is required').isMongoId(),
    check('type', 'Valid Project Type is required').isIn(['Plot', 'House', 'Building', 'Villa', 'Apartment', 'Office Space', 'Warehouse']),
  ];
};

export const plotValidationRules = () => {
    return [
      check('project', 'Project ID is required').isMongoId(),
      check('plotNumber', 'Plot number is required').notEmpty(),
      check('sizeSqFt', 'Size must be numeric').isNumeric(),
      check('price', 'Price must be numeric').isNumeric(),
    ];
};

export const inquiryValidationRules = () => {
  return [
    check('name', 'Name is required').notEmpty(),
    check('phone', 'Phone is required').notEmpty(),
    check('interestedProperty', 'Property reference is required').notEmpty(),
  ];
};
