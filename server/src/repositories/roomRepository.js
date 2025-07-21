const db = require('../config/database');

const findAll = async () => {
    const [rows] = await db.query(`
      SELECT r.id, r.name, r.status, r.RoomType_id, r.price,
             rt.name AS roomTypeName
      FROM room r
      LEFT JOIN room_type rt ON r.RoomType_id = rt.id
    `);
    return rows;
  };
  
  const findById = async (id) => {
    const [rows] = await db.query(`
      SELECT r.id, r.name, r.status, r.RoomType_id, r.price,
             rt.name AS roomTypeName
      FROM room r
      LEFT JOIN room_type rt ON r.RoomType_id = rt.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  };
  
const insert = async (room) => {
  const { name, status, RoomType_id, price } = room;
  const [result] = await db.query(
    'INSERT INTO room (name, status, RoomType_id, price) VALUES (?, ?, ?, ?)',
    [name, status, RoomType_id, price]
  );
  return result;
};

const update = async (id, room) => {
  const { name, status, RoomType_id, price } = room;
  const [result] = await db.query(
    'UPDATE room SET name = ?, status = ?, RoomType_id = ?, price = ? WHERE id = ?',
    [name, status, RoomType_id, price, id]
  );
  return result;
};

const remove = async (id) => {
  const [result] = await db.query('DELETE FROM room WHERE id = ?', [id]);
  return result;
};

module.exports = {
  findAll,
  findById,
  insert,
  update,
  remove,
};
