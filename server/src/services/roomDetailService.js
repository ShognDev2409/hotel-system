const Detail = require('../models/roomDetailModel');
const detailRepo = require('../repositories/roomDetailRepository');

exports.getAllDetails = async () => {
  const rows = await detailRepo.findAll();
  return rows.map(row => new Detail(row.id, row.details, row.room_image, row.Room_id));
};

exports.getDetailById = async (id) => {
  const row = await detailRepo.findById(id);
  return row ? new Detail(row.id, row.details, row.room_image, row.Room_id) : null;
};

exports.createDetail = async (detail) => {
  return await detailRepo.insert(detail);
};

exports.updateDetail = async (id, detail) => {
  const result = await detailRepo.update(id, detail);
  return result.affectedRows > 0;
};

exports.deleteDetail = async (id) => {
  const result = await detailRepo.remove(id);
  return result.affectedRows > 0;
};
