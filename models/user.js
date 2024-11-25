const db = require('../db/db'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcryptjs');

class User {
  constructor(email, passwordHash, role) {
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  static async findByEmail(email) {
    console.log('Buscando usuario con email:', email); // Log para depuración
    return await db('users').where({ email }).first();
  }
  

  static async addUser(user) {
    return await db('users').insert({
      email: user.email,
      password: user.passwordHash,
      role: user.role,
    });
  }

  static async getAllUsers() {
    return await db('users').select('*');
  }
}

module.exports = User;
