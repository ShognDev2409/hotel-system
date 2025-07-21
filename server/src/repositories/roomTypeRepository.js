const db = require('../config/database');
const RoomType = require('../models/roomTypeModel');

const findAll = async () => {
  const [rows] = await db.query('SELECT id, name FROM room_type');
  // Wrap each row as a RoomType instance
  return rows.map(row => new RoomType(row.id, row.name));
};

const findById = async (id) => {
  const [rows] = await db.query('SELECT id, name FROM room_type WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  const row = rows[0];
  return new RoomType(row.id, row.name);
};

const insert = async (name) => {
  const [result] = await db.query('INSERT INTO room_type (name) VALUES (?)', [name]);
  return result;
};

const update = async (id, name) => {
  const [result] = await db.query('UPDATE room_type SET name = ? WHERE id = ?', [name, id]);
  return result;
};

const remove = async (id) => {
  const [result] = await db.query('DELETE FROM room_type WHERE id = ?', [id]);
  return result;
};

module.exports = {
  findAll,
  findById,
  insert,
  update,
  remove,
};
