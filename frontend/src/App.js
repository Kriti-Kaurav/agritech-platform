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
  FaCheckCircle,
  FaEye,
  FaEdit,
  FaUsers,
  FaTractor,
  FaBoxOpen
} from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const cropDatabase = {
  Wheat: {
    scientific: 'Triticum aestivum',
    growth: '3-4 months',
    season: 'Rabi (Winter)',
    sowing: 'October - November',
    climate: '15-25°C, 300-400 mm',
    harvest: 'March - April',
    soil: 'Loamy soil',
    pesticides: ['Carbendazim', 'Chlorpyrifos', 'Propiconazole'],
    fertilizers: ['Nitrogen', 'Phosphorus', 'Potassium'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80'
  },
  Rice: {
    scientific: 'Oryza sativa',
    growth: '4-5 months',
    season: 'Kharif (Monsoon)',
    sowing: 'June - July',
    climate: '20-35°C, 1000-1500 mm',
    harvest: 'November - December',
    soil: 'Clayey loam',
    pesticides: ['Cartap Hydrochloride', 'Pymetrozine'],
    fertilizers: ['Urea', 'DAP', 'MOP'],
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1000&q=80'
  },
  Maize: {
    scientific: 'Zea mays',
    growth: '3-4 months',
    season: 'Kharif / Spring',
    sowing: 'June - July',
    climate: '18-27°C, 500-750 mm',
    harvest: 'September - October',
    soil: 'Well-drained fertile loam',
    pesticides: ['Atrazine', 'Chlorantraniliprole'],
    fertilizers: ['Nitrogen', 'Zinc Sulfate', 'NPK'],
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1000&q=80'
  },
  Soybean: {
    scientific: 'Glycine max',
    growth: '3-3.5 months',
    season: 'Kharif',
    sowing: 'June - July',
    climate: '20-30°C, 600-1000 mm',
    harvest: 'October',
    soil: 'Black soil / fertile loam',
    pesticides: ['Triazophos', 'Chlorantraniliprole'],
    fertilizers: ['Rhizobium inoculant', 'Single Super Phosphate'],
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80'
  },
  Sugarcane: {
    scientific: 'Saccharum officinarum',
    growth: '10-12 months',
    season: 'Perennial / Spring',
    sowing: 'February - March',
    climate: '20-35°C, 1500-2000 mm',
    harvest: 'December - March',
    soil: 'Deep rich loamy soil',
    pesticides: ['Chlorpyrifos', 'Imidacloprid'],
    fertilizers: ['Heavy Nitrogen', 'Potash', 'Phosphorus'],
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80'
  },
  Potato: {
    scientific: 'Solanum tuberosum',
    growth: '2.5-3.5 months',
    season: 'Rabi (Winter)',
    sowing: 'October - November',
    climate: '15-20°C, moderate moisture',
    harvest: 'January - February',
    soil: 'Loose, friable sandy loam',
    pesticides: ['Mancozeb', 'Metribuzin'],
    fertilizers: ['Potassium rich NPK', 'Farmyard manure'],
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1000&q=80'
  }
};

function App() {
  // Navigation:
  // Public: 'landing', 'loginChoice'
  // User: 'userHome', 'cropDetail', 'products', 'orderProduct', 'farms', 'addFarm', 'cropsList', 'addCrop', 'myBookings'
  // Admin: 'adminDashboard', 'adminUsers', 'adminProducts', 'adminAddProduct'
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null); // { role: 'User' | 'Admin', name, email }

  // Auth form
  const [loginRole, setLoginRole] = useState('User'); // 'User' or 'Admin'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpName, setSignUpName] = useState('');

  // Selected crop for Crop Information detail page
  const [selectedCropKey, setSelectedCropKey] = useState('Wheat');

  // Weather state (Auto + Manual search)
  const [searchCity, setSearchCity] = useState('Pālam');
  const [weatherData, setWeatherData] = useState({
    city: 'Pālam, IN',
    temp: 34.6,
    humidity: 44,
    wind: '6.33 m/s',
    pressure: '1002 hPa',
    condition: 'Overcast Clouds'
  });

  // Products List state
  const [products, setProducts] = useState([
    {
      id: 'p1',
      name: 'kaddu',
      category: 'veg',
      price: 18000,
      description: 'tasty',
      image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=600&q=80'
    }
  ]);
  const [selectedProductToOrder, setSelectedProductToOrder] = useState(null);

  // Order Booking Form state
  const [orderName, setOrderName] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderQty, setOrderQty] = useState(1);

  // My Bookings state
  const [bookings, setBookings] = useState([
    { id: '665611e4f3be', name: 'Soil Moisture Sensor', date: '26/5/2024', qty: 1, price: '₹345', status: 'delivered' },
    { id: '6656121f09', name: 'Urea', date: '26/5/2024', qty: 1, price: '₹115', status: 'delivered' },
    { id: '6656138c02f', name: 'Tomato Seeds', date: '26/5/2024', qty: 1, price: '₹85', status: 'delivered' },
    { id: '665614ea41f', name: 'Seeds Combo', date: '26/5/2024', qty: 1, price: '₹245', status: 'delivered' },
    { id: '6666ba41842', name: 'Tomato Seeds', date: '5/6/2024', qty: 2, price: '₹125', status: 'on the way' }
  ]);

  // Farms state
  const [farms, setFarms] = useState([
    { id: 'f1', name: 'Green Valley Field', location: 'Indore, MP', area: '5.0', estDate: '15-01-2024', crop: 'Wheat' }
  ]);
  const [farmNameInput, setFarmNameInput] = useState('');
  const [farmLocationInput, setFarmLocationInput] = useState('');
  const [farmAreaInput, setFarmAreaInput] = useState('');
  const [farmDateInput, setFarmDateInput] = useState('');
  const [farmCropInput, setFarmCropInput] = useState('Wheat');

  // Crops (Add Crop) state
  const [cropsList, setCropsList] = useState([
    { id: 'c1', name: 'Wheat', variety: 'Golden Hybrid A', qty: '400 kg', plantedDate: '2024-10-10', harvestDate: '2025-03-20' }
  ]);
  const [cropNameInput, setCropNameInput] = useState('');
  const [cropVarietyInput, setCropVarietyInput] = useState('');
  const [cropQtyInput, setCropQtyInput] = useState('');
  const [cropPlantedInput, setCropPlantedInput] = useState('');
  const [cropHarvestInput, setCropHarvestInput] = useState('');

  // Admin Registered Users Directory
  const [usersList] = useState([
    { id: '6651b1a06900a89ef0943f73', name: 'syed', email: 'syed4@gmail.com' },
    { id: '6651e069df25c44188b48de9e', name: 'eff', email: 'eff2@gmail.com' },
    { id: '6656b21aa1c9df25c44188b4', name: 'Vaishnavi', email: 'vaishnavisallu1710@gmail.com' }
  ]);

  // Admin Add Product Form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('veg');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Automatic Geolocation Weather lookup on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Defaults to Palam as in reference screenshot
        },
        () => {}
      );
    }
  }, []);

  const handleSearchWeather = async (e) => {
    e.preventDefault();
    if (!searchCity) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/weather?city=${searchCity}`);
      setWeatherData({
        city: `${res.data.city}, IN`,
        temp: res.data.temp,
        humidity: res.data.humidity,
        wind: res.data.windSpeed || '6.33 m/s',
        pressure: '1002 hPa',
        condition: res.data.condition || 'Clear Sky'
      });
    } catch {
      setWeatherData({
        city: `${searchCity}, IN`,
        temp: 34.6,
        humidity: 44,
        wind: '6.33 m/s',
        pressure: '1002 hPa',
        condition: 'Overcast Clouds'
      });
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = {
      role: loginRole,
      name: isSignUp ? signUpName : (loginEmail.split('@')[0] || (loginRole === 'Admin' ? 'Admin' : 'User')),
      email: loginEmail
    };
    setCurrentUser(user);
    if (loginRole === 'Admin') {
      setCurrentScreen('adminDashboard');
    } else {
      setCurrentScreen('userHome');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('landing');
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const newBooking = {
      id: '665' + Math.floor(100000000 + Math.random() * 900000000).toString(16),
      name: selectedProductToOrder?.name || 'Produce',
      date: new Date().toLocaleDateString('en-GB'),
      qty: orderQty,
      price: `₹${(selectedProductToOrder?.price || 120) * orderQty}`,
      status: 'confirmed'
    };
    setBookings([newBooking, ...bookings]);
    alert('Booking confirmed!');
    setCurrentScreen('myBookings');
  };

  const handleAddFarmSubmit = (e) => {
    e.preventDefault();
    const newFarm = {
      id: 'f_' + Date.now(),
      name: farmNameInput,
      location: farmLocationInput,
      area: farmAreaInput,
      estDate: farmDateInput || '15-01-2024',
      crop: farmCropInput
    };
    setFarms([...farms, newFarm]);
    setFarmNameInput('');
    setFarmLocationInput('');
    setFarmAreaInput('');
    setFarmDateInput('');
    alert('Farm Registered Successfully!');
    setCurrentScreen('farms');
  };

  const handleAddCropSubmit = (e) => {
    e.preventDefault();
    const newCrop = {
      id: 'c_' + Date.now(),
      name: cropNameInput,
      variety: cropVarietyInput,
      qty: cropQtyInput,
      plantedDate: cropPlantedInput,
      harvestDate: cropHarvestInput
    };
    setCropsList([...cropsList, newCrop]);
    setCropNameInput('');
    setCropVarietyInput('');
    setCropQtyInput('');
    alert('Crop Added Successfully!');
    setCurrentScreen('cropsList');
  };

  const handleAdminAddProductSubmit = (e) => {
    e.preventDefault();
    const newProd = {
      id: 'p_' + Date.now(),
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      description: newProdDesc,
      image: newProdImage || 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=600&q=80'
    };
    setProducts([...products, newProd]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setNewProdImage('');
    alert('Product added successfully!');
    setCurrentScreen('adminProducts');
  };

  // Chart data for Admin dashboard
  const adminChartData = {
    labels: ['Users', 'Farms', 'Products'],
    datasets: [
      {
        label: 'System Overview Value',
        data: [usersList.length, farms.length, products.length],
        backgroundColor: ['#9c27b0', '#f44336', '#009688'],
        barThickness: 65
      }
    ]
  };

  return (
    <div>
      {/* =========================================================================
          NAVBARS
          ========================================================================= */}
      {/* 1. PUBLIC LANDING NAVBAR */}
      {currentScreen === 'landing' && (
        <nav className="agri-nav d-flex justify-content-between align-items-center">
          <div className="text-white fw-bold fs-4">Agri-Tech</div>
          <div className="d-flex align-items-center">
            <span className="nav-link" onClick={() => { const el = document.getElementById('features'); el && el.scrollIntoView({ behavior: 'smooth' }); }}>Features</span>
            <span className="nav-link" onClick={() => { const el = document.getElementById('services'); el && el.scrollIntoView({ behavior: 'smooth' }); }}>Services</span>
            <span className="nav-link" onClick={() => { const el = document.getElementById('about'); el && el.scrollIntoView({ behavior: 'smooth' }); }}>Testimonials</span>
            <span className="nav-link">Contact</span>
            <button className="agri-btn-white ms-3" onClick={() => setCurrentScreen('loginChoice')}>
              Login
            </button>
          </div>
        </nav>
      )}

      {/* 2. USER (FARMER) NAVBAR */}
      {currentUser?.role === 'User' && currentScreen !== 'landing' && currentScreen !== 'loginChoice' && (
        <nav className="agri-nav d-flex justify-content-between align-items-center">
          <div className="text-white fw-bold fs-4" style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('userHome')}>
            Agri-Tech
          </div>
          <div className="d-flex align-items-center">
            <span className="nav-link" onClick={() => setCurrentScreen('userHome')}>Home</span>
            <span className="nav-link" onClick={() => setCurrentScreen('products')}>Products</span>
            <span className="nav-link" onClick={() => setCurrentScreen('farms')}>Farms</span>
            <span className="nav-link" onClick={() => setCurrentScreen('cropsList')}>Crops</span>
            <span className="nav-link" onClick={() => setCurrentScreen('myBookings')}>MyBookings</span>
            <span className="nav-link" onClick={handleLogout}>Logout</span>
          </div>
        </nav>
      )}

      {/* 3. ADMIN NAVBAR */}
      {currentUser?.role === 'Admin' && currentScreen !== 'landing' && currentScreen !== 'loginChoice' && (
        <nav className="agri-nav d-flex justify-content-between align-items-center">
          <div className="text-white fw-bold fs-4" style={{ cursor: 'pointer' }} onClick={() => setCurrentScreen('adminDashboard')}>
            Agri-Tech
          </div>
          <div className="d-flex align-items-center">
            <span className="nav-link" onClick={() => setCurrentScreen('adminDashboard')}>Dashboard</span>
            <span className="nav-link" onClick={() => setCurrentScreen('adminUsers')}>Users</span>
            <span className="nav-link" onClick={() => setCurrentScreen('adminProducts')}>Products</span>
            <span className="nav-link" onClick={() => setCurrentScreen('adminAddProduct')}>Add Product</span>
            <span className="nav-link" onClick={handleLogout}>Logout</span>
          </div>
        </nav>
      )}

      {/* =========================================================================
          SCREEN: PUBLIC LANDING PAGE
          ========================================================================= */}
      {currentScreen === 'landing' && (
        <div>
          {/* Hero Section */}
          <div className="hero-wrapper">
            <h1 className="display-4 fw-bold mb-3">Innovative Agriculture Solutions</h1>
            <p className="lead max-w-700 mb-4" style={{ maxWidth: '650px' }}>
              Empowering farmers with cutting-edge technology to enhance productivity and sustainability.
            </p>
            <button className="agri-btn-green fs-5" onClick={() => setCurrentScreen('loginChoice')}>
              Get Started
            </button>
          </div>

          {/* About Section */}
          <div className="section-mint text-center py-5" id="about">
            <span className="text-success fw-bold text-uppercase small">ABOUT US</span>
            <h2 className="fw-bold mt-1 mb-2">Welcome to Agro Tech</h2>
            <p className="text-muted mx-auto mb-5" style={{ maxWidth: '750px' }}>
              Agro Tech is dedicated to revolutionizing the agricultural industry through data-driven precision tools.
            </p>

            <div className="container">
              {/* 4 Cards: Mission, Vision, Values, Impact */}
              <div className="row g-4 mb-5 text-start">
                <div className="col-md-6">
                  <div className="white-box p-4 h-100">
                    <h5 className="fw-bold text-dark d-flex align-items-center gap-2">
                      <span className="badge bg-success rounded-3 p-2">🎯</span> Our Mission
                    </h5>
                    <p className="text-muted small mb-0">
                      Our mission is to enhance productivity and sustainability in agriculture through cutting-edge technology and data-driven solutions.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="white-box p-4 h-100">
                    <h5 className="fw-bold text-dark d-flex align-items-center gap-2">
                      <span className="badge bg-success rounded-3 p-2">👁️</span> Our Vision
                    </h5>
                    <p className="text-muted small mb-0">
                      Our vision is to be a global leader in providing innovative agricultural technologies that empower farmers and agribusinesses to thrive.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="white-box p-4 h-100">
                    <h5 className="fw-bold text-dark d-flex align-items-center gap-2">
                      <span className="badge bg-success rounded-3 p-2">💎</span> Our Values
                    </h5>
                    <p className="text-muted small mb-0">
                      We value innovation, sustainability, and collaboration. We are committed to creating solutions that benefit farmers, consumers, and the environment.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="white-box p-4 h-100">
                    <h5 className="fw-bold text-dark d-flex align-items-center gap-2">
                      <span className="badge bg-success rounded-3 p-2">📈</span> Our Impact
                    </h5>
                    <p className="text-muted small mb-0">
                      Our solutions have improved crop yields, reduced resource usage, and enhanced the livelihoods of countless farmers worldwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Stat Boxes: 10K+, 30%, 50%, 100+ */}
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="white-box p-4 text-center">
                    <h2 className="fw-bold text-success mb-1">10K+</h2>
                    <span className="text-muted small">Farmers Empowered</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="white-box p-4 text-center">
                    <h2 className="fw-bold text-success mb-1">30%</h2>
                    <span className="text-muted small">Yield Improvement</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="white-box p-4 text-center">
                    <h2 className="fw-bold text-success mb-1">50%</h2>
                    <span className="text-muted small">Water Savings</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="white-box p-4 text-center">
                    <h2 className="fw-bold text-success mb-1">100+</h2>
                    <span className="text-muted small">Innovations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Features Section */}
          <div className="section-dark-green text-center py-5" id="features">
            <h2 className="fw-bold mb-4">Our Features</h2>
            <div className="container">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="white-box p-4 text-dark text-center h-100">
                    <div className="fs-1 mb-2">🌱</div>
                    <h5 className="fw-bold mb-2">Crop Management</h5>
                    <p className="text-muted small mb-0">
                      Real-time monitoring of crop health to detect diseases and pests early.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="white-box p-4 text-dark text-center h-100">
                    <div className="fs-1 mb-2">🚜</div>
                    <h5 className="fw-bold mb-2">Farm Management</h5>
                    <p className="text-muted small mb-0">
                      Real-time Farm Management where users can access complete farm management.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="white-box p-4 text-dark text-center h-100">
                    <div className="fs-1 mb-2">💧</div>
                    <h5 className="fw-bold mb-2">Smart Irrigation</h5>
                    <p className="text-muted small mb-0">
                      Efficient water management systems that save water and improve crop yields.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Services Section */}
          <div className="section-mint text-center py-5" id="services">
            <h2 className="fw-bold mb-4 text-dark">Our Services</h2>
            <div className="container">
              <p className="text-muted mb-0">Providing comprehensive digital tools, store supplies, and agricultural advisories for farms of all sizes.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: LOGIN / SIGN UP MODAL VIEW
          ========================================================================= */}
      {currentScreen === 'loginChoice' && (
        <div className="field-form-bg">
          <div className="form-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-success mb-0">{loginRole} {isSignUp ? 'Sign Up' : 'Login'}</h4>
              <button className="btn-close" onClick={() => setCurrentScreen('landing')}></button>
            </div>

            {/* Toggle Role */}
            <div className="btn-group w-100 mb-3" role="group">
              <button
                type="button"
                className={`btn btn-sm ${loginRole === 'User' ? 'btn-success fw-bold' : 'btn-outline-success'}`}
                onClick={() => setLoginRole('User')}
              >
                User Login
              </button>
              <button
                type="button"
                className={`btn btn-sm ${loginRole === 'Admin' ? 'btn-success fw-bold' : 'btn-outline-success'}`}
                onClick={() => setLoginRole('Admin')}
              >
                Admin Login
              </button>
            </div>

            <form onSubmit={handleLoginSubmit}>
              {isSignUp && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <input className="form-control" placeholder="e.g. Ramesh Patel" value={signUpName} onChange={e => setSignUpName(e.target.value)} required />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="agri-btn-green w-100 py-2 mb-3">
                {isSignUp ? 'Sign Up' : `Login as ${loginRole}`}
              </button>

              {loginRole === 'User' && (
                <div className="text-center small">
                  {isSignUp ? (
                    <span>Already have an account? <button type="button" className="btn btn-link btn-sm p-0 text-success fw-bold" onClick={() => setIsSignUp(false)}>Login</button></span>
                  ) : (
                    <span>Don't have an account? <button type="button" className="btn btn-link btn-sm p-0 text-success fw-bold" onClick={() => setIsSignUp(true)}>Sign Up</button></span>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: USER HOME PAGE (Weather + Agricultural Information Grid)
          ========================================================================= */}
      {currentScreen === 'userHome' && (
        <div className="section-mint min-vh-100">
          <div className="container py-4">
            {/* Weather Forecast Section */}
            <div className="text-center mb-4">
              <h2 className="fw-bold text-success mb-1">Weather Forecast</h2>
              <span className="text-muted small">Current Location: {weatherData.city}</span>

              {/* Search Bar */}
              <form onSubmit={handleSearchWeather} className="d-flex justify-content-center gap-2 mt-3 mx-auto" style={{ maxWidth: '420px' }}>
                <input
                  className="form-control"
                  placeholder="Pālam"
                  value={searchCity}
                  onChange={e => setSearchCity(e.target.value)}
                />
                <button type="submit" className="btn btn-success px-4 fw-semibold">
                  Search
                </button>
              </form>
            </div>

            {/* Weather Card */}
            <div className="white-box p-4 mx-auto mb-5 shadow-sm" style={{ maxWidth: '650px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0 text-dark">{weatherData.city}</h4>
                <span className="badge bg-light text-secondary border px-3 py-2 fs-6">
                  ☁️ {weatherData.condition}
                </span>
              </div>
              <div className="row g-3 text-center">
                <div className="col-6 col-md-3">
                  <span className="text-muted small d-block">Temperature</span>
                  <strong className="fs-5">{weatherData.temp}°C</strong>
                </div>
                <div className="col-6 col-md-3">
                  <span className="text-muted small d-block">Humidity</span>
                  <strong className="fs-5">{weatherData.humidity}%</strong>
                </div>
                <div className="col-6 col-md-3">
                  <span className="text-muted small d-block">Wind Speed</span>
                  <strong className="fs-5">{weatherData.wind}</strong>
                </div>
                <div className="col-6 col-md-3">
                  <span className="text-muted small d-block">Pressure</span>
                  <strong className="fs-5">{weatherData.pressure}</strong>
                </div>
              </div>
            </div>

            {/* Agricultural Information Grid */}
            <div className="text-center mb-4">
              <h2 className="fw-bold text-success">Agricultural Information</h2>
            </div>
            <div className="row g-4">
              {Object.keys(cropDatabase).map((key) => (
                <div className="col-md-4" key={key}>
                  <div className="white-box overflow-hidden h-100 shadow-sm text-center">
                    <img src={cropDatabase[key].image} alt={key} className="crop-card-img" />
                    <div className="p-3">
                      <h4 className="fw-bold text-dark mb-2">{key}</h4>
                      <button
                        className="btn btn-link text-success p-0 fw-semibold text-decoration-none"
                        onClick={() => {
                          setSelectedCropKey(key);
                          setCurrentScreen('cropDetail');
                        }}
                      >
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

      {/* =========================================================================
          SCREEN: CROP INFORMATION (DETAILS, PESTICIDES, FERTILIZERS)
          ========================================================================= */}
      {currentScreen === 'cropDetail' && (
        <div className="section-mint min-vh-100 py-4">
          <div className="container" style={{ maxWidth: '850px' }}>
            <button className="btn btn-outline-success btn-sm mb-3 rounded-pill" onClick={() => setCurrentScreen('userHome')}>
              &larr; Back to Agricultural Information
            </button>

            {/* Crop Header Banner */}
            <div
              className="rounded-4 mb-4 d-flex align-items-end p-4 shadow-sm"
              style={{
                height: '240px',
                background: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.65)), url('${cropDatabase[selectedCropKey].image}') center/cover no-repeat`,
                color: '#ffffff'
              }}
            >
              <h1 className="fw-bold display-5 mb-0">{selectedCropKey}</h1>
            </div>

            {/* Crop Details Card */}
            <div className="white-box p-4 mb-4 shadow-sm">
              <h5 className="fw-bold text-dark mb-4">Crop Details</h5>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-2">
                    <span className="fs-5">🌱</span>
                    <div>
                      <span className="text-muted small d-block">Scientific Name</span>
                      <strong>{cropDatabase[selectedCropKey].scientific}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-2">
                    <span className="fs-5">📅</span>
                    <div>
                      <span className="text-muted small d-block">Growth Period</span>
                      <strong>{cropDatabase[selectedCropKey].growth}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-2">
                    <span className="fs-5">🍂</span>
                    <div>
                      <span className="text-muted small d-block">Season</span>
                      <strong>{cropDatabase[selectedCropKey].season}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-2">
                    <span className="fs-5">🌾</span>
                    <div>
                      <span className="text-muted small d-block">Sowing Time</span>
                      <strong>{cropDatabase[selectedCropKey].sowing}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-2">
                    <span className="fs-5">☁️</span>
                    <div>
                      <span className="text-muted small d-block">Climate</span>
                      <strong>{cropDatabase[selectedCropKey].climate}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-2">
                    <span className="fs-5">⏰</span>
                    <div>
                      <span className="text-muted small d-block">Harvest Time</span>
                      <strong>{cropDatabase[selectedCropKey].harvest}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex align-items-start gap-2">
                    <span className="fs-5">🌍</span>
                    <div>
                      <span className="text-muted small d-block">Soil Type</span>
                      <strong>{cropDatabase[selectedCropKey].soil}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Recommendation Pills */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="white-box p-3 h-100 shadow-sm">
                  <h6 className="fw-bold text-danger mb-2">🗑️ Recommended Pesticides</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {cropDatabase[selectedCropKey].pesticides.map((pest, i) => (
                      <span key={i} className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">
                        {pest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="white-box p-3 h-100 shadow-sm">
                  <h6 className="fw-bold text-primary mb-2">💧 Recommended Fertilizers</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {cropDatabase[selectedCropKey].fertilizers.map((fert, i) => (
                      <span key={i} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
                        {fert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: PRODUCTS LIST
          ========================================================================= */}
      {currentScreen === 'products' && (
        <div className="field-form-bg flex-column align-items-stretch justify-content-start">
          <div className="container py-4">
            <h2 className="text-white fw-bold text-center mb-4">Products List</h2>
            <div className="row g-4">
              {products.map((p) => (
                <div className="col-md-4" key={p.id}>
                  <div className="white-box overflow-hidden shadow">
                    <img src={p.image} alt={p.name} style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                    <div className="p-4">
                      <h4 className="fw-bold text-dark text-center mb-3">{p.name}</h4>
                      <p className="small text-muted mb-1"><strong>Category:</strong> {p.category}</p>
                      <p className="small text-muted mb-1"><strong>Price:</strong> {p.price}</p>
                      <p className="small text-muted mb-3"><strong>Description:</strong> {p.description}</p>
                      <button
                        className="btn btn-success w-100 fw-bold"
                        onClick={() => {
                          setSelectedProductToOrder(p);
                          setCurrentScreen('orderProduct');
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: ORDER PRODUCT (Your Booking is almost Done!)
          ========================================================================= */}
      {currentScreen === 'orderProduct' && (
        <div className="field-form-bg">
          <div className="form-card text-center">
            <h4 className="fw-bold text-dark mb-1">Your Booking is almost Done!</h4>
            <span className="text-muted small d-block mb-3">Details</span>

            <form onSubmit={handleOrderSubmit} className="text-start">
              <div className="mb-2">
                <input
                  className="form-control"
                  placeholder="Name"
                  value={orderName}
                  onChange={e => setOrderName(e.target.value)}
                  required
                />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={orderEmail}
                    onChange={e => setOrderEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Phone Number"
                    value={orderPhone}
                    onChange={e => setOrderPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 bg-light rounded-3 mb-3 small">
                <div className="d-flex justify-content-between mb-1">
                  <span>Quantity:</span>
                  <div className="d-flex align-items-center gap-1">
                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => setOrderQty(Math.max(1, orderQty - 1))}>-</button>
                    <span>{orderQty}</span>
                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => setOrderQty(orderQty + 1)}>+</button>
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Price:</span>
                  <span>₹ {(selectedProductToOrder?.price || 120) * orderQty}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Convenience Fee:</span>
                  <span>₹ 45</span>
                </div>
                <hr className="my-1" />
                <div className="d-flex justify-content-between fw-bold text-dark">
                  <span>Total Amount:</span>
                  <span>₹ {((selectedProductToOrder?.price || 120) * orderQty) + 45}</span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setCurrentScreen('products')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-50 fw-bold">
                  Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: FARMS LIST & ADD FARM BUTTON
          ========================================================================= */}
      {currentScreen === 'farms' && (
        <div className="field-form-bg flex-column align-items-stretch justify-content-start">
          <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-white fw-bold mb-0">Registered Farms</h2>
              <button className="btn btn-success fw-bold px-4" onClick={() => setCurrentScreen('addFarm')}>
                + Register New Farm
              </button>
            </div>

            <div className="row g-4">
              {farms.map((f) => (
                <div className="col-md-6" key={f.id}>
                  <div className="white-box p-4 shadow">
                    <h4 className="fw-bold text-success mb-2">{f.name}</h4>
                    <p className="mb-1 text-muted"><strong>Location:</strong> {f.location}</p>
                    <p className="mb-1 text-muted"><strong>Area Size:</strong> {f.area} Acres</p>
                    <p className="mb-1 text-muted"><strong>Established Date:</strong> {f.estDate}</p>
                    <p className="mb-0 text-muted"><strong>Primary Crop:</strong> <span className="badge bg-secondary">{f.crop}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: REGISTER NEW FARM FORM
          ========================================================================= */}
      {currentScreen === 'addFarm' && (
        <div className="field-form-bg">
          <div className="form-card">
            <h4 className="fw-bold text-dark text-center mb-1">Register New Farm</h4>
            <span className="text-muted small text-center d-block mb-3">Provide details about your agricultural land</span>

            <form onSubmit={handleAddFarmSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Farm Name*</label>
                <input
                  className="form-control"
                  placeholder="e.g. Green Valley Field"
                  value={farmNameInput}
                  onChange={e => setFarmNameInput(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Location*</label>
                <input
                  className="form-control"
                  placeholder="e.g. Country, State"
                  value={farmLocationInput}
                  onChange={e => setFarmLocationInput(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Area Size (acres)*</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    placeholder="e.g. 5.0"
                    value={farmAreaInput}
                    onChange={e => setFarmAreaInput(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Established Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={farmDateInput}
                    onChange={e => setFarmDateInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Primary Crop Type*</label>
                <select
                  className="form-select"
                  value={farmCropInput}
                  onChange={e => setFarmCropInput(e.target.value)}
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Maize">Maize</option>
                  <option value="Soybean">Soybean</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setCurrentScreen('farms')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success w-50 fw-bold">
                  Register Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: CROPS LIST & ADD CROP
          ========================================================================= */}
      {currentScreen === 'cropsList' && (
        <div className="field-form-bg flex-column align-items-stretch justify-content-start">
          <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-white fw-bold mb-0">Managed Crops</h2>
              <button className="btn btn-success fw-bold px-4" onClick={() => setCurrentScreen('addCrop')}>
                + Add Crop
              </button>
            </div>

            <div className="row g-4">
              {cropsList.map((c) => (
                <div className="col-md-6" key={c.id}>
                  <div className="white-box p-4 shadow">
                    <h4 className="fw-bold text-success mb-2">{c.name}</h4>
                    <p className="mb-1 text-muted"><strong>Variety:</strong> {c.variety}</p>
                    <p className="mb-1 text-muted"><strong>Quantity:</strong> {c.qty}</p>
                    <p className="mb-1 text-muted"><strong>Planted Date:</strong> {c.plantedDate}</p>
                    <p className="mb-0 text-muted"><strong>Harvest Date:</strong> {c.harvestDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: ADD NEW CROP FORM
          ========================================================================= */}
      {currentScreen === 'addCrop' && (
        <div className="field-form-bg">
          <div className="form-card">
            <h4 className="fw-bold text-dark text-center mb-1">Add New Crop</h4>
            <span className="text-muted small text-center d-block mb-3">Fill in the details of your new crop planting</span>

            <form onSubmit={handleAddCropSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Crop Name</label>
                <input
                  className="form-control"
                  placeholder="e.g. Wheat, Rice, Corn"
                  value={cropNameInput}
                  onChange={e => setCropNameInput(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Variety</label>
                <input
                  className="form-control"
                  placeholder="e.g. Golden Hybrid A"
                  value={cropVarietyInput}
                  onChange={e => setCropVarietyInput(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Quantity (tons/kg)</label>
                <input
                  className="form-control"
                  placeholder="Enter quantity"
                  value={cropQtyInput}
                  onChange={e => setCropQtyInput(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Planted Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={cropPlantedInput}
                    onChange={e => setCropPlantedInput(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Harvest Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={cropHarvestInput}
                    onChange={e => setCropHarvestInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setCurrentScreen('cropsList')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success w-50 fw-bold">
                  Add Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: MY ORDERS / MY BOOKINGS
          ========================================================================= */}
      {currentScreen === 'myBookings' && (
        <div className="section-mint min-vh-100 py-4">
          <div className="container" style={{ maxWidth: '950px' }}>
            <h2 className="fw-bold text-dark text-center mb-4">My Bookings</h2>

            <div className="white-box p-4 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>BookingId</th>
                      <th>Product Name</th>
                      <th>BookingDate</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="small text-muted">{b.id}</td>
                        <td className="fw-semibold text-dark">{b.name}</td>
                        <td className="small text-muted">{b.date}</td>
                        <td>{b.qty}</td>
                        <td className="fw-bold">{b.price}</td>
                        <td>
                          <span className={`badge rounded-pill ${b.status === 'delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: ADMIN DASHBOARD (3 Stat cards, Chart, Recent Users/Products)
          ========================================================================= */}
      {currentScreen === 'adminDashboard' && (
        <div className="section-mint min-vh-100 py-4">
          <div className="container" style={{ maxWidth: '950px' }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-dark mb-1">Admin Dashboard</h2>
              <span className="text-muted small">Overview of your agricultural management system</span>
            </div>

            {/* 3 Metric Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="white-box p-3 d-flex justify-content-between align-items-center shadow-sm">
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge rounded-3 p-3 bg-primary bg-opacity-10 text-primary fs-4">👥</span>
                    <span className="small text-muted fw-bold">Total Users</span>
                  </div>
                  <h3 className="fw-bold mb-0">{usersList.length}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="white-box p-3 d-flex justify-content-between align-items-center shadow-sm">
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge rounded-3 p-3 bg-danger bg-opacity-10 text-danger fs-4">🚜</span>
                    <span className="small text-muted fw-bold">Total Farms</span>
                  </div>
                  <h3 className="fw-bold mb-0">{farms.length}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="white-box p-3 d-flex justify-content-between align-items-center shadow-sm">
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge rounded-3 p-3 bg-success bg-opacity-10 text-success fs-4">📦</span>
                    <span className="small text-muted fw-bold">Total Products</span>
                  </div>
                  <h3 className="fw-bold mb-0">{products.length}</h3>
                </div>
              </div>
            </div>

            {/* System Overview Bar Chart */}
            <div className="white-box p-4 mb-4 shadow-sm">
              <h5 className="fw-bold text-dark mb-3">System Overview</h5>
              <div style={{ height: '240px' }}>
                <Bar data={adminChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Recent Users & Recent Products */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="white-box p-3 shadow-sm h-100">
                  <h6 className="fw-bold text-dark mb-2">Recent Users</h6>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-secondary rounded-circle p-2">👤</span>
                    <div>
                      <strong className="d-block small">{usersList[usersList.length - 1].name}</strong>
                      <span className="text-muted small">{usersList[usersList.length - 1].email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="white-box p-3 shadow-sm h-100">
                  <h6 className="fw-bold text-dark mb-2">Recent Products</h6>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-success rounded-circle p-2">📦</span>
                    <div>
                      <strong className="d-block small">{products[products.length - 1].name}</strong>
                      <span className="text-muted small">{products[products.length - 1].category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: ADMIN USERS DIRECTORY
          ========================================================================= */}
      {currentScreen === 'adminUsers' && (
        <div className="section-mint min-vh-100 py-4">
          <div className="container" style={{ maxWidth: '850px' }}>
            <h2 className="fw-bold text-dark text-center mb-4">Users</h2>
            <div className="white-box p-4 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>S.NO</th>
                      <th>USER ID</th>
                      <th>USER NAME</th>
                      <th>EMAIL</th>
                      <th>OPERATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u, i) => (
                      <tr key={u.id}>
                        <td>{i + 1}</td>
                        <td className="small text-muted">{u.id}</td>
                        <td className="fw-semibold">{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary py-0 px-2" title="Edit">
                              <FaEdit size={12} /> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-info py-0 px-2" title="View">
                              <FaEye size={12} /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: ADMIN PRODUCTS DIRECTORY
          ========================================================================= */}
      {currentScreen === 'adminProducts' && (
        <div className="field-form-bg flex-column align-items-stretch justify-content-start">
          <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-white fw-bold mb-0">Products List</h2>
              <button className="btn btn-success fw-bold px-4" onClick={() => setCurrentScreen('adminAddProduct')}>
                + Add Product
              </button>
            </div>

            <div className="row g-4">
              {products.map((p) => (
                <div className="col-md-4" key={p.id}>
                  <div className="white-box overflow-hidden shadow">
                    <img src={p.image} alt={p.name} style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                    <div className="p-4">
                      <h4 className="fw-bold text-dark text-center mb-3">{p.name}</h4>
                      <p className="small text-muted mb-1"><strong>Category:</strong> {p.category}</p>
                      <p className="small text-muted mb-1"><strong>Price:</strong> {p.price}</p>
                      <p className="small text-muted mb-3"><strong>Description:</strong> {p.description}</p>
                      <button className="btn btn-success w-100 fw-bold" onClick={() => setCurrentScreen('adminProducts')}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN: ADMIN ADD PRODUCT
          ========================================================================= */}
      {currentScreen === 'adminAddProduct' && (
        <div className="field-form-bg">
          <div className="form-card">
            <h4 className="fw-bold text-dark text-center mb-1">Add New Product</h4>
            <span className="text-muted small text-center d-block mb-3">Fill in the details of your new agricultural product</span>

            <form onSubmit={handleAdminAddProductSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Product Name*</label>
                <input
                  className="form-control"
                  placeholder="e.g. Organic Wheat Flour"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Category*</label>
                  <select
                    className="form-select"
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                  >
                    <option value="veg">veg</option>
                    <option value="fruit">fruit</option>
                    <option value="grain">grain</option>
                    <option value="seed">seed</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Price (₹)*</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 100.00"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Description*</label>
                <textarea
                  rows="2"
                  className="form-control"
                  placeholder="Describe the product features and benefits"
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Image URL*</label>
                <input
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  value={newProdImage}
                  onChange={e => setNewProdImage(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setCurrentScreen('adminProducts')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success w-50 fw-bold">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;