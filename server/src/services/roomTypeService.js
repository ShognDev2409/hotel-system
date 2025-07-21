const roomTypeRepo = require('../repositories/roomTypeRepository');

exports.getAllRoomTypes = async () => {
  const roomTypes = await roomTypeRepo.findAll();
  // Return plain JSON objects by calling toJSON()
  return roomTypes.map(rt => rt.toJSON());
};

exports.getRoomTypeById = async (id) => {
  const roomType = await roomTypeRepo.findById(id);
  if (!roomType) return null;
  return roomType.toJSON();
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
