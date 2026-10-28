const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

const User = require('./models/User');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Farm = require('./models/Farm');
const Booking = require('./models/Booking');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Helper: Smart category photo assigner if image is empty or invalid
const getCategoryPhoto = (category = '', name = '') => {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  if (n.includes('coriander')) {
    return '/corrianderSeeds.jpg';
  }
  if (n.includes('pumpkin')) {
    return 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=800&q=80';
  }
  if (n.includes('broccoli') || n.includes('green')) {
    return 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=800&q=80';
  }
  if (c.includes('seed') || n.includes('seed')) {
    return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';
  }
  if (c.includes('fert') || n.includes('npk') || n.includes('urea')) {
    return 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80';
  }
  if (c.includes('pest') || n.includes('neem') || n.includes('shield')) {
    return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
};

// Seed diverse initial products if MongoDB has none
const seedStoreDefaults = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        {
          name: 'Hybrid Wheat Seeds (HD-2967)',
          category: 'Seeds',
          price: 1450,
          stock: 85,
          description: 'High-tillering certified wheat seeds with high rust resistance and robust grain yield.',
          imgUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Organic Sweet Pumpkin',
          category: 'Vegetable',
          price: 180,
          stock: 40,
          description: 'Naturally cultivated sweet pumpkin direct from regional organic farms.',
          imgUrl: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Cold-Pressed Neem Bio-Shield',
          category: 'Pesticide',
          price: 420,
          stock: 120,
          description: 'Botanical azadirachtin repellent protecting crops from sucking pests and chewing worms.',
          imgUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Balanced NPK Macro Blend (10:26:26)',
          category: 'Fertilizer',
          price: 1250,
          stock: 60,
          description: 'High-grade water-soluble granular blend promoting vigorous root system and grain weight.',
          imgUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80'
        }
      ]);
      console.log('Successfully seeded default products into MongoDB');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};
seedStoreDefaults();

// -------------------------------------------------------------
// 1. AUTH & USER MANAGEMENT (MongoDB)
// -------------------------------------------------------------
app.post('/api/users/login', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const cleanEmail = email.toLowerCase().trim();
  try {
    const Model = role === 'Admin' ? Admin : User;
    let account = await Model.findOne({ email: cleanEmail });

    if (!account) {
      account = new Model({
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: password || '123456'
      });
      await account.save();
    }
    res.json({ success: true, user: account });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 2. PRODUCTS: CRUD & INVENTORY (MongoDB)
// -------------------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    let { name, category, price, description, imgUrl, stock } = req.body;
    if (!imgUrl || !imgUrl.startsWith('http') || imgUrl.includes('search?')) {
      imgUrl = getCategoryPhoto(category, name);
    }
    const newProd = new Product({
      name,
      category: category || 'Vegetable',
      price: Number(price) || 100,
      description: description || 'Fresh agricultural supply with quality guarantee.',
      imgUrl,
      stock: Number(stock) || 50
    });
    await newProd.save();
    res.status(201).json(newProd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Product Route
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, category, price, description, imgUrl, stock } = req.body;
    let finalImg = imgUrl;
    if (!finalImg || !finalImg.startsWith('http') || finalImg.includes('search?')) {
      finalImg = getCategoryPhoto(category, name);
    }
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price: Number(price),
        description,
        imgUrl: finalImg,
        stock: Number(stock)
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. FARMS (MongoDB)
// -------------------------------------------------------------
app.get('/api/farms', async (req, res) => {
  try {
    const { email, role } = req.query;
    let query = {};
    if (role !== 'Admin' && email) {
      query = { farmerEmail: email.toLowerCase().trim() };
    }
    const farms = await Farm.find(query).sort({ _id: -1 });
    res.json(farms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/farms', async (req, res) => {
  try {
    const farm = new Farm({
      ...req.body,
      farmerEmail: req.body.farmerEmail ? req.body.farmerEmail.toLowerCase().trim() : 'farmer@agritech.org'
    });
    await farm.save();
    res.status(201).json(farm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. BOOKINGS (MongoDB with Stock Deduction)
// -------------------------------------------------------------
app.get('/api/bookings', async (req, res) => {
  try {
    const { email, role } = req.query;
    let query = {};
    if (role !== 'Admin' && email) {
      query = { buyerEmail: email.toLowerCase().trim() };
    }
    const bookings = await Booking.find(query).sort({ _id: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { productId, quantity, buyerEmail } = req.body;
    
    // Deduct stock in MongoDB
    if (productId) {
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -Number(quantity || 1) }
      });
    }

    const booking = new Booking({
      ...req.body,
      buyerEmail: buyerEmail ? buyerEmail.toLowerCase().trim() : 'farmer@agritech.org'
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. FULLY DYNAMIC WORLDWIDE WEATHER (Live Open-Meteo Integration)
// -------------------------------------------------------------
app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'Indore';
  try {
    // 1. Geocode city name to lat/long
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      // Fallback deterministic mock if unknown place
      return res.json({
        city,
        temp: 28.5,
        humidity: 50,
        wind: '5.4 km/h',
        pressure: '1012 hPa',
        condition: 'Clear Sky'
      });
    }

    const { latitude, longitude, name, admin1, country } = geoData.results[0];
    
    // 2. Fetch live atmospheric metrics
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code`);
    const wData = await weatherRes.json();

    const current = wData.current || {};
    const code = current.weather_code || 0;
    let condition = 'Clear Sky';
    if (code > 0 && code <= 3) condition = 'Partly Cloudy';
    else if (code >= 45 && code <= 48) condition = 'Misty / Fog';
    else if (code >= 51 && code <= 67) condition = 'Showers / Rain';
    else if (code >= 80) condition = 'Heavy Rain / Storm';

    res.json({
      city: `${name}${admin1 ? ', ' + admin1 : ''}${country ? ' (' + country + ')' : ''}`,
      temp: current.temperature_2m !== undefined ? current.temperature_2m : 29.0,
      humidity: current.relative_humidity_2m !== undefined ? current.relative_humidity_2m : 48,
      wind: `${current.wind_speed_10m !== undefined ? current.wind_speed_10m : 5.0} km/h`,
      pressure: `${Math.round(current.surface_pressure || 1012)} hPa`,
      condition
    });
  } catch (err) {
    res.json({
      city,
      temp: 29.2,
      humidity: 48,
      wind: '5.2 km/h',
      pressure: '1012 hPa',
      condition: 'Favorable Spray Window'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AgriTech Server listening on port ${PORT}`));