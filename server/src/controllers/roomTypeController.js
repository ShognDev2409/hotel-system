const roomTypeService = require('../services/roomTypeService');

exports.getAllRoomTypes = async (req, res, next) => {
  try {
    const data = await roomTypeService.getAllRoomTypes();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getRoomTypeById = async (req, res, next) => {
  try {
    const data = await roomTypeService.getRoomTypeById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createRoomType = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const result = await roomTypeService.createRoomType(name);
    res.status(201).json({ success: true, id: result.insertId, name });
  } catch (err) {
    next(err);
  }
};

exports.updateRoomType = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID is required' });
    }
    const success = await roomTypeService.updateRoomType(id, name);
    if (!success) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, id, name });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoomType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await roomTypeService.deleteRoomType(id);
    if (!success) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
