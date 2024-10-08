const db = require('../database/db');
const { compareSync } = require('../../utils/bcrypt');

const verifyCredentials = async (username, password) => {
    try {
        const result = await db('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (user && compareSync(password, user.password)) {
            return [user];
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error al verificar las credenciales:', error);
        throw error;
    }
};

module.exports = {
    verifyCredentials,
};
