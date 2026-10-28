import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  FaSeedling,
  FaTractor,
  FaCloudSun,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaBoxes,
  FaShieldAlt,
  FaTint,
  FaTemperatureHigh,
  FaWind,
  FaCompass,
  FaSyncAlt,
  FaUsers,
  FaShoppingCart,
  FaEdit,
  FaTrashAlt,
  FaSearch
} from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BACKEND_URL = 'http://localhost:5000/api';

const AgriLogo = () => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="#059669" />
    <path d="M12 28C12 19 18 12 29 11C29 20 22 28 12 28Z" fill="#FFFFFF" />
    <path d="M14 28C16 21 21 16 28 12" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M12 28C14 22 19 19 23 18C23 23 20 27 12 28Z" fill="#F59E0B" />
  </svg>
);

const heroSlides = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=1600&q=85'
];

const cropDatabase = {
  Wheat: {
    scientific: 'Triticum aestivum',
    growth: '3-4 months',
    season: 'Rabi (Winter)',
    sowing: 'October - November',
    climate: '15-25°C, 300-400 mm',
    harvest: 'March - April',
    soil: 'Well-aerated fertile loam',
    pesticides: ['Carbendazim 50% WP', 'Chlorpyrifos 20% EC'],
    fertilizers: ['Urea (Split Dose)', 'Single Super Phosphate (SSP)'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
  },
  Rice: {
    scientific: 'Oryza sativa',
    growth: '4-5 months',
    season: 'Kharif (Monsoon)',
    sowing: 'June - July',
    climate: '20-35°C, 1000-1500 mm',
    harvest: 'November - December',
    soil: 'Heavy clayey alluvial loam',
    pesticides: ['Cartap Hydrochloride', 'Pymetrozine 50% WDG'],
    fertilizers: ['DAP (18:46:0)', 'Zinc Sulfate Monohydrate'],
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80'
  },
  Maize: {
    scientific: 'Zea mays',
    growth: '3-4 months',
    season: 'Kharif & Spring',
    sowing: 'June - July',
    climate: '18-27°C, 500-750 mm',
    harvest: 'September - October',
    soil: 'Well-drained fertile loam',
    pesticides: ['Atrazine 50% WP', 'Chlorantraniliprole'],
    fertilizers: ['Balanced NPK (10:26:26)', 'Organic Compost'],
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80'
  },
  Soybean: {
    scientific: 'Glycine max',
    growth: '3-3.5 months',
    season: 'Kharif',
    sowing: 'June - July',
    climate: '20-30°C, 600-1000 mm',
    harvest: 'October',
    soil: 'Rich black cotton soil',
    pesticides: ['Triazophos 40% EC', 'Emamectin Benzoate'],
    fertilizers: ['Rhizobium Inoculant', 'Single Super Phosphate'],
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'
  }
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('agritech_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentScreen, setCurrentScreen] = useState(() => {
    const saved = localStorage.getItem('agritech_user');
    if (!saved) return 'landing';
    const parsed = JSON.parse(saved);
    return parsed.role === 'Admin' ? 'adminDashboard' : 'userHome';
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auth States
  const [loginRole, setLoginRole] = useState('User');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpName, setSignUpName] = useState('');

  // Live Database Collections
  const [liveUsers, setLiveUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [farms, setFarms] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Weather State
  const [cityInput, setCityInput] = useState('Indore');
  const [weatherData, setWeatherData] = useState({
    city: 'Indore, MP (India)',
    temp: 29.5,
    humidity: 46,
    wind: '5.2 km/h',
    pressure: '1012 hPa',
    condition: 'Optimal Spray Window'
  });
  const [weatherLoading, setWeatherLoading] = useState(false);

  // User Actions
  const [selectedCropKey, setSelectedCropKey] = useState('Wheat');
  const [selectedProductToOrder, setSelectedProductToOrder] = useState(null);
  const [orderName, setOrderName] = useState('');
  const [orderQty, setOrderQty] = useState(1);

  // Farm Registration Form
  const [farmNameInput, setFarmNameInput] = useState('');
  const [farmLocationInput, setFarmLocationInput] = useState('');
  const [farmAreaInput, setFarmAreaInput] = useState('');
  const [farmCropInput, setFarmCropInput] = useState('Soybean');

  // Admin New Product
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Vegetable');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('50');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Admin Edit Product
  const [editingProduct, setEditingProduct] = useState(null);

  // Contact Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    syncFromDatabase();
  }, [currentScreen, currentUser]);

  useEffect(() => {
    handleSearchWeather();
  }, []);

  const syncFromDatabase = async () => {
    try {
      const email = currentUser?.email ? currentUser.email.toLowerCase().trim() : '';
      const role = currentUser?.role || 'User';

      const [usersRes, prodsRes, farmsRes, bookingsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/users`).catch(() => ({ data: [] })),
        axios.get(`${BACKEND_URL}/products`).catch(() => ({ data: [] })),
        axios.get(`${BACKEND_URL}/farms?email=${email}&role=${role}`).catch(() => ({ data: [] })),
        axios.get(`${BACKEND_URL}/bookings?email=${email}&role=${role}`).catch(() => ({ data: [] }))
      ]);

      setLiveUsers(usersRes.data || []);
      setProducts(prodsRes.data || []);
      setFarms(farmsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (e) {
      console.warn('Sync issue:', e.message);
    }
  };

  const scrollToSection = (id) => {
    if (currentScreen !== 'landing') {
      setCurrentScreen('landing');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchWeather = async (e) => {
    if (e) e.preventDefault();
    if (!cityInput) return;
    setWeatherLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/weather?city=${encodeURIComponent(cityInput)}`);
      setWeatherData(res.data);
    } catch {
      setWeatherData({
        city: cityInput,
        temp: 28.5,
        humidity: 50,
        wind: '5.2 km/h',
        pressure: '1012 hPa',
        condition: 'Clear Sky'
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = loginEmail.toLowerCase().trim();
    try {
      const payload = {
        name: isSignUp ? signUpName : cleanEmail.split('@')[0],
        email: cleanEmail,
        password: loginPassword,
        role: loginRole
      };
      const res = await axios.post(`${BACKEND_URL}/users/login`, payload);
      const user = res.data.user || payload;
      const verifiedUser = { ...user, role: loginRole, email: cleanEmail };

      localStorage.setItem('agritech_user', JSON.stringify(verifiedUser));
      setCurrentUser(verifiedUser);
      await syncFromDatabase();

      if (loginRole === 'Admin') setCurrentScreen('adminDashboard');
      else setCurrentScreen('userHome');
    } catch (err) {
      alert('Authentication error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agritech_user');
    setCurrentUser(null);
    setCurrentScreen('landing');
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = currentUser?.email ? currentUser.email.toLowerCase().trim() : 'farmer@agritech.org';
    const newBooking = {
      bookingId: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      productId: selectedProductToOrder?._id,
      productName: selectedProductToOrder?.name || 'Agri-Product',
      bookingDate: new Date().toLocaleDateString('en-GB'),
      quantity: orderQty,
      price: (selectedProductToOrder?.price || 180) * orderQty + 45,
      status: 'Confirmed',
      buyerEmail: cleanEmail
    };

    try {
      await axios.post(`${BACKEND_URL}/bookings`, newBooking);
      alert('Booking Confirmed! Stock updated and order tracked.');
      await syncFromDatabase();
      setCurrentScreen('myBookings');
    } catch (err) {
      alert('Order failed: ' + err.message);
    }
  };

  const handleAddFarm = async (e) => {
    e.preventDefault();
    const cleanEmail = currentUser?.email ? currentUser.email.toLowerCase().trim() : 'farmer@agritech.org';
    const newFarm = {
      name: farmNameInput,
      location: farmLocationInput,
      area: Number(farmAreaInput),
      estDate: new Date().toISOString().split('T')[0],
      crop: farmCropInput,
      farmerEmail: cleanEmail
    };

    try {
      await axios.post(`${BACKEND_URL}/farms`, newFarm);
      alert('Farm profile saved in MongoDB!');
      setFarmNameInput('');
      setFarmLocationInput('');
      setFarmAreaInput('');
      await syncFromDatabase();
      setCurrentScreen('farms');
    } catch (err) {
      alert('Failed to register farm: ' + err.message);
    }
  };

  const handleAdminAddProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      description: newProdDesc,
      imgUrl: newProdImage
    };
    try {
      await axios.post(`${BACKEND_URL}/products`, payload);
      alert('Product published to store!');
      setNewProdName('');
      setNewProdPrice('');
      setNewProdStock('50');
      setNewProdDesc('');
      setNewProdImage('');
      await syncFromDatabase();
      setCurrentScreen('adminProducts');
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    }
  };

  const handleAdminUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BACKEND_URL}/products/${editingProduct._id}`, editingProduct);
      alert('Product updated successfully!');
      setEditingProduct(null);
      await syncFromDatabase();
    } catch (err) {
      alert('Failed to update product: ' + err.message);
    }
  };

  const handleAdminDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/products/${id}`);
      await syncFromDatabase();
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${contactName}! Your inquiry has been routed to our regional agronomy advisor.`);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const chartData = {
    labels: ['Registered Users', 'Active Farms', 'Catalog Items', 'Dispatched Orders'],
    datasets: [
      {
        label: 'Platform Scale Metrics',
        data: [liveUsers.length, farms.length, products.length, bookings.length],
        backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6'],
        borderRadius: 8
      }
    ]
  };

  return (
    <div>
      {/* GLOBAL NAVBAR */}
      <nav className="agri-nav d-flex justify-content-between align-items-center">
        <div className="brand-wrapper" onClick={() => setCurrentScreen(currentUser ? (currentUser.role === 'Admin' ? 'adminDashboard' : 'userHome') : 'landing')}>
          <AgriLogo />
          <div className="brand-text">Agri<span>Tech</span></div>
        </div>

        {/* 1. Public Links */}
        {!currentUser && (
          <div className="d-flex align-items-center gap-1">
            <span className="nav-link-custom" onClick={() => scrollToSection('features')}>Features</span>
            <span className="nav-link-custom" onClick={() => scrollToSection('services')}>Services</span>
            <span className="nav-link-custom" onClick={() => scrollToSection('about')}>About</span>
            <span className="nav-link-custom" onClick={() => scrollToSection('testimonials')}>Testimonials</span>
            <span className="nav-link-custom" onClick={() => scrollToSection('contact')}>Contact</span>
            <button className="btn btn-emerald ms-2" onClick={() => { setLoginRole('User'); setIsSignUp(false); setCurrentScreen('authModal'); }}>
              Sign In
            </button>
          </div>
        )}

        {/* 2. Farmer Links */}
        {currentUser?.role === 'User' && (
          <div className="d-flex align-items-center gap-1">
            <span className={`nav-link-custom ${currentScreen === 'userHome' ? 'active' : ''}`} onClick={() => setCurrentScreen('userHome')}>Home</span>
            <span className={`nav-link-custom ${currentScreen === 'products' ? 'active' : ''}`} onClick={() => setCurrentScreen('products')}>Store</span>
            <span className={`nav-link-custom ${currentScreen === 'farms' ? 'active' : ''}`} onClick={() => setCurrentScreen('farms')}>Farms</span>
            <span className={`nav-link-custom ${currentScreen === 'myBookings' ? 'active' : ''}`} onClick={() => setCurrentScreen('myBookings')}>MyBookings</span>

            <div className="user-profile-chip ms-3">
              <div className="avatar-disc">{currentUser.name?.charAt(0).toUpperCase()}</div>
              <div className="d-flex flex-column text-start pe-1" style={{ lineHeight: 1.1 }}>
                <span className="fw-bold small">{currentUser.name}</span>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Farmer</span>
              </div>
            </div>

            <button className="btn btn-sm btn-outline-light rounded-pill px-3 ms-2" onClick={handleLogout} title="Sign Out">
              <FaSignOutAlt />
            </button>
          </div>
        )}

        {/* 3. Admin Links */}
        {currentUser?.role === 'Admin' && (
          <div className="d-flex align-items-center gap-1">
            <span className={`nav-link-custom ${currentScreen === 'adminDashboard' ? 'active' : ''}`} onClick={() => setCurrentScreen('adminDashboard')}>Dashboard</span>
            <span className={`nav-link-custom ${currentScreen === 'adminUsers' ? 'active' : ''}`} onClick={() => setCurrentScreen('adminUsers')}>Users</span>
            <span className={`nav-link-custom ${currentScreen === 'adminProducts' ? 'active' : ''}`} onClick={() => setCurrentScreen('adminProducts')}>Products</span>
            <span className={`nav-link-custom ${currentScreen === 'adminAddProduct' ? 'active' : ''}`} onClick={() => setCurrentScreen('adminAddProduct')}>+ Add Item</span>

            <div className="user-profile-chip ms-3">
              <div className="avatar-disc" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>A</div>
              <div className="d-flex flex-column text-start pe-1" style={{ lineHeight: 1.1 }}>
                <span className="fw-bold small">{currentUser.name}</span>
                <span className="text-warning" style={{ fontSize: '0.7rem' }}>Administrator</span>
              </div>
            </div>

            <button className="btn btn-sm btn-outline-light rounded-pill px-3 ms-2" onClick={handleLogout} title="Sign Out">
              <FaSignOutAlt />
            </button>
          </div>
        )}
      </nav>

      {/* SCREEN: LANDING */}
      {currentScreen === 'landing' && (
        <div>
          <div className="hero-slider-container">
            {heroSlides.map((url, i) => (
              <div
                key={i}
                className={`hero-slide-bg ${i === currentSlideIndex ? 'active-slide' : ''}`}
                style={{ backgroundImage: `url('${url}')` }}
              />
            ))}
            <div className="hero-dark-overlay" />
            <div className="hero-content">
              <div className="hero-tag"><FaSeedling /> Digital Agronomy System</div>
              <h1 className="hero-title">Innovative Agriculture Solutions</h1>
              <p className="hero-subtitle">Empowering farmers with cutting-edge technology to enhance productivity, crop health, and market access.</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-emerald" onClick={() => { setLoginRole('User'); setIsSignUp(true); setCurrentScreen('authModal'); }}>Get Started</button>
                <button className="btn btn-amber" onClick={() => { setLoginRole('Admin'); setIsSignUp(false); setCurrentScreen('authModal'); }}>Admin Portal</button>
              </div>
            </div>
          </div>

          <div className="container py-5" id="features">
            <div className="text-center mb-5">
              <span className="text-success fw-bold text-uppercase small">Precision Agriculture</span>
              <h2 className="fw-bold text-dark mt-1">Our Features</h2>
              <p className="text-secondary mx-auto" style={{ maxWidth: '650px' }}>Data-driven agronomy workflows built directly for multi-plot landholders.</p>
            </div>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="glass-card p-4 text-center h-100">
                  <div className="feature-glyph glyph-emerald"><FaSeedling /></div>
                  <h5 className="fw-bold">Crop Disease Diagnostics</h5>
                  <p className="text-secondary small mb-0">Detailed diagnostic breakdowns for regional crops, including symptoms and pest remedies.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="glass-card p-4 text-center h-100">
                  <div className="feature-glyph glyph-sky"><FaTractor /></div>
                  <h5 className="fw-bold">Farm Plot Management</h5>
                  <p className="text-secondary small mb-0">Real-time boundary registration where users can manage multi-plot acreage and seasonal schedules.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="glass-card p-4 text-center h-100">
                  <div className="feature-glyph glyph-amber"><FaTint /></div>
                  <h5 className="fw-bold">Smart Irrigation</h5>
                  <p className="text-secondary small mb-0">Live atmospheric monitoring to plan spraying and irrigation efficiently.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-canvas py-5" id="services">
            <div className="container">
              <div className="text-center mb-5">
                <span className="text-success fw-bold text-uppercase small">Farmer Enablement</span>
                <h2 className="fw-bold text-dark mt-1">Our Services</h2>
                <p className="text-secondary mx-auto" style={{ maxWidth: '650px' }}>Comprehensive services designed to support sustainable and profitable agriculture.</p>
              </div>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="glass-card p-4 h-100 d-flex gap-3 align-items-center">
                    <div className="feature-glyph glyph-amber m-0"><FaBoxes /></div>
                    <div>
                      <h5 className="fw-bold mb-1">Direct Agri-Procurement</h5>
                      <p className="text-secondary small mb-0">Purchase certified seeds, crop protection bio-pesticides, and fertilizers directly with automated dispatch tracking.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="glass-card p-4 h-100 d-flex gap-3 align-items-center">
                    <div className="feature-glyph glyph-emerald m-0"><FaShieldAlt /></div>
                    <div>
                      <h5 className="fw-bold mb-1">Agronomist Governance</h5>
                      <p className="text-secondary small mb-0">Administrative management of stock availability, user account verification, and continuous field advisory monitoring.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container py-5" id="about">
            <div className="text-center mb-5">
              <span className="text-success fw-bold text-uppercase small">ABOUT US</span>
              <h2 className="fw-bold text-dark mt-1">Welcome to AgriTech</h2>
              <p className="text-secondary mx-auto" style={{ maxWidth: '780px' }}>AgriTech is dedicated to revolutionizing the agricultural sector through data-driven precision tools and accessible farmer services.</p>
            </div>
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="glass-card p-4 h-100">
                  <h5 className="fw-bold d-flex align-items-center gap-2 mb-2 text-dark"><FaCompass className="text-success" /> Our Mission</h5>
                  <p className="text-secondary small mb-0">Enhance productivity and sustainability in agriculture through cutting-edge technology and data-driven solutions.</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="glass-card p-4 h-100">
                  <h5 className="fw-bold d-flex align-items-center gap-2 mb-2 text-dark"><FaShieldAlt className="text-primary" /> Our Vision</h5>
                  <p className="text-secondary small mb-0">Be a regional leader in providing innovative agricultural technologies that empower farmers and agribusinesses to thrive.</p>
                </div>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-3"><div className="glass-card p-4 text-center"><h2 className="fw-bold text-success mb-1">10K+</h2><span className="text-muted small fw-semibold">Farmers Empowered</span></div></div>
              <div className="col-md-3"><div className="glass-card p-4 text-center"><h2 className="fw-bold text-success mb-1">30%</h2><span className="text-muted small fw-semibold">Yield Improvement</span></div></div>
              <div className="col-md-3"><div className="glass-card p-4 text-center"><h2 className="fw-bold text-success mb-1">50%</h2><span className="text-muted small fw-semibold">Water Savings</span></div></div>
              <div className="col-md-3"><div className="glass-card p-4 text-center"><h2 className="fw-bold text-success mb-1">100+</h2><span className="text-muted small fw-semibold">Innovations</span></div></div>
            </div>
          </div>

          <div className="dashboard-canvas py-5" id="testimonials">
            <div className="container" style={{ maxWidth: '980px' }}>
              <div className="text-center mb-5">
                <span className="text-success fw-bold text-uppercase small">Real Experiences</span>
                <h2 className="fw-bold text-dark mt-1">What Farmers Say</h2>
              </div>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="glass-card p-4 h-100">
                    <p className="fst-italic text-secondary mb-3">"The weather forecast alerts saved our soybean harvest before unseasonal rains hit. The pest recommendations are spot on."</p>
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-disc">R</div>
                      <div>
                        <strong className="d-block small">Ramesh Patel</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Indore Region, 12 Acres</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="glass-card p-4 h-100">
                    <p className="fst-italic text-secondary mb-3">"Ordering seeds and bio-fertilizers directly took less than 2 minutes. Transparent rates and genuine quality products."</p>
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-disc" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>S</div>
                      <div>
                        <strong className="d-block small">Suresh Kumar</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Ujjain Basin, 8 Acres</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container py-5" id="contact">
            <div className="text-center mb-5">
              <span className="text-success fw-bold text-uppercase small">Get in Touch</span>
              <h2 className="fw-bold text-dark mt-1">Contact AgriTech Support</h2>
              <p className="text-secondary">Have questions regarding soil health, product booking, or farm registration? Our specialists are here to assist.</p>
            </div>
            <div className="row g-4">
              <div className="col-md-5">
                <div className="d-flex flex-column gap-3">
                  <div className="glass-card p-3 d-flex align-items-center gap-3">
                    <div className="feature-glyph glyph-emerald m-0" style={{ width: 44, height: 44, fontSize: '1.2rem' }}><FaMapMarkerAlt /></div>
                    <div><strong className="d-block small">Regional Headquarters</strong><span className="text-muted small">AB Road, Knowledge Park, Indore, MP 452001</span></div>
                  </div>
                  <div className="glass-card p-3 d-flex align-items-center gap-3">
                    <div className="feature-glyph glyph-sky m-0" style={{ width: 44, height: 44, fontSize: '1.2rem' }}><FaPhone /></div>
                    <div><strong className="d-block small">Farmer Helpline (Toll-Free)</strong><span className="text-muted small">+91 1800-419-7890 (Mon-Sat, 8am-8pm)</span></div>
                  </div>
                  <div className="glass-card p-3 d-flex align-items-center gap-3">
                    <div className="feature-glyph glyph-amber m-0" style={{ width: 44, height: 44, fontSize: '1.2rem' }}><FaEnvelope /></div>
                    <div><strong className="d-block small">Support Email</strong><span className="text-muted small">support@agritech-platform.org</span></div>
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="glass-card p-4">
                  <h5 className="fw-bold mb-3">Send Inquiry to Agricultural Advisor</h5>
                  <form onSubmit={handleContactSubmit}>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Farmer / Business Name</label>
                      <input className="form-control" placeholder="Enter full name" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <input type="email" className="form-control" placeholder="name@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Message</label>
                      <textarea rows="3" className="form-control" placeholder="Detail your farming questions, bulk orders, or land monitoring inquiry..." value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-emerald w-100 py-2">Submit Message</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: AUTH MODAL */}
      {currentScreen === 'authModal' && (
        <div className="dashboard-canvas d-flex align-items-center justify-content-center">
          <div className="glass-card p-4 p-md-5" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <AgriLogo />
                <h4 className="fw-bold text-dark mb-0">{loginRole === 'User' ? 'Farmer' : 'Admin'} {isSignUp ? 'Sign Up' : 'Sign In'}</h4>
              </div>
              <button className="btn-close" onClick={() => setCurrentScreen('landing')}></button>
            </div>

            <div className="role-toggle-track">
              <div className={`role-toggle-slider ${loginRole === 'User' ? 'user-active' : 'admin-active'}`} />
              <button type="button" className={`role-toggle-btn ${loginRole === 'User' ? 'active' : 'inactive'}`} onClick={() => setLoginRole('User')}>Farmer Account</button>
              <button type="button" className={`role-toggle-btn ${loginRole === 'Admin' ? 'active' : 'inactive'}`} onClick={() => setLoginRole('Admin')}>Administrator</button>
            </div>

            <form onSubmit={handleAuthSubmit}>
              {isSignUp && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <input className="form-control" placeholder="e.g. Ramesh Patel" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} required />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input type="email" className="form-control" placeholder="name@farm.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <input type="password" className="form-control" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              </div>
              <button type="submit" className={`btn w-100 py-2 mb-3 ${loginRole === 'User' ? 'btn-emerald' : 'btn-amber'}`}>
                {isSignUp ? 'Create Account' : `Sign In as ${loginRole === 'User' ? 'Farmer' : 'Admin'}`}
              </button>
            </form>

            {loginRole === 'User' && (
              <div className="text-center small text-muted">
                {isSignUp ? (
                  <span>Already registered? <button type="button" className="btn btn-link btn-sm p-0 text-success fw-bold" onClick={() => setIsSignUp(false)}>Sign In</button></span>
                ) : (
                  <span>New farmer? <button type="button" className="btn btn-link btn-sm p-0 text-success fw-bold" onClick={() => setIsSignUp(true)}>Sign Up</button></span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCREEN: USER HOME */}
      {currentScreen === 'userHome' && (
        <div className="dashboard-canvas">
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="glass-card p-4 mb-5">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                  <h4 className="fw-bold mb-1 d-flex align-items-center gap-2 text-dark">
                    <FaCloudSun className="text-warning" /> Worldwide Agricultural Weather Forecast
                  </h4>
                  <span className="text-secondary small">Live atmospheric data for precision crop protection and sowing</span>
                </div>

                <form onSubmit={handleSearchWeather} className="d-flex align-items-center gap-2">
                  <div className="input-group input-group-sm" style={{ width: '260px' }}>
                    <input
                      className="form-control"
                      placeholder="Type any city or town..."
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                    />
                    <button className="btn btn-success d-flex align-items-center gap-1" type="submit" disabled={weatherLoading}>
                      <FaSearch /> {weatherLoading ? 'Loading...' : 'Check'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mb-3">
                <span className="badge bg-light text-dark border px-3 py-2 fs-6">📍 Location: <strong>{weatherData.city}</strong></span>
              </div>

              <div className="row g-3 text-center">
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-4">
                    <div className="d-flex justify-content-center mb-1 text-danger fs-5"><FaTemperatureHigh /></div>
                    <span className="text-muted small d-block">Air Temperature</span>
                    <strong className="fs-4">{weatherData.temp}°C</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-4">
                    <div className="d-flex justify-content-center mb-1 text-info fs-5"><FaTint /></div>
                    <span className="text-muted small d-block">Humidity</span>
                    <strong className="fs-4">{weatherData.humidity}%</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-4">
                    <div className="d-flex justify-content-center mb-1 text-secondary fs-5"><FaWind /></div>
                    <span className="text-muted small d-block">Wind Speed</span>
                    <strong className="fs-4">{weatherData.wind}</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-4">
                    <div className="d-flex justify-content-center mb-1 text-success fs-5"><FaCompass /></div>
                    <span className="text-muted small d-block">Condition</span>
                    <span className="badge bg-success rounded-pill mt-1">{weatherData.condition}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-dark mb-1">Agricultural Crop Advisory</h3>
              <p className="text-secondary small">Scientific profiles, fertilizer schedules, and pest treatments</p>
            </div>
            <div className="row g-4">
              {Object.keys(cropDatabase).map((key) => (
                <div className="col-md-3" key={key}>
                  <div className="glass-card h-100 d-flex flex-column">
                    <img src={cropDatabase[key].image} alt={key} style={{ height: 160, width: '100%', objectFit: 'cover' }} />
                    <div className="p-3 text-center d-flex flex-column flex-grow-1">
                      <h5 className="fw-bold mb-1">{key}</h5>
                      <span className="text-muted small d-block mb-3">{cropDatabase[key].scientific}</span>
                      <button className="btn btn-sm btn-outline-success rounded-pill px-3 mt-auto" onClick={() => { setSelectedCropKey(key); setCurrentScreen('cropDetail'); }}>
                        Learn More &gt;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: CROP DETAIL */}
      {currentScreen === 'cropDetail' && (
        <div className="dashboard-canvas">
          <div className="container" style={{ maxWidth: '850px' }}>
            <button className="btn btn-outline-secondary btn-sm rounded-pill mb-3" onClick={() => setCurrentScreen('userHome')}>
              &larr; Back to Advisory
            </button>
            <div className="glass-card mb-4">
              <img src={cropDatabase[selectedCropKey].image} alt={selectedCropKey} style={{ height: 260, width: '100%', objectFit: 'cover' }} />
              <div className="p-4">
                <h2 className="fw-bold text-dark mb-1">{selectedCropKey} <span className="fs-5 text-muted fst-italic">({cropDatabase[selectedCropKey].scientific})</span></h2>
                <hr className="my-3 opacity-10" />
                <div className="row g-3">
                  <div className="col-6 col-md-4"><span className="text-muted small d-block">Growth Cycle</span><strong>{cropDatabase[selectedCropKey].growth}</strong></div>
                  <div className="col-6 col-md-4"><span className="text-muted small d-block">Season</span><strong>{cropDatabase[selectedCropKey].season}</strong></div>
                  <div className="col-6 col-md-4"><span className="text-muted small d-block">Sowing Window</span><strong>{cropDatabase[selectedCropKey].sowing}</strong></div>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="glass-card p-4">
                  <h6 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2"><FaShieldAlt /> Recommended Pesticides</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {cropDatabase[selectedCropKey].pesticides.map((p, i) => (
                      <span key={i} className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="glass-card p-4">
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2"><FaTint /> Recommended Fertilizers</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {cropDatabase[selectedCropKey].fertilizers.map((f, i) => (
                      <span key={i} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: STORE (FARMER VIEW) */}
      {currentScreen === 'products' && (
        <div className="dashboard-canvas">
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold text-dark mb-0">Certified Agricultural Supplies</h3>
                <span className="text-secondary small">Seeds, crop protection, and fertilizers direct from regional stock</span>
              </div>
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={syncFromDatabase}>
                <FaSyncAlt /> Refresh
              </button>
            </div>

            <div className="row g-4">
              {products.length === 0 ? (
                <div className="col-12 text-center py-5 glass-card"><h5>No products currently in stock.</h5></div>
              ) : (
                products.map((p) => (
                  <div className="col-md-4" key={p._id}>
                    <div className="glass-card h-100 d-flex flex-column">
                      <img
                        src={p.imgUrl}
                        alt={p.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = p.name.toLowerCase().includes('coriander') ? '/coriander.jpg' : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';
                        }}
                        style={{ height: 190, width: '100%', objectFit: 'cover' }}
                      />
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">{p.category}</span>
                          <h4 className="fw-bold text-dark mb-0">₹{p.price}</h4>
                        </div>
                        <h5 className="fw-bold mb-1">{p.name}</h5>
                        <div className="mb-2">
                          <span className={`badge ${p.stock > 10 ? 'bg-secondary' : 'bg-danger'}`}>Stock: {p.stock} units</span>
                        </div>
                        <p className="text-secondary small mb-4">{p.description}</p>
                        <button
                          className="btn btn-emerald w-100 mt-auto d-flex align-items-center justify-content-center gap-2"
                          disabled={p.stock <= 0}
                          onClick={() => { setSelectedProductToOrder(p); setOrderQty(1); setCurrentScreen('orderModal'); }}
                        >
                          <FaShoppingCart /> {p.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: ORDER MODAL */}
      {currentScreen === 'orderModal' && (
        <div className="dashboard-canvas d-flex align-items-center justify-content-center">
          <div className="glass-card p-4" style={{ maxWidth: '480px', width: '100%' }}>
            <h4 className="fw-bold mb-1">Confirm Order</h4>
            <span className="text-muted small d-block mb-3">Item: <strong>{selectedProductToOrder?.name}</strong></span>
            <form onSubmit={handleOrderSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Farmer / Buyer Name</label>
                <input className="form-control" placeholder="Your Name" value={orderName} onChange={(e) => setOrderName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Quantity (Max: {selectedProductToOrder?.stock})</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProductToOrder?.stock || 50}
                  className="form-control"
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                  required
                />
              </div>
              <div className="p-3 bg-light rounded-3 mb-3 small">
                <div className="d-flex justify-content-between mb-1"><span>Unit Price:</span><strong>₹{selectedProductToOrder?.price}</strong></div>
                <div className="d-flex justify-content-between mb-1"><span>Convenience Fee:</span><span>₹45</span></div>
                <hr className="my-1" />
                <div className="d-flex justify-content-between fs-6 fw-bold"><span>Total Amount:</span><span className="text-success">₹{(selectedProductToOrder?.price * orderQty) + 45}</span></div>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setCurrentScreen('products')}>Cancel</button>
                <button type="submit" className="btn btn-emerald w-50">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN: FARMS */}
      {currentScreen === 'farms' && (
        <div className="dashboard-canvas">
          <div className="container" style={{ maxWidth: '980px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold text-dark mb-0">Registered Farm Profiles</h3>
                <span className="text-secondary small">Farms registered under: <strong>{currentUser?.email}</strong></span>
              </div>
              <button className="btn btn-emerald" onClick={() => setCurrentScreen('addFarm')}>+ Register Farm</button>
            </div>
            <div className="row g-4">
              {farms.length === 0 ? (
                <div className="col-12"><div className="glass-card p-5 text-center text-muted"><h5>No farms registered yet under this account.</h5><button className="btn btn-sm btn-emerald mt-2" onClick={() => setCurrentScreen('addFarm')}>Register Your First Farm</button></div></div>
              ) : (
                farms.map((f) => (
                  <div className="col-md-6" key={f._id}>
                    <div className="glass-card p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="fw-bold text-dark mb-0">{f.name}</h5>
                        <span className="badge bg-secondary">{f.crop}</span>
                      </div>
                      <p className="text-muted small mb-1">Location: {f.location}</p>
                      <p className="text-muted small mb-0">Acreage: <strong>{f.area} Acres</strong></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: ADD FARM */}
      {currentScreen === 'addFarm' && (
        <div className="dashboard-canvas d-flex align-items-center justify-content-center">
          <div className="glass-card p-4" style={{ maxWidth: '480px', width: '100%' }}>
            <h4 className="fw-bold mb-3">Register New Farm</h4>
            <form onSubmit={handleAddFarm}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Farm Name</label>
                <input className="form-control" placeholder="e.g. Malwa Ridge Field" value={farmNameInput} onChange={(e) => setFarmNameInput(e.target.value)} required />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Location</label>
                <input className="form-control" placeholder="e.g. Indore, MP" value={farmLocationInput} onChange={(e) => setFarmLocationInput(e.target.value)} required />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Area (Acres)</label>
                <input type="number" step="0.1" className="form-control" placeholder="e.g. 5.5" value={farmAreaInput} onChange={(e) => setFarmAreaInput(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Primary Crop</label>
                <select className="form-select" value={farmCropInput} onChange={(e) => setFarmCropInput(e.target.value)}>
                  <option value="Soybean">Soybean</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Maize">Maize</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setCurrentScreen('farms')}>Cancel</button>
                <button type="submit" className="btn btn-emerald w-50">Save Farm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN: MY BOOKINGS */}
      {currentScreen === 'myBookings' && (
        <div className="dashboard-canvas">
          <div className="container" style={{ maxWidth: '980px' }}>
            <h3 className="fw-bold mb-4">My Bookings & Dispatches</h3>
            <div className="glass-card p-4">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Product Item</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4 text-muted">No orders found. Purchase items from the Store to see them here!</td></tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b._id || b.bookingId}>
                        <td className="fw-bold">{b.bookingId}</td>
                        <td>{b.productName}</td>
                        <td className="text-muted small">{b.bookingDate}</td>
                        <td>{b.quantity}</td>
                        <td className="fw-bold text-success">₹{b.price}</td>
                        <td><span className="badge bg-success">{b.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: ADMIN DASHBOARD */}
      {currentScreen === 'adminDashboard' && (
        <div className="dashboard-canvas">
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold text-dark mb-1">Administrative Overview</h3>
                <span className="text-secondary small">Real-time system telemetry and persisted MongoDB entities</span>
              </div>
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={syncFromDatabase}>
                <FaSyncAlt /> Sync Live Data
              </button>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="glass-card p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1">Registered Users</span>
                    <h2 className="fw-bold mb-0 text-success">{liveUsers.length}</h2>
                  </div>
                  <div className="feature-glyph glyph-emerald m-0"><FaUsers /></div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="glass-card p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1">Active Farms</span>
                    <h2 className="fw-bold mb-0 text-primary">{farms.length}</h2>
                  </div>
                  <div className="feature-glyph glyph-sky m-0"><FaTractor /></div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="glass-card p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1">Store Items</span>
                    <h2 className="fw-bold mb-0 text-warning">{products.length}</h2>
                  </div>
                  <div className="feature-glyph glyph-amber m-0"><FaBoxes /></div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="glass-card p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1">Total Orders</span>
                    <h2 className="fw-bold mb-0" style={{ color: '#8b5cf6' }}>{bookings.length}</h2>
                  </div>
                  <div className="feature-glyph m-0" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}><FaShoppingCart /></div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 mb-4">
              <h5 className="fw-bold mb-3">System Scale Visualization</h5>
              <div style={{ height: '260px' }}>
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: ADMIN USERS DIRECTORY */}
      {currentScreen === 'adminUsers' && (
        <div className="dashboard-canvas">
          <div className="container" style={{ maxWidth: '980px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-dark mb-0">Registered Users Directory</h3>
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={syncFromDatabase}>
                <FaSyncAlt /> Refresh
              </button>
            </div>
            <div className="glass-card p-4">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Database ID</th>
                      <th>Farmer Name</th>
                      <th>Email Address</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveUsers.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4 text-muted">No users registered yet.</td></tr>
                    ) : (
                      liveUsers.map((u, i) => (
                        <tr key={u._id}>
                          <td>{i + 1}</td>
                          <td className="small text-muted font-monospace">{u._id}</td>
                          <td className="fw-bold">{u.name}</td>
                          <td>{u.email}</td>
                          <td><span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Verified</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: ADMIN PRODUCTS */}
      {currentScreen === 'adminProducts' && (
        <div className="dashboard-canvas">
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold text-dark mb-0">Store Inventory Management</h3>
                <span className="text-secondary small">Live stock levels, product details, and store availability</span>
              </div>
              <button className="btn btn-emerald" onClick={() => setCurrentScreen('adminAddProduct')}>+ Add New Item</button>
            </div>
            <div className="row g-4">
              {products.map((p) => (
                <div className="col-md-4" key={p._id}>
                  <div className="glass-card h-100 d-flex flex-column">
                    <img
                      src={p.imgUrl}
                      alt={p.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = p.name.toLowerCase().includes('coriander') ? '/coriander.jpg' : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';
                      }}
                      style={{ height: 180, width: '100%', objectFit: 'cover' }}
                    />
                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fw-bold mb-0">{p.name}</h6>
                        <span className="badge bg-secondary">{p.category}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="text-success fw-bold mb-0">₹{p.price}</h5>
                        <span className={`badge ${p.stock > 10 ? 'bg-info text-dark' : 'bg-danger'}`}>Stock: {p.stock}</span>
                      </div>
                      <p className="text-muted small mb-3 flex-grow-1">{p.description}</p>
                      <div className="d-flex gap-2 mt-auto">
                        <button className="btn btn-sm btn-outline-primary w-50 d-flex align-items-center justify-content-center gap-1" onClick={() => setEditingProduct(p)}>
                          <FaEdit /> Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger w-50 d-flex align-items-center justify-content-center gap-1" onClick={() => handleAdminDeleteProduct(p._id)}>
                          <FaTrashAlt /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDIT PRODUCT MODAL */}
          {editingProduct && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
              <div className="glass-card p-4" style={{ maxWidth: '500px', width: '90%' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Edit Product</h5>
                  <button className="btn-close" onClick={() => setEditingProduct(null)}></button>
                </div>
                <form onSubmit={handleAdminUpdateProduct}>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Product Name</label>
                    <input className="form-control" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Category</label>
                      <select className="form-select" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}>
                        <option value="Vegetable">Vegetable</option>
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Pesticide">Pesticide</option>
                      </select>
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Price (₹)</label>
                      <input type="number" className="form-control" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} required />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Stock</label>
                      <input type="number" className="form-control" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} required />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea rows="2" className="form-control" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Image URL</label>
                    <input className="form-control" value={editingProduct.imgUrl} onChange={(e) => setEditingProduct({ ...editingProduct, imgUrl: e.target.value })} />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary w-50" onClick={() => setEditingProduct(null)}>Cancel</button>
                    <button type="submit" className="btn btn-emerald w-50">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCREEN: ADMIN ADD PRODUCT */}
      {currentScreen === 'adminAddProduct' && (
        <div className="dashboard-canvas d-flex align-items-center justify-content-center">
          <div className="glass-card p-4" style={{ maxWidth: '520px', width: '100%' }}>
            <h4 className="fw-bold mb-3">Add Product to Store</h4>
            <form onSubmit={handleAdminAddProduct}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Item Name</label>
                <input className="form-control" placeholder="e.g. Bio-NPK Consortium" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} required />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Category</label>
                  <select className="form-select" value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)}>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Pesticide">Pesticide</option>
                  </select>
                </div>
                <div className="col-3">
                  <label className="form-label small fw-semibold">Price (₹)</label>
                  <input type="number" className="form-control" placeholder="450" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} required />
                </div>
                <div className="col-3">
                  <label className="form-label small fw-semibold">Stock</label>
                  <input type="number" className="form-control" placeholder="50" value={newProdStock} onChange={(e) => setNewProdStock(e.target.value)} required />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Description</label>
                <textarea rows="2" className="form-control" placeholder="Benefits, dosage, or crop suitability..." value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Image URL (Optional)</label>
                <input className="form-control" placeholder="https://..." value={newProdImage} onChange={(e) => setNewProdImage(e.target.value)} />
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Leave blank to auto-match a photo based on your chosen category.</span>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setCurrentScreen('adminProducts')}>Cancel</button>
                <button type="submit" className="btn btn-emerald w-50">Publish Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;