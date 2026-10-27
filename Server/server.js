const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const axios = require('axios');
const connectDB = require('./db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- IN-MEMORY FALLBACK STORES (Works seamlessly with or without local MongoDB) ---
let memoryUsers = [
  { id: '1', name: 'Ramesh Patel', email: 'farmer@agritech.com', role: 'Farmer', location: 'Indore' },
  { id: '2', name: 'Dr. Sharma (Agronomist)', email: 'admin@agritech.com', role: 'Admin', location: 'Bhopal' }
];

let memoryFarms = [
  { id: 'f1', farmerEmail: 'farmer@agritech.com', farmName: 'Green Valley Plot A', areaAcres: 4.5, currentCrop: 'Soybean', stage: 'Vegetative', healthScore: 88 }
];

let memoryResources = [
  { id: 'r1', name: 'Hybrid Wheat HD-2967 Seed (40kg)', category: 'Seeds', price: 1450, stock: 35, approved: true },
  { id: 'r2', name: 'NPK Granular Fertilizer 12-32-16 (50kg)', category: 'Fertilizers', price: 1350, stock: 50, approved: true },
  { id: 'r3', name: 'Neem-based Bio-Pesticide (1 Litre)', category: 'Pesticides', price: 420, stock: 20, approved: true }
];

let memoryOrders = [
  { id: 'ord-101', farmerEmail: 'farmer@agritech.com', itemName: 'Hybrid Wheat HD-2967 Seed (40kg)', quantity: 2, totalAmount: 2900, status: 'Shipped', date: '2026-10-24' }
];

let memoryForum = [
  { id: 'q1', author: 'Ramesh Patel', question: 'How can I prevent early stem borer attacks on my soybean crop before flowering?', reply: 'Ensure proper pheromone trap installation (4-5 per acre) and apply Chlorantraniliprole 18.5% SC if infestation exceeds 5%.', expert: 'Dr. Sharma (Admin)' }
];

// --- MONGOOSE SCHEMAS (For MongoDB persistence) ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Farmer', 'Admin'], default: 'Farmer' },
  location: { type: String, default: 'Indore' }
});

const farmSchema = new mongoose.Schema({
  farmerEmail: { type: String, required: true },
  farmName: { type: String, required: true },
  areaAcres: { type: Number, required: true },
  currentCrop: { type: String, required: true },
  stage: { type: String, default: 'Sowing' },
  healthScore: { type: Number, default: 85 }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Farm = mongoose.models.Farm || mongoose.model('Farm', farmSchema);

// --- 1. AUTHENTICATION & ROLE MANAGEMENT ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;
    const userRole = role === 'Admin' ? 'Admin' : 'Farmer';
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const token = jwt.sign({ email, role: userRole }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '7d' });

    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already registered' });
      const user = new User({ name, email, password: hashedPassword, role: userRole, location: location || 'Indore' });
      await user.save();
      return res.status(201).json({ token, user: { name, email, role: userRole, location: user.location } });
    }

    const exists = memoryUsers.find(u => u.email === email);
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const newUser = { id: Date.now().toString(), name, email, role: userRole, location: location || 'Indore' };
    memoryUsers.push(newUser);
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, role } = req.body;
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
    } else {
      user = memoryUsers.find(u => u.email === email);
    }

    if (!user) {
      user = { id: Date.now().toString(), name: email.split('@')[0], email, role: role || 'Farmer', location: 'Indore' };
      memoryUsers.push(user);
    }

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. FARM & CROP MANAGEMENT (CRUD) ---
app.get('/api/farms', async (req, res) => {
  const { farmerEmail } = req.query;
  if (mongoose.connection.readyState === 1) {
    const query = farmerEmail ? { farmerEmail } : {};
    const farms = await Farm.find(query);
    return res.json(farms);
  }
  const filtered = farmerEmail ? memoryFarms.filter(f => f.farmerEmail === farmerEmail) : memoryFarms;
  res.json(filtered);
});

app.post('/api/farms', async (req, res) => {
  try {
    const { farmerEmail, farmName, areaAcres, currentCrop, stage } = req.body;
    const newFarm = {
      id: 'f_' + Date.now(),
      farmerEmail: farmerEmail || 'farmer@agritech.com',
      farmName: farmName || 'My Farm',
      areaAcres: Number(areaAcres) || 2.0,
      currentCrop: currentCrop || 'Wheat',
      stage: stage || 'Vegetative',
      healthScore: Math.floor(Math.random() * 15) + 80
    };

    if (mongoose.connection.readyState === 1) {
      const savedFarm = new Farm(newFarm);
      await savedFarm.save();
      return res.status(201).json(savedFarm);
    }
    memoryFarms.push(newFarm);
    res.status(201).json(newFarm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/farms/:id', async (req, res) => {
  const { id } = req.params;
  if (mongoose.connection.readyState === 1) {
    await Farm.findByIdAndDelete(id);
  }
  memoryFarms = memoryFarms.filter(f => f.id !== id && f._id?.toString() !== id);
  res.json({ message: 'Farm profile deleted successfully' });
});

// --- 3. RESOURCE MARKETPLACE & ORDER TRACKING ---
app.get('/api/resources', (req, res) => {
  res.json(memoryResources);
});

app.post('/api/resources', (req, res) => {
  const { name, category, price, stock } = req.body;
  const item = { id: 'r_' + Date.now(), name, category, price: Number(price), stock: Number(stock), approved: true };
  memoryResources.push(item);
  res.status(201).json(item);
});

app.get('/api/orders', (req, res) => {
  res.json(memoryOrders);
});

app.post('/api/orders', (req, res) => {
  const { farmerEmail, itemName, quantity, totalAmount } = req.body;
  const order = {
    id: 'ord-' + Math.floor(100 + Math.random() * 900),
    farmerEmail: farmerEmail || 'farmer@agritech.com',
    itemName,
    quantity: Number(quantity),
    totalAmount: Number(totalAmount),
    status: 'Confirmed',
    date: new Date().toISOString().split('T')[0]
  };
  memoryOrders.push(order);
  res.status(201).json(order);
});

// --- 4. EXPERT CONSULTATION & COMMUNITY FORUM ---
app.get('/api/forum', (req, res) => {
  res.json(memoryForum);
});

app.post('/api/forum/question', (req, res) => {
  const { author, question } = req.body;
  const newQ = { id: 'q_' + Date.now(), author: author || 'Farmer', question, reply: '', expert: '' };
  memoryForum.unshift(newQ);
  res.status(201).json(newQ);
});

app.post('/api/forum/reply', (req, res) => {
  const { id, reply, expert } = req.body;
  const query = memoryForum.find(q => q.id === id);
  if (query) {
    query.reply = reply;
    query.expert = expert || 'Dr. Sharma (Admin)';
  }
  res.json(query);
});

// --- 5. SOIL ANALYSIS & CROP ADVISORY RULES ---
app.post('/api/soil/recommend', (req, res) => {
  const { soilType, phLevel } = req.body;
  const ph = parseFloat(phLevel) || 6.5;

  let crops = [];
  let fertilizer = '';
  let waterAdvice = '';
  const normalizedSoil = (soilType || 'black').toLowerCase();

  switch (normalizedSoil) {
    case 'black':
      crops = ['Cotton', 'Soybean', 'Wheat', 'Gram', 'Sorghum'];
      fertilizer = 'Add Nitrogen and Phosphorus; rich in natural Calcium and Potassium.';
      waterAdvice = 'High moisture retention capacity. Avoid over-irrigation to prevent root rot.';
      break;
    case 'alluvial':
      crops = ['Rice (Paddy)', 'Wheat', 'Sugarcane', 'Maize', 'Mustard'];
      fertilizer = 'Apply balanced NPK (Nitrogen-Phosphorus-Potassium) with micronutrient zinc.';
      waterAdvice = 'Moderate irrigation required at regular intervals during tillering.';
      break;
    case 'red':
      crops = ['Groundnut', 'Millets (Bajra/Ragi)', 'Pulses', 'Tobacco'];
      fertilizer = 'Requires organic compost, farmyard manure, and phosphate enrichment.';
      waterAdvice = 'Low moisture retention. Requires frequent light watering or drip lines.';
      break;
    default:
      crops = ['Vegetables (Tomato/Onion)', 'Wheat', 'Pulses', 'Barley'];
      fertilizer = 'Apply well-decomposed cow dung manure and bio-fertilizers.';
      waterAdvice = 'Good balance; irrigate when top 2 inches of soil feel dry.';
  }

  let phStatus = '';
  if (ph < 6.0) phStatus = 'Acidic: Apply agricultural limestone to balance acidity.';
  else if (ph > 7.5) phStatus = 'Alkaline: Apply gypsum or elemental sulfur to reduce alkalinity.';
  else phStatus = 'Optimal neutral pH range (6.0 - 7.5) for nutrient uptake.';

  res.json({ soilType: normalizedSoil, ph, crops, fertilizer, waterAdvice, phStatus });
});

// --- 6. PEST ALERTS DIRECTORY ---
app.get('/api/pests', (req, res) => {
  res.json([
    { id: 1, crop: 'Soybean', pest: 'Girdle Beetle / Stem Fly', severity: 'High', symptoms: 'Girdled rings on plant stem, top foliage drying out.', remedy: 'Apply Chlorantraniliprole 18.5% SC @ 60 ml/acre.' },
    { id: 2, crop: 'Wheat', pest: 'Yellow Rust & Termites', severity: 'Medium', symptoms: 'Yellow stripes of powdery pustules along leaf veins.', remedy: 'Spray Propiconazole 25% EC @ 1 ml/L upon early detection.' },
    { id: 3, crop: 'Cotton', pest: 'Pink Bollworm & Whitefly', severity: 'High', symptoms: 'Rosetted flowers, young bolls dropping prematurely.', remedy: 'Install pheromone traps (5 traps/acre) and spray Emamectin Benzoate 5% SG.' },
    { id: 4, crop: 'Rice / Paddy', pest: 'Brown Planthopper (BPH)', severity: 'Medium', symptoms: 'Hopper burn patches showing circular yellow drying in fields.', remedy: 'Drain standing water for 2-3 days; apply Pymetrozine 50% WG.' }
  ]);
});

// --- 7. WEATHER PROXY ---
app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'Indore';
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey || apiKey === 'mock_key') {
    return res.json({
      city,
      temp: 28.5,
      humidity: 58,
      condition: 'Partly Sunny',
      windSpeed: '12 km/h',
      advisory: 'Optimal weather for spraying and light field irrigation over the next 48 hours.'
    });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    res.json({
      city: response.data.name,
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].main,
      windSpeed: `${response.data.wind.speed} m/s`,
      advisory: 'Check soil moisture before irrigation based on local humidity.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch external weather info' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AgriTech Server listening on http://localhost:${PORT}`));