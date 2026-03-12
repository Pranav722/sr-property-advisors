import Plot from '../models/Plot.js';

// @desc    Fetch all plots (optionally by project)
// @route   GET /api/plots
// @access  Public
export const getPlots = async (req, res, next) => {
  try {
    const filter = req.query.projectId ? { project: req.query.projectId } : {};
    const plots = await Plot.find(filter).populate('project', 'title');
    res.json({ success: true, count: plots.length, data: plots });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a plot
// @route   POST /api/plots
// @access  Private/Admin
export const createPlot = async (req, res, next) => {
  try {
    const { project, plotNumber, sizeSqFt, price, status } = req.body;
    
    let documents = [];
    if (req.files && req.files.legalFiles) {
      documents = req.files.legalFiles.map(file => ({
        title: file.originalname || 'Legal Document',
        url: '/uploads/' + file.filename
      }));
    }

    const plot = new Plot({
      project,
      plotNumber,
      sizeSqFt,
      price,
      status,
      documents
    });

    const createdPlot = await plot.save();
    res.status(201).json({ success: true, data: createdPlot });
  } catch (error) {
    next(error);
  }
};
