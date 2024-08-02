const db = require('../database/db');
const { compareSync } = require('../../utils/bcrypt');

const verifyCredentials = async (email, password) => {
    const [user] = await db('SELECT * FROM usuarios WHERE email = $1', [email]);
    return compareSync(password, user.password) ? [user] : [];
};

module.exports = {
    verifyCredentials,
};
