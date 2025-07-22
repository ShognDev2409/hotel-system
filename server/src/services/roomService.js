const roomRepo = require('../repositories/roomRepository');
const Room = require('../models/roomModel');
exports.getAllRooms = async () => {
    const rows = await roomRepo.findAll();
    return rows.map(row => new Room(
        row.id, row.name, row.status, row.RoomType_id, row.price, row.roomTypeName, row.max_guests
    ));
};

exports.getRoomById = async (id) => {
    const row = await roomRepo.findById(id);
    if (!row) return null;
    return new Room(
        row.id, row.name, row.status, row.RoomType_id, row.price, row.roomTypeName, row.maxGuests
    );
};

exports.createRoom = async (room) => {
    return await roomRepo.insert(room);
};

exports.updateRoom = async (id, room) => {
    const result = await roomRepo.update(id, room);
    return result.affectedRows > 0;
};

exports.deleteRoom = async (id) => {
    const result = await roomRepo.remove(id);
    return result.affectedRows > 0;
};
exports.updateRoomStatus = async (roomId, status) => {
    const result = await roomRepo.updateStatus(roomId, status);
    return result.affectedRows > 0;
};