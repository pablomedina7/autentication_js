const db = require('./db');

db.schema
  .createTable('users', table => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('role').notNullable();
  })
  .then(() => {
    console.log('Tabla de usuarios creada');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error al crear la tabla:', err);
    process.exit(1);
  });
