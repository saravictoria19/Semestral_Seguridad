const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB 
mongoose.connect('mongodb://127.0.0.1:27017/Semestral', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Congiguración de limitación de velocidad
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts from this IP, please try again later"
});

app.use('/api/', limiter);

// Define schema and model for user
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  cedula: String,
  email: String,
  phoneNumber: String,
  birthDate: Date,
  address: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Middleware to verify JWT and role
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Register route
app.post('/api/register', async (req, res) => {
  const { username, password, firstName, lastName, cedula, email, phoneNumber, birthDate, address } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya registrado' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      firstName,
      lastName,
      cedula,
      username,
      email,
      phoneNumber,
      birthDate,
      address,
      password: hashedPassword,
    });

    console.log('Usuario registrado:', { username }, { firstName }, { lastName }, { cedula }, { email }, { phoneNumber}, { birthDate }, { address });
    res.json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secret_key', { expiresIn: '1h' });

    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Route to get all users (accessible only by admin)
app.get('/api/users', verifyToken, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const users = await User.find({}, 'username role'); // Retrieve usernames and roles only
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
