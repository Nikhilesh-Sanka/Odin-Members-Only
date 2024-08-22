const pool = require("./pool.js");
const bcrypt = require("bcryptjs");

const doesUserExists = async (username) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE users.username = $1",
    [username.toLowerCase()]
  );
  console.log(rows);
  return rows.length !== 0;
};
const addUser = async (
  firstName,
  lastName,
  userName,
  password,
  isMember,
  isAdmin
) => {
  let promise = new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      await pool.query(
        `INSERT INTO users 
        (first_name,last_name,username,password,is_member,is_admin) 
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          firstName,
          lastName,
          userName.toLowerCase(),
          hashedPassword,
          isMember,
          isAdmin,
        ]
      );
      resolve("Promise resolved");
    });
  });
  return promise;
};
const updateMembership = async (userId) => {
  await pool.query(`UPDATE users SET is_member = 'true' WHERE id = $1`, [
    userId,
  ]);
};
const updateAdminShip = async (userId) => {
  await pool.query(
    `UPDATE users SET is_member = 'true',is_admin = 'true' WHERE id = $1`,
    [userId]
  );
};
const addMessage = async (message, userId) => {
  let date = new Date();
  let processedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  console.log(processedDate);
  await pool.query(
    `INSERT INTO 
    messages (message,user_id,date) 
    VALUES ($1,$2,$3)`,
    [message, userId, processedDate]
  );
};
const getMessages = async () => {
  let { rows } = await pool.query(
    `SELECT messages.message AS message,
            messages.id AS id,
            messages.user_id AS user_id,
            users.username AS username,
            messages.date AS date
            FROM messages INNER JOIN users 
            ON users.id = messages.user_id`
  );
  return rows;
};
const deleteMessage = async (messageId) => {
  await pool.query("DELETE FROM messages WHERE id = $1", [parseInt(messageId)]);
};
module.exports = {
  doesUserExists,
  addUser,
  updateMembership,
  updateAdminShip,
  addMessage,
  getMessages,
  deleteMessage,
};
