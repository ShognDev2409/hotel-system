const detailService = require('../services/roomDetailService');

exports.getAllDetails = async (req, res, next) => {
  try {
    const data = await detailService.getAllDetails();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getDetailById = async (req, res, next) => {
  try {
    const data = await detailService.getDetailById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Detail not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createDetail = async (req, res, next) => {
  try {
    const { details, room_image, Room_id } = req.body;
    if (Room_id == null) {
      return res.status(400).json({ success: false, message: 'Room_id is required' });
    }
    const result = await detailService.createDetail({ details, room_image, Room_id });
    res.status(201).json({ success: true, id: result.insertId, details, room_image, Room_id });
  } catch (err) {
    next(err);
  }
};

exports.updateDetail = async (req, res, next) => {
  try {
    const { details, room_image, Room_id } = req.body;
    const success = await detailService.updateDetail(req.params.id, { details, room_image, Room_id });
    if (!success) return res.status(404).json({ success: false, message: 'Detail not found' });
    res.json({ success: true, id: req.params.id, details, room_image, Room_id });
  } catch (err) {
    next(err);
  }
};

exports.deleteDetail = async (req, res, next) => {
  try {
    const success = await detailService.deleteDetail(req.params.id);
    if (!success) return res.status(404).json({ success: false, message: 'Detail not found' });
    res.json({ success: true, message: 'Detail deleted successfully' });
  } catch (err) {
    next(err);
  }
};
