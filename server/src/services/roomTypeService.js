const roomTypeRepo = require('../repositories/roomTypeRepository');

exports.getAllRoomTypes = async () => {
  return await roomTypeRepo.findAll();
};

exports.getRoomTypeById = async (id) => {
  return await roomTypeRepo.findById(id);
};

exports.createRoomType = async (name) => {
  return await roomTypeRepo.insert(name);
};

exports.updateRoomType = async (id, name) => {
  const result = await roomTypeRepo.update(id, name);
  return result.affectedRows > 0;
};

exports.deleteRoomType = async (id) => {
  const result = await roomTypeRepo.remove(id);
  return result.affectedRows > 0;
};
