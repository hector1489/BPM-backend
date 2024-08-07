const db = require('../database/db');
const { compareSync } = require('../../utils/bcrypt');

const verifyCredentials = async (username, password) => {
    const [user] = await db('SELECT * FROM usuarios WHERE username = $1', [username]);
    return compareSync(password, user.password) ? [user] : [];
};

module.exports = {
    verifyCredentials,
};