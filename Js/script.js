// ===== CONFIGURATION =====
const CONFIG = {
    // API endpoints for backend communication
    API_ENDPOINTS: {
        login: 'php/login.php',
        register: 'php/register.php',
        purchase: 'php/purchase.php',
    },
    
    // Paths to 3D model files for different Porsche models
    MODEL_PATHS: {
        "911": "models/911.glb",
        "taycan": "models/taycan.glb", 
        "cayenne": "models/cayenne.glb",
        "panamera": "models/panamera.glb"
    },
    
    // Demo user credentials for testing
    DEMO_USER: {
        email: "demo@porsche.com",
        password: "demo123"
    }
};

// ===== GLOBAL STATE =====
let appState = {
    // User authentication and profile data
    user: null,
    
    // Current vehicle configuration
    config: {
        model: "911",
        color: "#0a0a0a",
        wheels: "classic",
        wheelColor: "silver",
        material: "glossy",
        finish: "gloss",
        price: 205000
    },
    
    // Three.js rendering and scene management
    threejs: {
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        loader: null,
        model: null,
        lights: [],
        isRotating: true,
        isLoading: false
    },
    
    // Audio system state
    audio: {
        engineIdle: null,
        engineRev: null,
        uiHover: null,
        uiClick: null,
        volume: 0.7,
        isPlaying: false
    },
    
    // UI and application state
    ui: {
        theme: "dark",
        loadingProgress: 0,
        stats: {
            fps: 60,
            polygons: 0,
            triangles: 0
        }
    }
};

// ===== DOM ELEMENTS =====
const DOM = {
    // Navigation elements
    hamburger: document.getElementById('hamburger'),
    navLinks: document.querySelector('.nav-links'),
    themeToggle: document.getElementById('themeToggle'),
    
    // Modal dialogs
    loginModal: document.getElementById('loginModal'),
    purchaseModal: document.getElementById('purchaseModal'),
    profileModal: document.getElementById('profileModal'),
    
    // Form elements
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    checkoutForm: document.getElementById('checkoutForm'),
    
    // Action buttons
    loginBtn: document.getElementById('loginBtn'),
    closeModal: document.querySelector('.close-modal'),
    closePurchaseModal: document.querySelector('.close-purchase-modal'),
    closeProfileModal: document.querySelector('.close-profile-modal'),
    purchaseBtn: document.getElementById('purchaseBtn'),
    
    // Customization control elements
    colorPresets: document.querySelectorAll('.color-preset'),
    colorPicker: document.getElementById('customColor'),
    hueSlider: document.getElementById('hueSlider'),
    saturationSlider: document.getElementById('saturationSlider'),
    brightnessSlider: document.getElementById('brightnessSlider'),
    finishButtons: document.querySelectorAll('.finish-btn'),
    wheelPresets: document.querySelectorAll('.wheel-preset'),
    wheelColorOptions: document.querySelectorAll('.color-option'),
    wheelSizeSlider: document.getElementById('wheelSize'),
    modelCards: document.querySelectorAll('.model-card'),
    
    // 3D viewer control elements
    rotateBtn: document.getElementById('rotateBtn'),
    resetViewBtn: document.getElementById('resetViewBtn'),
    engineSoundBtn: document.getElementById('engineSoundBtn'),
    engineRevBtn: document.getElementById('engineRevBtn'),
    volumeSlider: document.getElementById('volumeSlider'),
    volumeValue: document.querySelector('.volume-value'),
    viewPresets: document.querySelectorAll('.preset-btn'),
    
    // Display elements for current configuration
    selectedColor: document.getElementById('selectedColor'),
    selectedWheels: document.getElementById('selectedWheels'),
    selectedMaterial: document.getElementById('selectedMaterial'),
    selectedModel: document.getElementById('selectedModel'),
    totalPrice: document.getElementById('totalPrice'),
    polyCount: document.getElementById('polyCount'),
    fpsCounter: document.getElementById('fpsCounter'),
    
    // Audio elements
    engineIdleSound: document.getElementById('engineIdleSound'),
    engineRevSound: document.getElementById('engineRevSound'),
    uiHoverSound: document.getElementById('uiHoverSound'),
    uiClickSound: document.getElementById('uiClickSound')
};
