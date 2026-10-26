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
  FaBug,
  FaCloudSun,
  FaLanguage,
  FaTractor,
  FaShoppingCart,
  FaComments,
  FaUserShield,
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';
import { WiDaySunny, WiHumidity, WiStrongWind } from 'react-icons/wi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BACKEND_URL = 'http://localhost:5000/api';

const translations = {
  en: {
    title: 'AgriTech Smart Farming',
    heroTag: 'AI-Powered Agronomy, Real-time Field Weather & Regional Market',
    weatherTab: 'Weather',
    soilTab: 'Soil & Crops',
    pestTab: 'Pest Alerts',
    farmsTab: 'My Farms',
    storeTab: 'Agri-Store',
    forumTab: 'Expert Forum',
    adminBadge: 'Admin Account',
    farmerBadge: 'Farmer Account',
    loginRegister: 'Login / Register',
    signOut: 'Sign Out',
    adminConsoleTitle: 'Administrator System Control Center',
    adminConsoleDesc: 'Full administrative privileges active. Manage regional platform metrics, verify store inventory, and review farmer health index.',
    systemHealthy: 'System Status: Optimal',
    totalFarms: 'TOTAL REGISTERED FARMS',
    activePlots: 'Active Plots',
    totalAcreage: 'TOTAL MONITORED ACREAGE',
    acresUnderSurv: 'Acres under surveillance',
    storeRevenue: 'RESOURCE STORE REVENUE',
    completedOrders: 'Completed Orders',
    pestThreats: 'REGIONAL PEST THREATS',
    criticalAlertsActive: 'Critical Alerts Active',
    systemCropHealth: 'System-wide Crop Health & Performance Indices',
    liveTelemetry: 'Live Agronomic Telemetry',
    registeredAccounts: 'Registered Farmer Accounts & Land Holdings',
    thFarmPlot: 'Farm Plot',
    thFarmer: 'Registered Farmer',
    thArea: 'Area',
    thCrop: 'Crop Type',
    thHealth: 'Crop Health Index',
    thAction: 'Admin Action',
    terminateRecord: 'Terminate Record',
    registerNewFarm: 'Register New Farm Plot',
    farmPlotName: 'Farm / Plot Name',
    farmPlotPlaceholder: 'e.g. Malwa South Field',
    areaAcres: 'Area (in Acres)',
    areaPlaceholder: 'e.g. 5.0',
    currentCrop: 'Current Crop',
    addFarmBtn: 'Add Farm Profile',
    myCropHealth: 'My Crop Health & Yield Analytics',
    activeFarmProfiles: 'Active Farm Profiles',
    size: 'Size',
    acres: 'Acres',
    crop: 'Crop',
    healthIndex: 'Health Index',
    optimal: 'Optimal',
    regionalWeather: 'Regional Weather Forecast',
    agronomistView: 'Agronomist Advisory View',
    enterCityPlaceholder: 'Enter city name...',
    updateWeather: 'Update Weather',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    advisory: 'Advisory',
    soilParamInput: 'Soil Parameter Input',
    advisoryDiagnosticTool: 'Advisory Diagnostic Tool',
    soilType: 'Soil Type',
    soilBlack: 'Black Soil (काली मिट्टी)',
    soilAlluvial: 'Alluvial Soil (जलोढ़ मिट्टी)',
    soilRed: 'Red Soil (लाल मिट्टी)',
    soilClay: 'Clay / Loam (दोमट मिट्टी)',
    soilPh: 'Soil pH',
    runDiagnostics: 'Run Soil Diagnostics',
    diagnosticRecs: 'Diagnostic Recommendations',
    recCrops: 'Recommended Crops',
    phStatus: 'pH Status',
    fertStrategy: 'Fertilizer Strategy',
    irrigation: 'Irrigation',
    adjustSoilPrompt: 'Adjust soil parameters and click analyze.',
    broadcastPestAlert: 'Broadcast Regional Pest Alert (Admin Advisory Tool)',
    targetCrop: 'Target Crop',
    cropPlaceholder: 'e.g. Cotton, Mustard, Wheat',
    pestIdentifier: 'Pest / Disease Identifier',
    pestPlaceholder: 'e.g. Whitefly / Stem Rot',
    threatSeverity: 'Threat Severity Level',
    severityHigh: 'High (Immediate Action)',
    severityMedium: 'Medium (Active Monitoring)',
    severityLow: 'Low (Advisory)',
    visualSymptoms: 'Visual Symptoms on Field',
    symptomsPlaceholder: 'Describe yellowing, curled leaves, boreholes...',
    prescribedTreatment: 'Prescribed Biological / Chemical Treatment',
    treatmentPlaceholder: 'Chemical name, dosage, or bio-spray instructions',
    issueAlertBtn: 'Issue Alert to All Farmers',
    activeRegionalThreats: 'Active Regional Threats & Infestations',
    activeWarnings: 'Active Warnings',
    severityLabel: 'Severity',
    symptomsLabel: 'Symptoms',
    remedyLabel: 'Remedy',
    addNewInventory: 'Add New Inventory Item to Store',
    productTitle: 'Product Title & Quantity',
    productPlaceholder: 'e.g. Bio-Potash Granules (25kg)',
    category: 'Category',
    unitPrice: 'Unit Price (₹)',
    stockQty: 'Stock Quantity',
    stockPlaceholder: 'Units in warehouse',
    publishBtn: 'Approve & Publish to Store',
    liveInventory: 'Live Resource Inventory',
    statusApproved: 'Status: Approved',
    availableStock: 'Available Warehouse Stock',
    units: 'units',
    allOrdersTitle: 'All Customer Orders & Transactions',
    thOrderId: 'Order ID',
    thPurchasingFarmer: 'Purchasing Farmer',
    thItemDesc: 'Item Description',
    thQty: 'Qty',
    thTotalPaid: 'Total Paid',
    thStatus: 'Status',
    approvedSuppliesTitle: 'Approved Agricultural Seeds & Fertilizers',
    purchaseResource: 'Purchase Resource',
    inStock: 'In Stock',
    myPurchaseHistory: 'My Resource Purchase History',
    askExpertTitle: 'Ask an Agricultural Expert',
    askPlaceholder: 'Ask a crop disease, soil, or farming question...',
    submitQuestion: 'Submit Question',
    communityDiscussions: 'Community Discussions & Solutions',
    askedBy: 'Asked by',
    expertAnswer: 'Expert Answer',
    writeReplyPlaceholder: 'Write expert advisory reply...',
    postReply: 'Post Reply',
    awaitingReply: 'Awaiting Agronomist Reply',
    authModalRegTitle: 'Register AgriTech Account',
    authModalLoginTitle: 'Sign In to AgriTech',
    fullName: 'Full Name',
    namePlaceholder: 'e.g. Ramesh Patel',
    emailAddress: 'Email Address',
    password: 'Password',
    accountRole: 'Account Role',
    roleFarmerDesc: 'Farmer (किसान - Crop management, Store, Advisory)',
    roleAdminDesc: 'System Administrator / Agronomist',
    btnCreateAccount: 'Create Account & Get JWT',
    btnSignIn: 'Authenticate & Sign In',
    alreadyHaveAccount: 'Already have an account?',
    signInHere: 'Sign In here',
    newUser: 'New user?',
    registerHere: 'Register New Account'
  },
  hi: {
    title: 'एग्रीटेक स्मार्ट कृषि मंच',
    heroTag: 'आधुनिक कृषि तकनीक, सटीक मौसम पूर्वानुमान एवं किसान बाजार',
    weatherTab: 'मौसम',
    soilTab: 'मृदा एवं फसल',
    pestTab: 'कीट चेतावनी',
    farmsTab: 'मेरे खेत',
    storeTab: 'कृषि स्टोर',
    forumTab: 'विशेषज्ञ मंच',
    adminBadge: 'व्यवस्थापक खाता',
    farmerBadge: 'किसान खाता',
    loginRegister: 'लॉग इन / पंजीकरण',
    signOut: 'लॉग आउट',
    adminConsoleTitle: 'प्रशासक प्रणाली नियंत्रण केंद्र (Admin Console)',
    adminConsoleDesc: 'पूर्ण प्रशासनिक अधिकार सक्रिय हैं। क्षेत्रीय मेट्रिक्स, स्टोर स्टॉक और किसान स्वास्थ्य सूचकांक प्रबंधित करें।',
    systemHealthy: 'सिस्टम स्थिति: उत्तम (Optimal)',
    totalFarms: 'कुल पंजीकृत खेत',
    activePlots: 'सक्रिय भूखंड',
    totalAcreage: 'कुल निगरानी क्षेत्र (एकड़)',
    acresUnderSurv: 'निगरानी में कुल एकड़',
    storeRevenue: 'कृषि स्टोर कुल बिक्री',
    completedOrders: 'पूर्ण ऑर्डर',
    pestThreats: 'सक्रिय क्षेत्रीय कीट प्रकोप',
    criticalAlertsActive: 'गंभीर चेतावनियां सक्रिय',
    systemCropHealth: 'सिस्टम-स्तरीय फसल स्वास्थ्य एवं प्रदर्शन सूचकांक',
    liveTelemetry: 'लाइव कृषि टेलीमेट्री',
    registeredAccounts: 'पंजीकृत किसान खाते एवं भूमि विवरण',
    thFarmPlot: 'खेत का नाम',
    thFarmer: 'पंजीकृत किसान',
    thArea: 'क्षेत्रफल',
    thCrop: 'फसल का प्रकार',
    thHealth: 'स्वास्थ्य सूचकांक',
    thAction: 'व्यवस्थापक कार्रवाई',
    terminateRecord: 'रिकॉर्ड हटाएं',
    registerNewFarm: 'नया खेत पंजीकृत करें',
    farmPlotName: 'खेत / भूखंड का नाम',
    farmPlotPlaceholder: 'उदा. मालवा दक्षिणी खेत',
    areaAcres: 'क्षेत्रफल (एकड़ में)',
    areaPlaceholder: 'उदा. 5.0',
    currentCrop: 'वर्तमान फसल',
    addFarmBtn: 'खेत प्रोफ़ाइल जोड़ें',
    myCropHealth: 'मेरी फसल स्वास्थ्य एवं उत्पादन विश्लेषण',
    activeFarmProfiles: 'सक्रिय खेत प्रोफाइल',
    size: 'आकार',
    acres: 'एकड़',
    crop: 'फसल',
    healthIndex: 'स्वास्थ्य सूचकांक',
    optimal: 'उत्तम',
    regionalWeather: 'क्षेत्रीय मौसम पूर्वानुमान',
    agronomistView: 'कृषि वैज्ञानिक सलाहकार दृश्य',
    enterCityPlaceholder: 'शहर / जिले का नाम दर्ज करें...',
    updateWeather: 'मौसम अपडेट करें',
    humidity: 'आर्द्रता (Humidity)',
    windSpeed: 'हवा की गति',
    advisory: 'कृषि सलाह',
    soilParamInput: 'मृदा स्वास्थ्य पैरामीटर इनपुट',
    advisoryDiagnosticTool: 'सलाहकार नैदानिक उपकरण',
    soilType: 'मिट्टी का प्रकार',
    soilBlack: 'काली मिट्टी (Black Soil)',
    soilAlluvial: 'जलोढ़ मिट्टी (Alluvial Soil)',
    soilRed: 'लाल मिट्टी (Red Soil)',
    soilClay: 'दोमट मिट्टी (Clay / Loam)',
    soilPh: 'मिट्टी का pH मान',
    runDiagnostics: 'मिट्टी का विश्लेषण करें',
    diagnosticRecs: 'विश्लेषण एवं अनुशंसाएं',
    recCrops: 'अनुशंसित उच्च उपज वाली फसलें',
    phStatus: 'pH स्थिति',
    fertStrategy: 'उर्वरक एवं पोषण योजना',
    irrigation: 'सिंचाई रणनीति',
    adjustSoilPrompt: 'मिट्टी का प्रकार और pH चुनें, फिर विश्लेषण पर क्लिक करें।',
    broadcastPestAlert: 'क्षेत्रीय कीट चेतावनी जारी करें (व्यवस्थापक उपकरण)',
    targetCrop: 'लक्षित फसल',
    cropPlaceholder: 'उदा. कपास, सरसों, गेहूं',
    pestIdentifier: 'कीट / रोग का नाम',
    pestPlaceholder: 'उदा. सफेद मक्खी / तना छेदक',
    threatSeverity: 'प्रकोप गंभीरता स्तर',
    severityHigh: 'उच्च (तत्काल नियंत्रण)',
    severityMedium: 'मध्यम (निगरानी आवश्यक)',
    severityLow: 'कम (सामान्य सलाह)',
    visualSymptoms: 'खेत में दिखने वाले लक्षण',
    symptomsPlaceholder: 'पत्तियों का पीला पड़ना, मुरझाना, तने में छेद...',
    prescribedTreatment: 'अनुशंसित जैविक / रासायनिक उपचार',
    treatmentPlaceholder: 'कीटनाशक का नाम, मात्रा, छिड़काव विधि...',
    issueAlertBtn: 'सभी किसानों को चेतावनी भेजें',
    activeRegionalThreats: 'सक्रिय क्षेत्रीय कीट एवं रोग प्रकोप',
    activeWarnings: 'सक्रिय चेतावनियां',
    severityLabel: 'गंभीरता',
    symptomsLabel: 'लक्षण',
    remedyLabel: 'उपचार',
    addNewInventory: 'स्टोर में नई कृषि सामग्री जोड़ें',
    productTitle: 'उत्पाद का नाम एवं मात्रा',
    productPlaceholder: 'उदा. बायो-पोटाश दानेदार (25 किग्रा)',
    category: 'श्रेणी',
    unitPrice: 'मूल्य (₹)',
    stockQty: 'स्टॉक मात्रा',
    stockPlaceholder: 'गोदाम में उपलब्ध इकाइयां',
    publishBtn: 'स्वीकृत कर स्टोर में प्रकाशित करें',
    liveInventory: 'उपलब्ध कृषि इनपुट सूची',
    statusApproved: 'स्थिति: स्वीकृत',
    availableStock: 'गोदाम में उपलब्ध स्टॉक',
    units: 'इकाइयां',
    allOrdersTitle: 'सभी किसान ऑर्डर एवं लेनदेन',
    thOrderId: 'ऑर्डर संख्या',
    thPurchasingFarmer: 'खरीदार किसान',
    thItemDesc: 'उत्पाद का विवरण',
    thQty: 'मात्रा',
    thTotalPaid: 'कुल भुगतान',
    thStatus: 'स्थिति',
    approvedSuppliesTitle: 'प्रमाणित कृषि बीज एवं उर्वरक',
    purchaseResource: 'सामग्री खरीदें',
    inStock: 'उपलब्ध स्टॉक',
    myPurchaseHistory: 'मेरी खरीद का इतिहास',
    askExpertTitle: 'कृषि विशेषज्ञ से प्रश्न पूछें',
    askPlaceholder: 'फसल रोग, खाद या खेती से संबंधित प्रश्न पूछें...',
    submitQuestion: 'प्रश्न जमा करें',
    communityDiscussions: 'किसान समुदाय चर्चा एवं विशेषज्ञ उत्तर',
    askedBy: 'पूछा गया द्वारा',
    expertAnswer: 'विशेषज्ञ समाधान',
    writeReplyPlaceholder: 'सलाहकार उत्तर लिखें...',
    postReply: 'उत्तर प्रकाशित करें',
    awaitingReply: 'कृषि वैज्ञानिक के उत्तर की प्रतीक्षा में',
    authModalRegTitle: 'एग्रीटेक नया खाता बनाएं',
    authModalLoginTitle: 'एग्रीटेक खाते में प्रवेश करें',
    fullName: 'पूरा नाम',
    namePlaceholder: 'उदा. रमेश पटेल',
    emailAddress: 'ईमेल पता',
    password: 'पासवर्ड',
    accountRole: 'खाता भूमिका (Role)',
    roleFarmerDesc: 'किसान (Farmer - खेत प्रबंधन, स्टोर, सलाह)',
    roleAdminDesc: 'सिस्टम प्रशासक / कृषि वैज्ञानिक (Admin)',
    btnCreateAccount: 'खाता बनाएं एवं JWT प्राप्त करें',
    btnSignIn: 'प्रवेश करें (Sign In)',
    alreadyHaveAccount: 'पहले से खाता है?',
    signInHere: 'यहाँ प्रवेश करें',
    newUser: 'नया खाता बनाना है?',
    registerHere: 'यहाँ पंजीकरण करें'
  }
};

const cropImages = {
  Soybean: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
  Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  Cotton: 'https://images.unsplash.com/photo-1594488554954-46c535496417?auto=format&fit=crop&w=600&q=80',
  Gram: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
};

const resourceImages = [
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
];

function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('farms');

  // Carousel Slides (Transitions every 4.5 seconds)
  const heroSlides = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1600&q=80'
  ];
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('agri_user');
    return saved ? JSON.parse(saved) : { name: 'Ramesh Patel', email: 'farmer@agritech.com', role: 'Farmer' };
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('Farmer');
  const [authError, setAuthError] = useState('');

  // Weather state
  const [city, setCity] = useState('Indore');
  const [weather, setWeather] = useState(null);

  // Soil state
  const [soilType, setSoilType] = useState('black');
  const [phLevel, setPhLevel] = useState(6.8);
  const [soilResult, setSoilResult] = useState(null);

  // Farms state
  const [farms, setFarms] = useState([]);
  const [farmName, setFarmName] = useState('');
  const [areaAcres, setAreaAcres] = useState('');
  const [currentCrop, setCurrentCrop] = useState('Soybean');

  // Pest state
  const [pests, setPests] = useState([]);

  // Store & Orders state
  const [resources, setResources] = useState([]);
  const [orders, setOrders] = useState([]);

  // Forum state
  const [forumPosts, setForumPosts] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [expertReply, setExpertReply] = useState({});

  // Admin addition forms state
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceCategory, setNewResourceCategory] = useState('Seeds');
  const [newResourcePrice, setNewResourcePrice] = useState('');
  const [newResourceStock, setNewResourceStock] = useState('');

  const [newPestCrop, setNewPestCrop] = useState('');
  const [newPestName, setNewPestName] = useState('');
  const [newPestSymptoms, setNewPestSymptoms] = useState('');
  const [newPestRemedy, setNewPestRemedy] = useState('');
  const [newPestSeverity, setNewPestSeverity] = useState('High');

  const t = translations[lang];
  const role = currentUser?.role || 'Farmer';

  useEffect(() => {
    fetchWeather('Indore');
    fetchFarms();
    fetchPests();
    fetchResources();
    fetchOrders();
    fetchForum();
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const payload = isRegistering
      ? { name: authName, email: authEmail, password: authPassword, role: authRole }
      : { email: authEmail, password: authPassword, role: authRole };

    try {
      const res = await axios.post(`${BACKEND_URL}${endpoint}`, payload);
      localStorage.setItem('agri_jwt', res.data.token);
      localStorage.setItem('agri_user', JSON.stringify(res.data.user));
      setCurrentUser(res.data.user);
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agri_jwt');
    localStorage.removeItem('agri_user');
    setCurrentUser(null);
    setShowAuthModal(true);
  };

  const fetchWeather = async (target) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/weather?city=${target}`);
      setWeather(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFarms = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/farms`);
      setFarms(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPests = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/pests`);
      setPests(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/resources`);
      setResources(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/orders`);
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchForum = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/forum`);
      setForumPosts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    if (!farmName || !areaAcres) return;
    try {
      await axios.post(`${BACKEND_URL}/farms`, {
        farmerEmail: currentUser?.email || 'farmer@agritech.com',
        farmName,
        areaAcres,
        currentCrop
      });
      setFarmName('');
      setAreaAcres('');
      fetchFarms();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFarm = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/farms/${id}`);
      fetchFarms();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSoilAnalyze = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/soil/recommend`, { soilType, phLevel });
      setSoilResult(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuyResource = async (item) => {
    try {
      await axios.post(`${BACKEND_URL}/orders`, {
        farmerEmail: currentUser?.email || 'farmer@agritech.com',
        itemName: item.name,
        quantity: 1,
        totalAmount: item.price
      });
      fetchOrders();
      alert(lang === 'hi' ? `सफलता: ${item.name} ऑर्डर कर दिया गया!` : `Success: Ordered ${item.name}!`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newResourceName || !newResourcePrice) return;
    try {
      await axios.post(`${BACKEND_URL}/resources`, {
        name: newResourceName,
        category: newResourceCategory,
        price: Number(newResourcePrice),
        stock: Number(newResourceStock) || 10
      });
      setNewResourceName('');
      setNewResourcePrice('');
      setNewResourceStock('');
      fetchResources();
      alert(lang === 'hi' ? 'कृषि स्टोर में नई सामग्री सफलतापूर्वक जोड़ी गई!' : 'Resource published to Agri-Store!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePestAlert = (e) => {
    e.preventDefault();
    if (!newPestCrop || !newPestName) return;
    const alertObj = {
      id: Date.now(),
      crop: newPestCrop,
      pest: newPestName,
      severity: newPestSeverity,
      symptoms: newPestSymptoms,
      remedy: newPestRemedy
    };
    setPests([alertObj, ...pests]);
    setNewPestCrop('');
    setNewPestName('');
    setNewPestSymptoms('');
    setNewPestRemedy('');
    alert(lang === 'hi' ? 'क्षेत्रीय कीट चेतावनी जारी कर दी गई है!' : 'Regional pest advisory broadcasted successfully!');
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion) return;
    try {
      await axios.post(`${BACKEND_URL}/forum/question`, {
        author: currentUser?.name || 'Farmer',
        question: newQuestion
      });
      setNewQuestion('');
      fetchForum();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReplyQuestion = async (id) => {
    if (!expertReply[id]) return;
    try {
      await axios.post(`${BACKEND_URL}/forum/reply`, {
        id,
        reply: expertReply[id],
        expert: `${currentUser?.name || 'Dr. Sharma'} (Admin)`
      });
      setExpertReply({ ...expertReply, [id]: '' });
      fetchForum();
    } catch (e) {
      console.error(e);
    }
  };

  const chartData = {
    labels: farms.map(f => f.farmName),
    datasets: [
      {
        label: lang === 'hi' ? 'फसल स्वास्थ्य सूचकांक (%)' : 'Crop Health Score Index (%)',
        data: farms.map(f => f.healthScore || 85),
        backgroundColor: 'rgba(46, 125, 50, 0.75)',
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="min-vh-100">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-agri px-4 py-3 shadow">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold d-flex align-items-center gap-2 fs-4">
            <FaSeedling className="text-warning fs-3" /> {t.title}
          </span>
          <div className="d-flex align-items-center gap-3">
            {currentUser ? (
              <div className="d-flex align-items-center gap-2 bg-white bg-opacity-25 px-3 py-1 rounded-pill text-white border border-light border-opacity-50 shadow-sm">
                <FaUserCircle className="fs-5" />
                <span className="small fw-semibold">{currentUser.name}</span>
                <span className={`badge rounded-pill ${currentUser.role === 'Admin' ? 'bg-warning text-dark' : 'bg-light text-success'}`}>
                  {currentUser.role === 'Admin' ? t.adminBadge : t.farmerBadge}
                </span>
                <button className="btn btn-sm text-white ms-1 p-0" onClick={handleLogout} title={t.signOut}>
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <button className="btn btn-light btn-sm fw-bold rounded-pill px-3 shadow-sm d-flex align-items-center gap-1" onClick={() => setShowAuthModal(true)}>
                <FaSignInAlt /> {t.loginRegister}
              </button>
            )}

            <button
              className="btn btn-outline-light btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            >
              <FaLanguage /> {lang === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header with True Smooth Crossfade */}
      <div className="hero-banner mb-4 text-center shadow-sm">
        {/* Layered Crossfade Backgrounds */}
        {heroSlides.map((url, idx) => (
          <div
            key={idx}
            className={`hero-slide-layer ${slideIndex === idx ? 'active' : ''}`}
            style={{ backgroundImage: `url('${url}')` }}
          />
        ))}

        {/* Ambient Dark Green Gradient Overlay */}
        <div className="hero-overlay-dark"></div>

        {/* Foreground Content */}
        <div className="hero-content py-5 px-4">
          <div className="container py-2">
            <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill mb-2 shadow-sm">
              🌾 {lang === 'hi' ? 'भारतीय किसान तकनीकी सहायता मंच' : 'Smart Agriculture 4.0 Ecosystem'}
            </span>
            <h1 className="fw-bold display-6 mb-2">{t.title}</h1>
            <p className="lead mb-3 text-white-50">{t.heroTag}</p>

            {/* Slide Navigation Indicator Dots */}
            <div className="d-flex justify-content-center gap-2 mt-2">
              {heroSlides.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  style={{
                    width: slideIndex === idx ? '26px' : '8px',
                    height: '8px',
                    borderRadius: '10px',
                    backgroundColor: slideIndex === idx ? '#ffc107' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.5s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container pb-5">
        {/* Navigation Tabs */}
        <ul className="nav nav-pills nav-fill nav-pills-agri bg-white p-2 rounded-4 shadow-sm border mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'farms' ? 'active' : ''}`} onClick={() => setActiveTab('farms')}>
              <FaTractor className="me-1" /> {t.farmsTab}
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'weather' ? 'active' : ''}`} onClick={() => setActiveTab('weather')}>
              <FaCloudSun className="me-1" /> {t.weatherTab}
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'soil' ? 'active' : ''}`} onClick={() => setActiveTab('soil')}>
              <FaSeedling className="me-1" /> {t.soilTab}
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'pest' ? 'active' : ''}`} onClick={() => setActiveTab('pest')}>
              <FaBug className="me-1" /> {t.pestTab}
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'store' ? 'active' : ''}`} onClick={() => setActiveTab('store')}>
              <FaShoppingCart className="me-1" /> {t.storeTab}
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'forum' ? 'active' : ''}`} onClick={() => setActiveTab('forum')}>
              <FaComments className="me-1" /> {t.forumTab}
            </button>
          </li>
        </ul>

        {/* 1. FARMS TAB */}
        {activeTab === 'farms' && (
          <div>
            {role === 'Admin' ? (
              <div className="mb-4">
                <div className="alert alert-warning border-warning d-flex align-items-center justify-content-between p-4 mb-4 rounded-4 shadow-sm">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                      <FaUserShield className="text-warning fs-4" /> {t.adminConsoleTitle}
                    </h5>
                    <p className="small mb-0 text-muted">{t.adminConsoleDesc}</p>
                  </div>
                  <span className="badge bg-dark px-3 py-2 rounded-pill fs-6">{t.systemHealthy}</span>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="card agri-card shadow-sm p-3 bg-white text-center">
                      <span className="text-muted small fw-bold">{t.totalFarms}</span>
                      <h2 className="fw-bold text-success mt-2">{farms.length}</h2>
                      <span className="badge bg-light text-secondary border">{t.activePlots}</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card agri-card shadow-sm p-3 bg-white text-center">
                      <span className="text-muted small fw-bold">{t.totalAcreage}</span>
                      <h2 className="fw-bold text-primary mt-2">
                        {farms.reduce((acc, f) => acc + (Number(f.areaAcres) || 0), 0).toFixed(1)}
                      </h2>
                      <span className="badge bg-light text-secondary border">{t.acresUnderSurv}</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card agri-card shadow-sm p-3 bg-white text-center">
                      <span className="text-muted small fw-bold">{t.storeRevenue}</span>
                      <h2 className="fw-bold text-warning mt-2">
                        ₹{orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0)}
                      </h2>
                      <span className="badge bg-light text-secondary border">{orders.length} {t.completedOrders}</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card agri-card shadow-sm p-3 bg-white text-center">
                      <span className="text-muted small fw-bold">{t.pestThreats}</span>
                      <h2 className="fw-bold text-danger mt-2">{pests.length}</h2>
                      <span className="badge bg-danger">{t.criticalAlertsActive}</span>
                    </div>
                  </div>
                </div>

                <div className="card agri-card shadow-sm p-4 mb-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">{t.systemCropHealth}</h5>
                    <span className="badge bg-success rounded-pill px-3 py-2">{t.liveTelemetry}</span>
                  </div>
                  <div style={{ height: '260px' }}>
                    <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                <div className="card agri-card shadow-sm p-4 bg-white">
                  <h5 className="fw-bold text-dark mb-3">{t.registeredAccounts}</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>{t.thFarmPlot}</th>
                          <th>{t.thFarmer}</th>
                          <th>{t.thArea}</th>
                          <th>{t.thCrop}</th>
                          <th>{t.thHealth}</th>
                          <th>{t.thAction}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farms.map((f, i) => (
                          <tr key={f.id || f._id || i}>
                            <td className="fw-bold text-success">{f.farmName}</td>
                            <td>{f.farmerEmail || 'farmer@agritech.com'}</td>
                            <td>{f.areaAcres} {t.acres}</td>
                            <td><span className="badge bg-secondary rounded-pill">{f.currentCrop}</span></td>
                            <td>
                              <span className={`badge rounded-pill ${f.healthScore > 80 ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {f.healthScore}% {t.optimal}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDeleteFarm(f.id || f._id)}>
                                <FaTrash className="me-1" /> {t.terminateRecord}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="row g-4 mb-4">
                  <div className="col-lg-4">
                    <div className="card agri-card shadow-sm p-4 bg-white h-100">
                      <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                        <FaPlus className="text-success" /> {t.registerNewFarm}
                      </h5>
                      <form onSubmit={handleCreateFarm}>
                        <div className="mb-2">
                          <label className="form-label small fw-semibold">{t.farmPlotName}</label>
                          <input className="form-control rounded-3" placeholder={t.farmPlotPlaceholder} value={farmName} onChange={e => setFarmName(e.target.value)} required />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-semibold">{t.areaAcres}</label>
                          <input type="number" step="0.1" className="form-control rounded-3" placeholder={t.areaPlaceholder} value={areaAcres} onChange={e => setAreaAcres(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-semibold">{t.currentCrop}</label>
                          <select className="form-select rounded-3" value={currentCrop} onChange={e => setCurrentCrop(e.target.value)}>
                            <option value="Soybean">Soybean (सोयाबीन)</option>
                            <option value="Wheat">Wheat (गेहूं)</option>
                            <option value="Cotton">Cotton (कपास)</option>
                            <option value="Gram">Gram / Chana (चना)</option>
                          </select>
                        </div>
                        <button type="submit" className="btn btn-success w-100 fw-bold rounded-pill py-2 shadow-sm">
                          {t.addFarmBtn}
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="card agri-card shadow-sm p-4 bg-white h-100">
                      <h5 className="fw-bold text-success mb-2">{t.myCropHealth}</h5>
                      <div style={{ height: '240px' }}>
                        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </div>
                  </div>
                </div>

                <h5 className="fw-bold text-dark mb-3">{t.activeFarmProfiles} ({farms.length})</h5>
                <div className="row g-3">
                  {farms.map((f, i) => (
                    <div className="col-md-4" key={f.id || f._id || i}>
                      <div className="card agri-card shadow-sm bg-white h-100">
                        <img
                          src={cropImages[f.currentCrop] || cropImages.Wheat}
                          alt={f.currentCrop}
                          className="card-img-header"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="p-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold mb-0 text-success fs-5">{f.farmName}</h6>
                            <button className="btn btn-sm btn-outline-danger rounded-circle p-1" onClick={() => handleDeleteFarm(f.id || f._id)}>
                              <FaTrash size={12} />
                            </button>
                          </div>
                          <p className="mb-1 text-muted small"><strong>{t.size}:</strong> {f.areaAcres} {t.acres}</p>
                          <p className="mb-1 text-muted small"><strong>{t.crop}:</strong> {f.currentCrop}</p>
                          <p className="mb-0 text-muted small"><strong>{t.healthIndex}:</strong> <span className="badge bg-success rounded-pill">{f.healthScore}%</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. WEATHER TAB */}
        {activeTab === 'weather' && (
          <div className="card agri-card shadow-sm p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-success mb-0 d-flex align-items-center gap-2">
                <FaCloudSun /> {t.regionalWeather}
              </h4>
              {role === 'Admin' && <span className="badge bg-warning text-dark rounded-pill px-3 py-2">{t.agronomistView}</span>}
            </div>
            <div className="row g-2 mb-4">
              <div className="col-md-9">
                <input className="form-control form-control-lg rounded-pill px-4" value={city} onChange={e => setCity(e.target.value)} placeholder={t.enterCityPlaceholder} />
              </div>
              <div className="col-md-3">
                <button className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm" onClick={() => fetchWeather(city)}>{t.updateWeather}</button>
              </div>
            </div>
            {weather && (
              <div className="row g-3">
                <div className="col-md-4 text-center p-4 bg-light rounded-4 border">
                  <WiDaySunny className="display-3 text-warning" />
                  <h5 className="text-secondary mt-1">{weather.city}</h5>
                  <h1 className="fw-bold display-5 text-dark">{weather.temp}°C</h1>
                  <span className="badge bg-success rounded-pill px-3 py-1 fs-6">{weather.condition}</span>
                </div>
                <div className="col-md-4 text-center p-4 bg-light rounded-4 border">
                  <WiHumidity className="display-3 text-info" />
                  <h5 className="text-secondary mt-1">{t.humidity}</h5>
                  <h1 className="fw-bold display-5 text-dark">{weather.humidity}%</h1>
                  <span className="badge bg-info text-dark rounded-pill px-3 py-1 fs-6">Relative Index</span>
                </div>
                <div className="col-md-4 text-center p-4 bg-light rounded-4 border">
                  <WiStrongWind className="display-3 text-secondary" />
                  <h5 className="text-secondary mt-1">{t.windSpeed}</h5>
                  <h1 className="fw-bold display-5 text-dark">{weather.windSpeed}</h1>
                  <span className="badge bg-secondary rounded-pill px-3 py-1 fs-6">Velocity</span>
                </div>
                <div className="col-12 mt-3">
                  <div className="alert alert-success d-flex align-items-center gap-3 p-3 rounded-4 mb-0 shadow-sm border-success">
                    <FaCheckCircle className="fs-3 text-success flex-shrink-0" />
                    <div>
                      <strong className="fs-6">{t.advisory}: </strong> {weather.advisory}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. SOIL ADVISORY TAB */}
        {activeTab === 'soil' && (
          <div className="row g-4">
            <div className="col-md-5">
              <div className="card agri-card shadow-sm p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-success mb-0 d-flex align-items-center gap-2">
                    <FaSeedling /> {t.soilParamInput}
                  </h5>
                  {role === 'Admin' && <span className="badge bg-warning text-dark rounded-pill">{t.advisoryDiagnosticTool}</span>}
                </div>
                <form onSubmit={handleSoilAnalyze}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">{t.soilType}</label>
                    <select className="form-select rounded-3 py-2" value={soilType} onChange={e => setSoilType(e.target.value)}>
                      <option value="black">{t.soilBlack}</option>
                      <option value="alluvial">{t.soilAlluvial}</option>
                      <option value="red">{t.soilRed}</option>
                      <option value="clay">{t.soilClay}</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      {t.soilPh}: <span className="badge bg-secondary ms-2">{phLevel}</span>
                    </label>
                    <input type="range" className="form-range" min="4.5" max="9.0" step="0.1" value={phLevel} onChange={e => setPhLevel(e.target.value)} />
                    <div className="d-flex justify-content-between text-muted small">
                      <span>4.5 (Acidic)</span>
                      <span>7.0 (Neutral)</span>
                      <span>9.0 (Alkaline)</span>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success w-100 rounded-pill py-2 fw-bold shadow-sm">
                    {t.runDiagnostics}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-md-7">
              {soilResult ? (
                <div className="card agri-card shadow-sm p-4 bg-white">
                  <h5 className="fw-bold text-success mb-3">{t.diagnosticRecs}</h5>
                  <div className="mb-3">
                    <h6 className="fw-bold text-dark">{t.recCrops}:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {soilResult.crops.map((c, i) => (
                        <span key={i} className="badge bg-success rounded-pill px-3 py-2 fs-6">
                          🌾 {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="p-2 bg-light rounded-3 border"><strong>{t.phStatus}:</strong> {soilResult.phStatus}</p>
                  <p className="p-2 bg-light rounded-3 border"><strong>{t.fertStrategy}:</strong> {soilResult.fertilizer}</p>
                  <p className="p-2 bg-light rounded-3 border mb-0"><strong>{t.irrigation}:</strong> {soilResult.waterAdvice}</p>
                </div>
              ) : (
                <div className="card agri-card shadow-sm p-5 text-center text-muted bg-white h-100 d-flex align-items-center justify-content-center">
                  <FaSeedling className="display-4 text-success opacity-50 mb-3" />
                  <p className="mb-0">{t.adjustSoilPrompt}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. PEST ALERTS TAB */}
        {activeTab === 'pest' && (
          <div>
            {role === 'Admin' && (
              <div className="card agri-card shadow-sm p-4 mb-4 bg-white border-start border-4 border-danger">
                <h5 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                  <FaBug /> {t.broadcastPestAlert}
                </h5>
                <form onSubmit={handleCreatePestAlert}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">{t.targetCrop}</label>
                      <input className="form-control rounded-3" placeholder={t.cropPlaceholder} value={newPestCrop} onChange={e => setNewPestCrop(e.target.value)} required />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label small fw-semibold">{t.pestIdentifier}</label>
                      <input className="form-control rounded-3" placeholder={t.pestPlaceholder} value={newPestName} onChange={e => setNewPestName(e.target.value)} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">{t.threatSeverity}</label>
                      <select className="form-select rounded-3" value={newPestSeverity} onChange={e => setNewPestSeverity(e.target.value)}>
                        <option value="High">{t.severityHigh}</option>
                        <option value="Medium">{t.severityMedium}</option>
                        <option value="Low">{t.severityLow}</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">{t.visualSymptoms}</label>
                      <input className="form-control rounded-3" placeholder={t.symptomsPlaceholder} value={newPestSymptoms} onChange={e => setNewPestSymptoms(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">{t.prescribedTreatment}</label>
                      <input className="form-control rounded-3" placeholder={t.treatmentPlaceholder} value={newPestRemedy} onChange={e => setNewPestRemedy(e.target.value)} required />
                    </div>
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-danger fw-bold rounded-pill px-4">
                        {t.issueAlertBtn}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <span className="pulse-badge"></span> {t.activeRegionalThreats}
              </h5>
              <span className="badge bg-danger rounded-pill px-3 py-2 fs-6">{pests.length} {t.activeWarnings}</span>
            </div>

            <div className="row g-3">
              {pests.map(p => (
                <div className="col-md-6" key={p.id}>
                  <div className="card agri-card shadow-sm p-4 bg-white h-100">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0 text-dark">🌾 {p.crop}</h5>
                      <span className={`badge rounded-pill ${p.severity === 'High' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {p.severity} {t.severityLabel}
                      </span>
                    </div>
                    <h6 className="text-danger fw-bold">{p.pest}</h6>
                    <p className="small text-muted mb-2"><strong>{t.symptomsLabel}:</strong> {p.symptoms}</p>
                    <div className="p-3 bg-light border rounded-3 small"><strong>{t.remedyLabel}:</strong> {p.remedy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AGRI-STORE & ORDERS */}
        {activeTab === 'store' && (
          <div>
            {role === 'Admin' ? (
              <div className="mb-4">
                <div className="card agri-card shadow-sm p-4 mb-4 bg-white border-start border-4 border-warning">
                  <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FaShoppingCart className="text-warning" /> {t.addNewInventory}
                  </h5>
                  <form onSubmit={handleAddResource}>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">{t.productTitle}</label>
                        <input className="form-control rounded-3" placeholder={t.productPlaceholder} value={newResourceName} onChange={e => setNewResourceName(e.target.value)} required />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">{t.category}</label>
                        <select className="form-select rounded-3" value={newResourceCategory} onChange={e => setNewResourceCategory(e.target.value)}>
                          <option value="Seeds">Seeds</option>
                          <option value="Fertilizers">Fertilizers</option>
                          <option value="Pesticides">Pesticides</option>
                          <option value="Bio-Inputs">Bio-Inputs</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <label className="form-label small fw-semibold">{t.unitPrice}</label>
                        <input type="number" className="form-control rounded-3" placeholder="₹" value={newResourcePrice} onChange={e => setNewResourcePrice(e.target.value)} required />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">{t.stockQty}</label>
                        <input type="number" className="form-control rounded-3" placeholder={t.stockPlaceholder} value={newResourceStock} onChange={e => setNewResourceStock(e.target.value)} required />
                      </div>
                      <div className="col-12 text-end">
                        <button type="submit" className="btn btn-warning text-dark fw-bold rounded-pill px-4">
                          {t.publishBtn}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <h5 className="fw-bold text-dark mb-3">{t.liveInventory} ({resources.length})</h5>
                <div className="row g-3 mb-4">
                  {resources.map((r, idx) => (
                    <div className="col-md-4" key={r.id}>
                      <div className="card agri-card shadow-sm bg-white h-100">
                        <img src={resourceImages[idx % resourceImages.length]} alt={r.name} className="card-img-header" />
                        <div className="p-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="badge bg-secondary rounded-pill">{r.category}</span>
                            <span className="badge bg-success rounded-pill">{t.statusApproved}</span>
                          </div>
                          <h6 className="fw-bold text-dark">{r.name}</h6>
                          <h4 className="text-success fw-bold">₹{r.price}</h4>
                          <p className="small text-muted mb-0">{t.availableStock}: <strong>{r.stock} {t.units}</strong></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h5 className="fw-bold text-dark mb-3">{t.allOrdersTitle}</h5>
                <div className="card agri-card shadow-sm p-4 bg-white">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>{t.thOrderId}</th>
                          <th>{t.thPurchasingFarmer}</th>
                          <th>{t.thItemDesc}</th>
                          <th>{t.thQty}</th>
                          <th>{t.thTotalPaid}</th>
                          <th>{t.thStatus}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id}>
                            <td className="fw-bold">{o.id}</td>
                            <td>{o.farmerEmail}</td>
                            <td>{o.itemName}</td>
                            <td>{o.quantity}</td>
                            <td className="text-success fw-bold">₹{o.totalAmount}</td>
                            <td><span className="badge bg-success rounded-pill px-3 py-1">{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h5 className="fw-bold text-success mb-3">{t.approvedSuppliesTitle}</h5>
                <div className="row g-3 mb-4">
                  {resources.map((r, idx) => (
                    <div className="col-md-4" key={r.id}>
                      <div className="card agri-card shadow-sm bg-white h-100">
                        <img src={resourceImages[idx % resourceImages.length]} alt={r.name} className="card-img-header" />
                        <div className="p-3 d-flex flex-column h-100">
                          <span className="badge bg-secondary rounded-pill mb-2 align-self-start">{r.category}</span>
                          <h6 className="fw-bold text-dark">{r.name}</h6>
                          <h4 className="text-success fw-bold">₹{r.price}</h4>
                          <p className="small text-muted">{t.inStock}: {r.stock} {t.units}</p>
                          <button className="btn btn-outline-success rounded-pill fw-bold mt-auto" onClick={() => handleBuyResource(r)}>
                            {t.purchaseResource}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h5 className="fw-bold text-dark mb-3">{t.myPurchaseHistory}</h5>
                <div className="card agri-card shadow-sm p-4 bg-white">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>{t.thOrderId}</th>
                          <th>{t.thItemDesc}</th>
                          <th>{t.thQty}</th>
                          <th>{t.thTotalPaid}</th>
                          <th>{t.thStatus}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id}>
                            <td className="fw-bold">{o.id}</td>
                            <td>{o.itemName}</td>
                            <td>{o.quantity}</td>
                            <td className="text-success fw-bold">₹{o.totalAmount}</td>
                            <td><span className="badge bg-success rounded-pill px-3 py-1">{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. EXPERT FORUM TAB */}
        {activeTab === 'forum' && (
          <div>
            <div className="card agri-card shadow-sm p-4 mb-4 bg-white">
              <h5 className="fw-bold text-success mb-2 d-flex align-items-center gap-2">
                <FaComments /> {t.askExpertTitle}
              </h5>
              <form onSubmit={handleAskQuestion}>
                <div className="input-group">
                  <input className="form-control rounded-start-pill px-4" placeholder={t.askPlaceholder} value={newQuestion} onChange={e => setNewQuestion(e.target.value)} required />
                  <button type="submit" className="btn btn-success fw-bold rounded-end-pill px-4 shadow-sm">
                    {t.submitQuestion}
                  </button>
                </div>
              </form>
            </div>

            <h5 className="fw-bold text-dark mb-3">{t.communityDiscussions}</h5>
            <div className="d-flex flex-column gap-3">
              {forumPosts.map(post => (
                <div className="card agri-card shadow-sm p-4 bg-white" key={post.id}>
                  <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>{t.askedBy}: <strong>{post.author}</strong></span>
                  </div>
                  <h6 className="fw-bold text-dark mb-2 fs-5">{post.question}</h6>

                  {post.reply ? (
                    <div className="bg-light p-3 rounded-4 border border-success">
                      <div className="small text-success fw-bold mb-1">🌱 {t.expertAnswer} ({post.expert}):</div>
                      <p className="mb-0 text-secondary">{post.reply}</p>
                    </div>
                  ) : (
                    role === 'Admin' ? (
                      <div className="mt-2 input-group">
                        <input className="form-control form-control-sm rounded-start-pill" placeholder={t.writeReplyPlaceholder} value={expertReply[post.id] || ''} onChange={e => setExpertReply({ ...expertReply, [post.id]: e.target.value })} />
                        <button className="btn btn-sm btn-success rounded-end-pill px-3 fw-semibold" onClick={() => handleReplyQuestion(post.id)}>
                          {t.postReply}
                        </button>
                      </div>
                    ) : (
                      <span className="badge bg-secondary rounded-pill align-self-start px-3 py-1">{t.awaitingReply}</span>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- AUTHENTICATION MODAL (LOGIN & REGISTRATION) --- */}
      {showAuthModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="modal-header navbar-agri text-white py-3">
                <h5 className="modal-title fw-bold">
                  {isRegistering ? t.authModalRegTitle : t.authModalLoginTitle}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAuthModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                {authError && <div className="alert alert-danger py-2 small rounded-3">{authError}</div>}
                <form onSubmit={handleAuthSubmit}>
                  {isRegistering && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">{t.fullName}</label>
                      <input className="form-control rounded-3" placeholder={t.namePlaceholder} value={authName} onChange={e => setAuthName(e.target.value)} required />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">{t.emailAddress}</label>
                    <input type="email" className="form-control rounded-3" placeholder="name@agritech.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">{t.password}</label>
                    <input type="password" className="form-control rounded-3" placeholder="••••••••" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold">{t.accountRole}</label>
                    <select className="form-select rounded-3" value={authRole} onChange={e => setAuthRole(e.target.value)}>
                      <option value="Farmer">{t.roleFarmerDesc}</option>
                      <option value="Admin">{t.roleAdminDesc}</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-success w-100 fw-bold rounded-pill py-2 shadow-sm mb-3">
                    {isRegistering ? t.btnCreateAccount : t.btnSignIn}
                  </button>

                  <div className="text-center small">
                    {isRegistering ? (
                      <span>{t.alreadyHaveAccount} <button type="button" className="btn btn-link btn-sm p-0 text-success fw-bold" onClick={() => { setIsRegistering(false); setAuthError(''); }}>{t.signInHere}</button></span>
                    ) : (
                      <span>{t.newUser} <button type="button" className="btn btn-link btn-sm p-0 text-success fw-bold" onClick={() => { setIsRegistering(true); setAuthError(''); }}>{t.registerHere}</button></span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;