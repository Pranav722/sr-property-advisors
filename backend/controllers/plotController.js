import Plot from '../models/Plot.js';

// @desc    Fetch all plots (optionally by project)
// @route   GET /api/plots
// @access  Public
export const getPlots = async (req, res, next) => {
  try {
    const filter = req.query.projectId ? { project: req.query.projectId } : {};
    const plots = await Plot.find(filter).populate('project', 'title').sort({ plotNumber: 1 });
    res.json({ success: true, count: plots.length, data: plots });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plot
// @route   GET /api/plots/:id
// @access  Private/Admin
export const getPlotById = async (req, res, next) => {
  try {
    const plot = await Plot.findById(req.params.id).populate('project', 'title');
    if (!plot) { res.status(404); throw new Error('Plot not found'); }
    res.json({ success: true, data: plot });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a plot
// @route   POST /api/plots
// @access  Private/Admin
export const createPlot = async (req, res, next) => {
  try {
    const { project, plotNumber, sizeSqFt, price, status, buyerName, buyerContact } = req.body;

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
      buyerName: buyerName || '',
      buyerContact: buyerContact || '',
      documents
    });

    const createdPlot = await plot.save();
    res.status(201).json({ success: true, data: createdPlot });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a plot
// @route   PUT /api/plots/:id
// @access  Private/Admin
export const updatePlot = async (req, res, next) => {
  try {
    const plot = await Plot.findById(req.params.id);
    if (!plot) { res.status(404); throw new Error('Plot not found'); }

    const { plotNumber, sizeSqFt, price, status, buyerName, buyerContact } = req.body;

    if (plotNumber !== undefined) plot.plotNumber = plotNumber;
    if (sizeSqFt !== undefined) plot.sizeSqFt = Number(sizeSqFt);
    if (price !== undefined) plot.price = Number(price);
    if (status !== undefined) plot.status = status;
    if (buyerName !== undefined) plot.buyerName = buyerName;
    if (buyerContact !== undefined) plot.buyerContact = buyerContact;

    const updatedPlot = await plot.save();
    res.json({ success: true, data: updatedPlot });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a plot
// @route   DELETE /api/plots/:id
// @access  Private/Admin
export const deletePlot = async (req, res, next) => {
  try {
    const plot = await Plot.findById(req.params.id);
    if (!plot) { res.status(404); throw new Error('Plot not found'); }
    await plot.deleteOne();
    res.json({ success: true, message: 'Plot removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create plots for a project
// @route   POST /api/plots/bulk
// @access  Private/Admin
export const bulkCreatePlots = async (req, res, next) => {
  try {
    const { project, count, sizeSqFt, price, prefix } = req.body;
    if (!project || !count || count < 1 || count > 500) {
      res.status(400);
      throw new Error('project and count (1-500) are required');
    }

    // Find existing plot numbers for this project to avoid duplicates
    const existing = await Plot.find({ project }).select('plotNumber');
    const existingNums = new Set(existing.map(p => p.plotNumber));

    const plots = [];
    let num = 1;
    while (plots.length < Number(count)) {
      const plotNumber = `${prefix || 'P'}${String(num).padStart(3, '0')}`;
      if (!existingNums.has(plotNumber)) {
        plots.push({ project, plotNumber, sizeSqFt: Number(sizeSqFt) || 1000, price: Number(price) || 0, status: 'Available' });
      }
      num++;
    }

    const created = await Plot.insertMany(plots);
    res.status(201).json({ success: true, count: created.length, data: created });
  } catch (error) {
    next(error);
  }
};
