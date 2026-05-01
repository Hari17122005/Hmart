import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hmart';
mongoose.set('bufferCommands', false);

// --- Mongoose Models ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImage: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  unit: { type: String, required: true },
  description: String,
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  isHotDeal: { type: Boolean, default: false },
  salePrice: Number,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// --- API Routes ---

// Auth Routes
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.post('/api/auth/register', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const products = await Product.find();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Seed Endpoint (Optional, to populate database)
app.post('/api/seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    await Product.deleteMany({});
    // We will let the frontend trigger this with initial data if empty
    res.json({ message: 'Database wiped, ready for seed data' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// --- Vite Integration ---
async function setupVite() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ MongoDB connected successfully');

    // --- Auto-seed test users ---
    const adminExists = await User.findOne({ email: 'admin@hmart.com' });
    if (!adminExists) {
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        await User.create({ name: 'Admin', email: 'admin@hmart.com', password: hashedAdminPassword, role: 'admin' });
    }
    const userExists = await User.findOne({ email: 'user@hmart.com' });
    if (!userExists) {
        const hashedUserPassword = await bcrypt.hash('user123', 10);
        await User.create({ name: 'Test User', email: 'user@hmart.com', password: hashedUserPassword, role: 'user' });
    }

  } catch (err: any) {
    console.warn('⚠️ MongoDB connection error (Ensure connection string is correct):', err.message);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
