const roomService = require('../services/roomService');

// Get all rooms
exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json({ success: true, data: rooms });
  } catch (err) {
    next(err);
  }
};

// Get room by ID
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

// Create room
exports.createRoom = async (req, res, next) => {
  try {
    const { name, status, RoomType_id, price } = req.body;
    if (!name || !status || RoomType_id == null || price == null) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const result = await roomService.createRoom({ name, status, RoomType_id, price });
    res.status(201).json({ success: true, id: result.insertId, ...req.body });
  } catch (err) {
    next(err);
  }
};

// Update room
exports.updateRoom = async (req, res, next) => {
  try {
    const { name, status, RoomType_id, price } = req.body;
    if (!name || !status || RoomType_id == null || price == null) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const success = await roomService.updateRoom(req.params.id, { name, status, RoomType_id, price });
    if (!success) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, id: req.params.id, ...req.body });
  } catch (err) {
    next(err);
  }
};

// Delete room
exports.deleteRoom = async (req, res, next) => {
  try {
    const success = await roomService.deleteRoom(req.params.id);
    if (!success) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Check if a room is available by ID
exports.checkAvailable = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Room ID is required' });
      }
  
      const room = await roomService.getRoomById(id);
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
  
      const isAvailable = room.status.toLowerCase() === 'available';
  
      res.json({
        success: true,
        roomId: id,
        available: isAvailable,
      });
    } catch (err) {
      next(err);
    }
  };
  