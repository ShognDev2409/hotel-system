const db = require('../config/database');

const findAll = async () => {
    const [rows] = await db.query(`
      SELECT r.id, r.name, r.status, r.RoomType_id, r.price,
             rt.name AS roomTypeName, r.max_guests
      FROM room r
      LEFT JOIN room_type rt ON r.RoomType_id = rt.id
        ORDER BY 
        CASE 
          WHEN r.status = 'available' THEN 1 
          ELSE 2 
        END,
        r.name ASC
    `);
    return rows;
  };
  
  const findById = async (id) => {
    const [rows] = await db.query(`
      SELECT r.id, r.name, r.status, r.RoomType_id, r.price,
             rt.name AS roomTypeName, r.max_guests
      FROM room r
      LEFT JOIN room_type rt ON r.RoomType_id = rt.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  };
  
const insert = async (room) => {
  const { name, status, RoomType_id, price, max_guests } = room;
  const [result] = await db.query(
    'INSERT INTO room (name, status, RoomType_id, price, max_guests) VALUES (?, ?, ?, ?, ?)',
    [name, status, RoomType_id, price, max_guests]
  );
  return result;
};

const update = async (id, room) => {
  const { name, status, RoomType_id, price, max_guests } = room;
  const [result] = await db.query(
    'UPDATE room SET name = ?, status = ?, RoomType_id = ?, price = ?, max_guests = ? WHERE id = ?',
    [name, status, RoomType_id, price, max_guests, id]
  );
  return result;
};

const remove = async (id) => {
  const [result] = await db.query('DELETE FROM room WHERE id = ?', [id]);
  return result;
};

const updateStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE room SET status = ? WHERE id = ?',
    [status, id]
  );
  return result;
};
module.exports = {
  updateStatus,
  findAll,
  findById,
  insert,
  update,
  remove,
};
