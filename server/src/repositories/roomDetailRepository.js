const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.query('SELECT * FROM details');
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM details WHERE id = ?', [id]);
  return rows[0];
};

const insert = async ({ details, room_image, Room_id }) => {
  const [result] = await db.query(
    'INSERT INTO details (details, room_image, Room_id) VALUES (?, ?, ?)',
    [details || null, room_image || null, Room_id]
  );
  return result;
};

const update = async (id, { details, room_image, Room_id }) => {
  const [result] = await db.query(
    'UPDATE details SET details = ?, room_image = ?, Room_id = ? WHERE id = ?',
    [details || null, room_image || null, Room_id, id]
  );
  return result;
};

const remove = async (id) => {
  const [result] = await db.query('DELETE FROM details WHERE id = ?', [id]);
  return result;
};

module.exports = {
  findAll,
  findById,
  insert,
  update,
  remove,
};
