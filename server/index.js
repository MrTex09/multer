const express = require('express');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();

// Configuración de CORS
app.use(cors()); // Habilita CORS para todas las rutas y orígenes

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Verificar y crear el directorio uploads si no existe
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// SQL para crear la tabla si no existe
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    foto_perfil VARCHAR(255) NOT NULL
  );
`;

// Función para crear la tabla
const createTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(createTableQuery);
    console.log('Tabla "usuarios" creada o ya existe.');
  } catch (err) {
    console.error('Error al crear la tabla "usuarios":', err);
  } finally {
    client.release();
  }
};

// Ejecutar la función para crear la tabla al iniciar el servidor
createTable();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Extraer la extensión del archivo
    const extname = path.extname(file.originalname);
    // Extraer el nombre del archivo sin la extensión
    const basename = path.basename(file.originalname, extname);
    // Generar un nombre único usando el timestamp
    const uniqueSuffix = Date.now() + Math.floor(Math.random() * 1000);
    // Crear el nuevo nombre del archivo
    cb(null, `${basename}-${uniqueSuffix}${extname}`);
  }
});

const upload = multer({ storage: storage });

// Ruta para manejar la subida de archivos y guardar los datos en la base de datos
app.post('/upload', upload.single('fotoPerfil'), async (req, res) => {
  const { nombre, edad } = req.body;
  const fotoPerfil = req.file.filename;

  try {
    const queryText = 'INSERT INTO usuarios (nombre, edad, foto_perfil) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, edad, fotoPerfil];
    const result = await pool.query(queryText, values);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar los datos');
  }
});
// Servir archivos estáticos desde el directorio uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Ruta para obtener la lista de fotos
app.get('/photos', async (req, res) => {
  try {
    const queryText = 'SELECT * FROM usuarios';
    const result = await pool.query(queryText);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener las fotos');
  }
});


app.listen(3000, () => {
  console.log('Servidor en marcha en el puerto 3000');
});
