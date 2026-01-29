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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Porsche Exclusive - Initializing...');

    try { initEventListeners(); } 
    catch (e) { console.error('❌ Event listeners failed', e); }

    try { initThreeJS(); } 
    catch (e) { console.error('❌ Three.js failed', e); }

    try { initAudio(); } 
    catch (e) { console.warn('🔇 Audio disabled', e); }

    try { loadUser(); } 
    catch (e) { console.warn('👤 User load failed', e); }

    try { initTheme(); } 
    catch (e) { console.warn('🎨 Theme failed', e); }

    setTimeout(() => {
        try { startIntroAnimation(); } 
        catch (e) { console.warn('🎬 Intro animation failed', e); }
    }, 100);

    console.log('✅ Porsche Exclusive - Initialization completed');
});

// Start GSAP animations for hero section elements
function startIntroAnimation() {
    // Animate hero title characters sequentially
    gsap.from('.hero-title span', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out'
    });
    
    // Animate subtitle with delay
    gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
    });
    
    // Animate statistics with bounce effect
    gsap.from('.hero-stat', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.8,
        ease: 'back.out(1.7)'
    });
    
    // Animate hero buttons last
    gsap.from('.hero-buttons', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1.2,
        ease: 'power3.out'
    });
}

// ===== THEME MANAGEMENT =====
function initTheme() {
    // Load saved theme preference or default to dark
    const savedTheme = localStorage.getItem('porsche_theme') || 'dark';
    appState.ui.theme = savedTheme;
    updateTheme();
}

// Apply current theme to document
function updateTheme() {
    if (appState.ui.theme === 'light') {
        // Apply light mode styles
        document.body.classList.add('light-mode');
        document.body.style.setProperty('--neo-black', '#ffffff');
        document.body.style.setProperty('--neo-white', '#0a0a0a');
    } else {
        // Apply dark mode styles
        document.body.classList.remove('light-mode');
        document.body.style.setProperty('--neo-black', '#0a0a0a');
        document.body.style.setProperty('--neo-white', '#ffffff');
    }
    
    // Save theme preference
    localStorage.setItem('porsche_theme', appState.ui.theme);
}

// ===== THREE.JS INITIALIZATION =====
function initThreeJS() {
    console.log('🔄 Initializing Three.js...');
    
    // Create 3D scene with background and fog
    appState.threejs.scene = new THREE.Scene();
    appState.threejs.scene.background = new THREE.Color(0x0a0a0a);
    appState.threejs.scene.fog = new THREE.Fog(0x0a0a0a, 10, 30);
    
    // Get canvas element
    const canvas = document.querySelector('#carCanvas');
    if (!canvas) {
        console.error('❌ Canvas not found!');
        return;
    }
    
    // Create perspective camera
    appState.threejs.camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    appState.threejs.camera.position.set(3, 2, 5);
    
    // Create WebGL renderer with performance optimizations
    appState.threejs.renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
    });
    
    // Configure renderer settings
    appState.threejs.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    appState.threejs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    appState.threejs.renderer.shadowMap.enabled = true;
    appState.threejs.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    appState.threejs.renderer.outputEncoding = THREE.sRGBEncoding;
    appState.threejs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    appState.threejs.renderer.toneMappingExposure = 1.0;
    
    // Clear existing canvas content and append renderer
    canvas.innerHTML = '';
    canvas.appendChild(appState.threejs.renderer.domElement);
    
    // Initialize GLTF model loader
    appState.threejs.loader = new THREE.GLTFLoader();
    
    // Set up scene components
    setupScene();
    setupLights();
    setupControls();
    loadCarModel('911');
    
    // Handle window resize events
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
    
    // Start FPS counter for performance monitoring
    startFPSCounter();
    
    console.log('✅ Three.js initialized successfully');
}

// Set up 3D scene environment (floor, grid)
function setupScene() {
    // Create floor plane
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a3a3a,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    appState.threejs.scene.add(floor);
    
    // Add grid helper for spatial reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x666666, 0x444444);
    gridHelper.position.y = -0.49;
    appState.threejs.scene.add(gridHelper);
}

// Set up lighting system for 3D scene
function setupLights() {
    // Clear existing lights
    appState.threejs.lights.forEach(light => {
        appState.threejs.scene.remove(light);
    });
    appState.threejs.lights = [];
    
    // Main directional light (sun simulation)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    appState.threejs.scene.add(mainLight);
    appState.threejs.lights.push(mainLight);
    
    // Fill light for shadow reduction
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-10, 10, -5);
    appState.threejs.scene.add(fillLight);
    appState.threejs.lights.push(fillLight);
    
    // Rim light for edge highlighting
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-5, 5, -10);
    appState.threejs.scene.add(rimLight);
    appState.threejs.lights.push(rimLight);
    
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    appState.threejs.scene.add(ambientLight);
    appState.threejs.lights.push(ambientLight);
    
    // Hemisphere light for sky/ground color simulation
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.3);
    appState.threejs.scene.add(hemisphereLight);
    appState.threejs.lights.push(hemisphereLight);
    
    // Point light attached to camera position
    const cameraLight = new THREE.PointLight(0xffffff, 0.3, 20);
    cameraLight.position.copy(appState.threejs.camera.position);
    appState.threejs.scene.add(cameraLight);
    appState.threejs.lights.push(cameraLight);
}

// Set up orbit controls for 3D camera interaction
function setupControls() {
    const canvas = document.querySelector('#carCanvas');
    if (!canvas || !appState.threejs.camera || !appState.threejs.renderer) return;
    
    appState.threejs.controls = new THREE.OrbitControls(
        appState.threejs.camera, 
        appState.threejs.renderer.domElement
    );
    
    // Configure control behavior
    appState.threejs.controls.enableDamping = true;
    appState.threejs.controls.dampingFactor = 0.05;
    appState.threejs.controls.minDistance = 2;
    appState.threejs.controls.maxDistance = 10;
    appState.threejs.controls.maxPolarAngle = Math.PI / 2;
    appState.threejs.controls.target.set(0, 0.5, 0);
    appState.threejs.controls.update();
}

// Load 3D car model asynchronously
async function loadCarModel(modelType) {
    if (appState.threejs.isLoading) return;
    
    appState.threejs.isLoading = true;
    appState.config.model = modelType;
    
    console.log(`🚗 Loading model: ${modelType}`);
    
    // Show loading indicator
    showLoadingIndicator(true);
    
    // Remove existing model if present
    if (appState.threejs.model) {
        disposeModel(appState.threejs.model);
        appState.threejs.scene.remove(appState.threejs.model);
        appState.threejs.model = null;
    }
    
    try {
        // Load GLTF model asynchronously
        const gltf = await appState.threejs.loader.loadAsync(CONFIG.MODEL_PATHS[modelType]);
        
        appState.threejs.model = gltf.scene;
        configureModel(appState.threejs.model);
        appState.threejs.scene.add(appState.threejs.model);
        
        // Update performance statistics
        updateModelStats();
        
        // Apply current customization to new model
        applyCustomization();
        
        // Hide loading indicator
        showLoadingIndicator(false);
        
        console.log(`✅ Model ${modelType} loaded successfully`);
    } catch (error) {
        console.error(`❌ Error loading model ${modelType}:`, error);
        showLoadingIndicator(false, 'Failed to load model');
    } finally {
        appState.threejs.isLoading = false;
    }
}

// Configure loaded 3D model (scale, position, materials)
function configureModel(model) {
    // Calculate bounding box for scaling
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 4 / maxDim;
    
    model.scale.setScalar(scale);
    
    // Center the model in scene
    const offset = center.clone().multiplyScalar(-scale);
    model.position.copy(offset);
    model.position.y += 0.15;
    
    // Configure all mesh elements in model
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Initialize user data object if needed
            if (!child.userData) child.userData = {};
            
            // Tag mesh parts for later customization
            const name = child.name.toLowerCase();
            if (name.includes('body') || name.includes('chassis') || name.includes('paint')) {
                child.userData.isBody = true;
            }
            
            if (name.includes('wheel') || name.includes('rim') || name.includes('tire')) {
                child.userData.isWheel = true;
            }
            
            // Store original material properties for restoration
            if (child.material && !child.userData.originalMaterial) {
                child.userData.originalMaterial = {
                    color: child.material.color.clone(),
                    roughness: child.material.roughness,
                    metalness: child.material.metalness
                };
            }
        }
    });
    
    // Set initial rotation
    model.rotation.y = Math.PI;
}

