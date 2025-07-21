const roomTypeService = require('../services/roomTypeService');

exports.getAllRoomTypes = async (req, res, next) => {
  try {
    const data = await roomTypeService.getAllRoomTypes();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getRoomTypeById = async (req, res, next) => {
  try {
    const data = await roomTypeService.getRoomTypeById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createRoomType = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await roomTypeService.createRoomType(name);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    next(err);
  }
};

exports.updateRoomType = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const success = await roomTypeService.updateRoomType(id, name);
    if (!success) return res.status(404).json({ message: 'Not found' });
    res.json({ id, name });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoomType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await roomTypeService.deleteRoomType(id);
    if (!success) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
