module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite', // Ruta a tu base de datos
    },
    useNullAsDefault: true, // Requerido para SQLite
  },
};
