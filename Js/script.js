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


// ===== LOADING SCREEN =====
function initLoadingScreen() {
    // Skip loading screen entirely for demo purposes
    setTimeout(() => {
        startIntroAnimation();
    }, 100);
}


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
        createFallbackModel();
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


// Create fallback primitive model if 3D file fails to load
function createFallbackModel() {
    console.log('Creating fallback model...');
    
    const group = new THREE.Group();
    
    // Create simplified car body
    const bodyGeometry = new THREE.BoxGeometry(3, 1, 1.5);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({ 
        color: appState.config.color,
        roughness: 0.05,
        metalness: 0.9,
        clearcoat: 1.0
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.userData = { isBody: true };
    group.add(body);
    
    // Create wheel cylinders
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        roughness: 0.7,
        metalness: 0.8
    });
    
    // Define wheel positions (front-left, front-right, rear-left, rear-right)
    const wheelPositions = [
        { x: -1.2, y: 0.3, z: 0.8 },
        { x: 1.2, y: 0.3, z: 0.8 },
        { x: -1.2, y: 0.3, z: -0.8 },
        { x: 1.2, y: 0.3, z: -0.8 }
    ];
    
    // Create and position each wheel
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.castShadow = true;
        wheel.userData = { isWheel: true };
        wheel.userData.originalMaterial = {
            color: wheelMaterial.color.clone(),
            roughness: wheelMaterial.roughness,
            metalness: wheelMaterial.metalness
        };
        group.add(wheel);
    });
    
    // Position fallback model
    group.position.y = 0.3;
    
    appState.threejs.model = group;
    appState.threejs.scene.add(appState.threejs.model);
}

// Apply current customization to 3D model
function applyCustomization() {
    if (!appState.threejs.model) return;
    
    // Traverse all mesh objects in model
    appState.threejs.model.traverse((child) => {
        if (child.isMesh && child.material && child.userData) {
            // Apply customization to body parts
            if (child.userData.isBody) {
                const color = new THREE.Color(appState.config.color);
                child.material.color.copy(color);
                
                // Apply material properties based on finish selection
                switch (appState.config.material) {
                    case "metallic":
                    child.material.roughness = 0.2;
                    child.material.metalness = 1.0;
                    child.material.clearcoat = 1.0;
                    child.material.clearcoatRoughness = 0.1;
                    break;

                    case "matte":
                        child.material.roughness = 0.9;
                        child.material.metalness = 0.1;
                        child.material.clearcoat = 0.5;
                        child.material.clearcoatRoughness = 0.5;
                        break;

                    case "pearl":
                        child.material.roughness = 0.15;
                        child.material.metalness = 0.6;
                        child.material.clearcoat = 1.0;
                        child.material.clearcoatRoughness = 0.08;
                        break; 

                    case "chrome":
                        child.material.roughness = 0.02;
                        child.material.metalness = 1.0;
                        child.material.clearcoat = 0.0;
                        child.material.clearcoatRoughness = 0.0;
                        break;

                    default: // glossy
                        child.material.roughness = 0.05;
                        child.material.metalness = 0.9;
                        child.material.clearcoat = 1.0;
                        child.material.clearcoatRoughness = 0.03;
}
                
                child.material.needsUpdate = true;
            }
            
            // Apply customization to wheel parts
            if (child.userData.isWheel) {
                // Determine wheel color
                let wheelColor;
                switch(appState.config.wheelColor) {
                    case "black":
                        wheelColor = new THREE.Color(0x0a0a0a);
                        break;
                    case "bronze":
                        wheelColor = new THREE.Color(0xcd7f32);
                        break;
                    case "gold":
                        wheelColor = new THREE.Color(0xffd700);
                        break;
                    default: // silver
                        wheelColor = new THREE.Color(0xc0c0c0);
                }
                
                child.material.color.copy(wheelColor);
                
                // Apply wheel type material properties
                switch(appState.config.wheels) {
                    case "sport":
                        child.material.roughness = 0.2;
                        child.material.metalness = 0.9;
                        break;
                    case "premium":
                        child.material.roughness = 0.1;
                        child.material.metalness = 1.0;
                        break;
                    case "racing":
                        child.material.roughness = 0.05;
                        child.material.metalness = 1.0;
                        break;
                    default: // classic
                        child.material.roughness = 0.3;
                        child.material.metalness = 0.8;
                }
                
                child.material.needsUpdate = true;
            }
        }
    });
    
    // Update UI display
    updateCustomizationDisplay();
}

// Update model statistics display
function updateModelStats() {
    if (!appState.threejs.model) return;

    let vertices = 0;
    let triangles = 0;

    appState.threejs.model.traverse((child) => {
        if (child.isMesh && child.geometry) {
            const geometry = child.geometry;

            // Vertices
            vertices += geometry.attributes.position.count;

            // Triangles
            if (geometry.index) {
                triangles += geometry.index.count / 3;
            } else {
                triangles += geometry.attributes.position.count / 3;
            }
        }
    });

    // Store stats
    appState.ui.stats.vertices = vertices;
    appState.ui.stats.triangles = Math.round(triangles);
    appState.ui.stats.polygons = Math.round(triangles / 1000);

    // Update UI
    if (DOM.polyCount) {
        DOM.polyCount.textContent = `${appState.ui.stats.polygons}K`;
    }
}


// Show or hide loading indicator overlay
function showLoadingIndicator(show, message = 'Loading 3D Model') {
    const overlay = document.querySelector('.canvas-overlay');
    const loadingText = document.querySelector('.loading-text');
    
    if (!overlay) return;
    
    if (show) {
        overlay.style.display = 'flex';
        if (loadingText && message) {
            loadingText.textContent = message;
        }
    } else {
        overlay.style.display = 'none';
    }
}

// Properly dispose of 3D model resources to prevent memory leaks
function disposeModel(model) {
    model.traverse((child) => {
        if (child.isMesh) {
            // Dispose geometry
            if (child.geometry) {
                child.geometry.dispose();
            }
            
            // Dispose materials
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
    });
}

// ===== ANIMATION LOOP =====
let clock = new THREE.Clock();
let delta = 0;
let frameCount = 0;
let lastTime = performance.now();

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Calculate time delta
    delta = clock.getDelta();
    frameCount++;
    
    // Update camera light position to follow camera
    if (appState.threejs.lights.length > 0) {
        const cameraLight = appState.threejs.lights[appState.threejs.lights.length - 1];
        cameraLight.position.copy(appState.threejs.camera.position);
    }
    
    // Auto-rotate model if enabled
    if (appState.threejs.isRotating && appState.threejs.model) {
        appState.threejs.model.rotation.y += 0.005;
    }
    
    // Update orbit controls
    if (appState.threejs.controls) {
        appState.threejs.controls.update();
    }
    
    // Render 3D scene
    if (appState.threejs.renderer && appState.threejs.scene && appState.threejs.camera) {
        appState.threejs.renderer.render(appState.threejs.scene, appState.threejs.camera);
    }
}

// Start FPS counter for performance monitoring
function startFPSCounter() {
    setInterval(() => {
        const now = performance.now();
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        
        // Update FPS in state
        appState.ui.stats.fps = fps;
        lastTime = now;
        frameCount = 0;
        
        // Update DOM display with color coding
        if (DOM.fpsCounter) {
            DOM.fpsCounter.textContent = fps;
            
            // Color code based on FPS value
            if (fps < 30) {
                DOM.fpsCounter.style.color = '#ff003c';
            } else if (fps < 50) {
                DOM.fpsCounter.style.color = '#ffdd00';
            } else {
                DOM.fpsCounter.style.color = '#00ff9d';
            }
        }
    }, 1000);
}

// ===== WINDOW RESIZE =====
function onWindowResize() {
    const canvas = document.querySelector('#carCanvas');
    if (!canvas || !appState.threejs.camera || !appState.threejs.renderer) return;
    
    // Update camera aspect ratio
    appState.threejs.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    appState.threejs.camera.updateProjectionMatrix();
    
    // Update renderer size
    appState.threejs.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

// ===== AUDIO MANAGEMENT =====
function initAudio() {
    if (!DOM.engineIdleSound || !DOM.engineRevSound) {
        console.warn('Audio elements not found');
        return;
    }
    
    // Set initial volume levels
    DOM.engineIdleSound.volume = appState.audio.volume;
    DOM.engineRevSound.volume = appState.audio.volume;
    
    // Initialize Web Audio API context if available
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        appState.audio.context = new AudioContext();
    } catch (e) {
        console.warn('Web Audio API not supported');
    }
    
    // Enable audio on first user interaction (browser policy)
    document.addEventListener('click', function enableAudio() {
        if (appState.audio.context && appState.audio.context.state === 'suspended') {
            appState.audio.context.resume();
        }
        document.removeEventListener('click', enableAudio);
    }, { once: true });
}

// Toggle engine idle sound playback
function playEngineIdle() {
    // Toggle behavior: stop if currently playing
    if (appState.audio.isPlaying) {
        stopEngineIdle();
        return;
    }
    
    try {
        // Play engine idle sound from beginning
        DOM.engineIdleSound.currentTime = 0;
        DOM.engineIdleSound.play();
        appState.audio.isPlaying = true;
        
        // Update button state
        if (DOM.engineSoundBtn) {
            DOM.engineSoundBtn.innerHTML = '<i class="fas fa-stop"></i><span>STOP ENGINE</span>';
            DOM.engineSoundBtn.classList.add('active');
        }
    } catch (error) {
        console.warn('Audio playback failed:', error);
        showNotification('Click anywhere to enable audio, then try again', 'warning');
    }
}

// Stop engine idle sound
function stopEngineIdle() {
    DOM.engineIdleSound.pause();
    DOM.engineIdleSound.currentTime = 0;
    appState.audio.isPlaying = false;
    
    // Update button state
    if (DOM.engineSoundBtn) {
        DOM.engineSoundBtn.innerHTML = '<i class="fas fa-play"></i><span>IGNITION</span>';
        DOM.engineSoundBtn.classList.remove('active');
    }
}

// Play engine revving sound
function playEngineRev() {
    const wasPlaying = appState.audio.isPlaying;
    
    // Pause idle sound temporarily
    if (wasPlaying) {
        DOM.engineIdleSound.pause();
    }
    
    try {
        // Play rev sound
        DOM.engineRevSound.currentTime = 0;
        DOM.engineRevSound.play();
        
        // Visual feedback for rev button
        if (DOM.engineRevBtn) {
            DOM.engineRevBtn.classList.add('active');
            setTimeout(() => {
                DOM.engineRevBtn.classList.remove('active');
            }, 1000);
        }
        
        // Resume idle sound when rev ends
        DOM.engineRevSound.onended = () => {
            if (wasPlaying) {
                DOM.engineIdleSound.play();
            }
        };
    } catch (error) {
        console.warn('Rev sound failed:', error);
    }
}

// ===== UI UPDATES =====
function updateCustomizationDisplay() {
    // Update color display with friendly names
    if (DOM.selectedColor) {
        const colorNames = {
            "#0a0a0a": "CARBON BLACK",
            "#c00": "GUARDS RED",
            "#06c": "GENTIAN BLUE",
            "#0a5": "MIAMI BLUE"
        };
        
        DOM.selectedColor.textContent = `${colorNames[appState.config.color] || 'CUSTOM'} ${appState.config.material.toUpperCase()}`;
    }
    
    // Update wheels display
    if (DOM.selectedWheels) {
        const wheelNames = {
            "classic": "CLASSIC ALLOY",
            "sport": "SPORT DESIGN",
            "premium": "PREMIUM ALLOY",
            "racing": "RACING PACKAGE"
        };
        
        DOM.selectedWheels.textContent = `${wheelNames[appState.config.wheels]} ${appState.config.wheelColor.toUpperCase()}`;
    }
    
    // Update material display
    if (DOM.selectedMaterial) {
        DOM.selectedMaterial.textContent = `${appState.config.material.toUpperCase()} FINISH`;
    }
    
    // Update model display
    if (DOM.selectedModel) {
        const modelNames = {
            "911": "911 TURBO S",
            "taycan": "TAYCAN TURBO",
            "cayenne": "CAYENNE TURBO",
            "panamera": "PANAMERA 4S"
        };
        
        DOM.selectedModel.textContent = modelNames[appState.config.model];
    }
    
    // Update price display
    updatePrice();
}

// Calculate and update total price based on configuration
function updatePrice() {
    // Base prices for each model
    const modelPrices = {
        "911": 205000,
        "taycan": 150000,
        "cayenne": 130000,
        "panamera": 105000
    };
    
    // Wheel upgrade prices
    const wheelPrices = {
        "classic": 0,
        "sport": 2500,
        "premium": 4500,
        "racing": 7000
    };
    
    // Material/finish upgrade prices
    const materialPrices = {
        "glossy": 0,
        "metallic": 2000,
        "matte": 5000
    };
    
    // Calculate total price
    const basePrice = modelPrices[appState.config.model] || 205000;
    const wheelPrice = wheelPrices[appState.config.wheels] || 0;
    const materialPrice = materialPrices[appState.config.material] || 0;
    const total = basePrice + wheelPrice + materialPrice;
    
    // Update state and DOM
    appState.config.price = total;
    
    if (DOM.totalPrice) {
        DOM.totalPrice.textContent = `$${total.toLocaleString()}`;
    }
}

// ===== MODAL FUNCTIONS (FIXED) =====
function openModal(modal) {
    if (!modal) {
        console.error('Modal element not found!');
        return;
    }
    
    console.log('Opening modal:', modal.id);
    
    // Force modal display with important priority
    modal.style.cssText = 'display: flex !important;';
    
    // Add show class for CSS transitions
    modal.classList.add('show');
    
    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';
    
    // Animate modal appearance with GSAP
    if (modal.querySelector('.modal-content')) {
        gsap.fromTo(modal.querySelector('.modal-content'), 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
    }
}

function closeModal(modal) {
    if (!modal) return;
    
    console.log('Closing modal:', modal.id);
    
    // Animate modal disappearance
    if (modal.querySelector('.modal-content')) {
        gsap.to(modal.querySelector('.modal-content'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.2,
            ease: 'power3.in',
            onComplete: () => {
                // Hide modal after animation completes
                modal.style.cssText = 'display: none !important;';
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    } else {
        // Hide modal immediately if no content element
        modal.style.cssText = 'display: none !important;';
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ===== PURCHASE MODAL FUNCTIONS (ADDED) =====
function updatePurchaseSummary() {
    // Update purchase modal with current configuration details
    const purchaseModel = document.getElementById('purchaseModel');
    const purchaseColor = document.getElementById('purchaseColor');
    const purchaseWheels = document.getElementById('purchaseWheels');
    const purchaseFinish = document.getElementById('purchaseFinish');
    const purchaseTotal = document.getElementById('purchaseTotal');
    
    if (purchaseModel) purchaseModel.textContent = DOM.selectedModel?.textContent || '';
    if (purchaseColor) purchaseColor.textContent = DOM.selectedColor?.textContent || '';
    if (purchaseWheels) purchaseWheels.textContent = DOM.selectedWheels?.textContent || '';
    if (purchaseFinish) purchaseFinish.textContent = DOM.selectedMaterial?.textContent || '';
    if (purchaseTotal) purchaseTotal.textContent = DOM.totalPrice?.textContent || '';
    
    // Auto-fill email field if user is logged in
    if (appState.user && appState.user.email) {
        const emailField = document.getElementById('checkoutEmail');
        if (emailField) {
            emailField.value = appState.user.email;
        }
    }
}


// ===== EVENT LISTENERS (FIXED) =====
function initEventListeners() {
    // Mobile menu toggle
    if (DOM.hamburger && DOM.navLinks) {
        DOM.hamburger.addEventListener('click', () => {
            DOM.hamburger.classList.toggle('active');
            DOM.navLinks.classList.toggle('active');
            document.body.style.overflow = DOM.navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                DOM.hamburger.classList.remove('active');
                DOM.navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Theme toggle
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', () => {
            appState.ui.theme = appState.ui.theme === 'dark' ? 'light' : 'dark';
            updateTheme();
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // Login modal - FIXED
    if (DOM.loginBtn) {
        DOM.loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Login button clicked');
            openModal(DOM.loginModal);
        });
    }
    
    // Close modal buttons - FIXED
    if (DOM.closeModal) {
        DOM.closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close login modal clicked');
            closeModal(DOM.loginModal);
        });
    }
    
    if (DOM.closePurchaseModal) {
        DOM.closePurchaseModal.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close purchase modal clicked');
            closeModal(DOM.purchaseModal);
        });
    }
    
    if (DOM.closeProfileModal) {
        DOM.closeProfileModal.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close profile modal clicked');
            closeModal(DOM.profileModal);
        });
    }
    
    // Close modals on outside click - FIXED
    window.addEventListener('click', (e) => {
        // Only close if clicking on the modal background (not the content)
        if (e.target === DOM.loginModal) {
            closeModal(DOM.loginModal);
        } else if (e.target === DOM.purchaseModal) {
            closeModal(DOM.purchaseModal);
        } else if (e.target === DOM.profileModal) {
            closeModal(DOM.profileModal);
        }
    });
    
    // Form toggling between login and registration
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (DOM.loginForm) DOM.loginForm.style.display = 'none';
            if (DOM.registerForm) DOM.registerForm.style.display = 'block';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (DOM.registerForm) DOM.registerForm.style.display = 'none';
            if (DOM.loginForm) DOM.loginForm.style.display = 'block';
        });
    }
    
    // Color preset selection
    if (DOM.colorPresets) {
        DOM.colorPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.getAttribute('data-color');
                const finish = preset.getAttribute('data-finish');
                
                // Update active state
                DOM.colorPresets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
                
                // Update configuration
                appState.config.color = color;
                appState.config.material = finish;
                
                // Apply to 3D model
                applyCustomization();
            });
        });
    }
    
    // Color picker input
    if (DOM.colorPicker) {
        DOM.colorPicker.addEventListener('input', (e) => {
            appState.config.color = e.target.value;
            applyCustomization();
            
            // Remove active state from presets when using custom color
            if (DOM.colorPresets) {
                DOM.colorPresets.forEach(p => p.classList.remove('active'));
            }
        });
    }
    
    // Finish material selection
    if (DOM.finishButtons) {
        DOM.finishButtons.forEach(button => {
            button.addEventListener('click', () => {
                const finish = button.getAttribute('data-finish');
                
                // Update active state
                DOM.finishButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                
                // Update configuration
                appState.config.material = finish;
                
                // Apply to 3D model
                applyCustomization();
            });
        });
    }
    
    // Wheel style selection
    if (DOM.wheelPresets) {
        DOM.wheelPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const wheels = preset.getAttribute('data-wheel');
                
                // Update active state
                DOM.wheelPresets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
                
                // Update configuration
                appState.config.wheels = wheels;
                
                // Apply to 3D model
                applyCustomization();
            });
        });
    }
    
    // Wheel color selection
    if (DOM.wheelColorOptions) {
        DOM.wheelColorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = option.getAttribute('data-color');
                
                // Update active state
                DOM.wheelColorOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                
                // Update configuration
                appState.config.wheelColor = color;
                
                // Apply to 3D model
                applyCustomization();
            });
        });
    }
    
    // Wheel size slider
    if (DOM.wheelSizeSlider) {
        DOM.wheelSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            const sizeValue = document.querySelector('.size-value');
            
            if (sizeValue) {
                sizeValue.textContent = `${size}"`;
            }
        });
    }
    
    // Model selection - FIXED: Add event listeners to all model cards
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', () => {
            const model = card.getAttribute('data-model');
            
            // Update active state
            document.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Load the selected model
            loadCarModel(model);
        });
    });
    
    // 3D viewer controls
    if (DOM.rotateBtn) {
        DOM.rotateBtn.addEventListener('click', () => {
            appState.threejs.isRotating = !appState.threejs.isRotating;
            
            // Update button text and state
            if (appState.threejs.isRotating) {
                DOM.rotateBtn.innerHTML = '<i class="fas fa-sync-alt"></i><span>AUTO ROTATE</span>';
                DOM.rotateBtn.classList.add('active');
            } else {
                DOM.rotateBtn.innerHTML = '<i class="fas fa-pause"></i><span>AUTO ROTATE</span>';
                DOM.rotateBtn.classList.remove('active');
            }
        });
    }
    
    // Reset view button
    if (DOM.resetViewBtn) {
        DOM.resetViewBtn.addEventListener('click', () => {
            if (appState.threejs.controls) {
                appState.threejs.controls.reset();
                appState.threejs.camera.position.set(3, 2, 5);
                appState.threejs.controls.target.set(0, 0.5, 0);
            }
        });
    }
    
    // Engine sound buttons
    if (DOM.engineSoundBtn) {
        DOM.engineSoundBtn.addEventListener('click', playEngineIdle);
    }
    
    if (DOM.engineRevBtn) {
        DOM.engineRevBtn.addEventListener('click', playEngineRev);
    }
    
    // Volume control slider
    if (DOM.volumeSlider && DOM.volumeValue) {
        DOM.volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            appState.audio.volume = volume;
            
            // Update audio elements
            DOM.engineIdleSound.volume = volume;
            DOM.engineRevSound.volume = volume;
            
            // Update display
            DOM.volumeValue.textContent = `${e.target.value}%`;
        });
    }
    
    // Camera view presets
    if (DOM.viewPresets) {
        DOM.viewPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const view = preset.getAttribute('data-view');
                
                // Update active state
                DOM.viewPresets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
                
                // Set camera position based on selected view
                if (appState.threejs.camera) {
                    switch(view) {
                        case "front":
                            appState.threejs.camera.position.set(0, 1, 5);
                            break;
                        case "side":
                            appState.threejs.camera.position.set(5, 1, 0);
                            break;
                        case "back":
                            appState.threejs.camera.position.set(0, 1, -5);
                            break;
                        case "top":
                            appState.threejs.camera.position.set(0, 5, 0);
                            appState.threejs.camera.lookAt(0, 0, 0);
                            break;
                        case "interior":
                            appState.threejs.camera.position.set(0, 1, 2);
                            break;
                    }
                    
                    // Update orbit controls target
                    if (appState.threejs.controls) {
                        appState.threejs.controls.target.set(0, 0.5, 0);
                        appState.threejs.controls.update();
                    }
                }
            });
        });
    }
    
    // Purchase button - FIXED
    if (DOM.purchaseBtn) {
        DOM.purchaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Purchase button clicked');
            
            // Require login for purchase
            if (!appState.user) {
                showNotification('Please login to make a purchase', 'warning');
                openModal(DOM.loginModal);
                return;
            }
            
            // Open purchase modal with current configuration
            openModal(DOM.purchaseModal);
            updatePurchaseSummary();
        });
    }
    
    // FORM SUBMISSIONS - FIXED LOGIN HANDLER FOR NO DATABASE
if (DOM.loginForm) {
    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Show loading state
        const submitBtn = DOM.loginForm.querySelector('.btn-login');
        const originalText = submitBtn?.querySelector('.btn-text')?.textContent || 'LOGIN';
        if (submitBtn) {
            submitBtn.querySelector('.btn-text').textContent = 'PROCESSING...';
            submitBtn.disabled = true;
        }
        
        try {
            console.log('Attempting login for:', username);
            
            // CHECK FOR DEMO CREDENTIALS FIRST
            if (username === CONFIG.DEMO_USER.email && password === CONFIG.DEMO_USER.password) {
                console.log('Demo login successful');
                
                // Simulate successful login without API call
                const demoUser = {
                    id: 999,
                    username: 'demo_user',
                    email: CONFIG.DEMO_USER.email,
                    is_demo: true
                };
                
                // Generate a mock session token
                const mockToken = 'demo_token_' + Date.now();
                localStorage.setItem('porsche_session_token', mockToken);
                
                showNotification('Demo login successful!', 'success');
                closeModal(DOM.loginModal);
                updateUserUI(demoUser);
                
                // Reset button state
                if (submitBtn) {
                    submitBtn.querySelector('.btn-text').textContent = originalText;
                    submitBtn.disabled = false;
                }
                
                return; // Stop here for demo login
            }
            
            // Only try actual API call for non-demo logins
            const response = await fetch('php/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            console.log('Response status:', response.status);
            
            // Get response text first for debugging
            const responseText = await response.text();
            console.log('Raw response:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                console.error('Response text:', responseText);
                
                // If PHP fails, show fallback demo option
                showNotification('Server not responding. Try demo credentials instead.', 'warning');
                return;
            }
            
            if (result.success) {
                console.log('Login successful:', result);
                
                // Save session token to localStorage
                if (result.data && result.data.session_token) {
                    localStorage.setItem('porsche_session_token', result.data.session_token);
                    console.log('Session token saved:', result.data.session_token);
                }
                
                showNotification('Login successful!', 'success');
                closeModal(DOM.loginModal);
                
                // Update user UI
                let userData;
                if (result.data && result.data.user) {
                    userData = result.data.user;
                } else {
                    // Fallback
                    userData = {
                        id: result.data?.id || Date.now(),
                        username: username.split('@')[0],
                        email: username,
                        is_demo: false
                    };
                }
                
                updateUserUI(userData);
            } else {
                console.log('Login failed:', result.message);
                showNotification(result.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // If it's a network error, suggest demo login
            if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
                showNotification('Server unavailable. Use demo credentials: demo@porsche.com / demo123', 'warning');
            } else {
                showNotification(error.message || 'Network error. Please try again.', 'error');
            }
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}
    
    // REGISTRATION FORM - FIXED VERSION
    if (DOM.registerForm) {
        DOM.registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Client-side validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = DOM.registerForm.querySelector('.btn-register');
            const originalText = submitBtn.querySelector('.btn-text').textContent;
            submitBtn.querySelector('.btn-text').textContent = 'PROCESSING...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('php/register.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                        // Don't send confirmPassword to server
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('Registration successful! Please login.', 'success');
                    
                    // Auto-fill login form with new credentials
                    if (DOM.loginForm) {
                        document.getElementById('username').value = email;
                        document.getElementById('password').value = password;
                    }
                    
                    // Switch back to login form after a delay
                    setTimeout(() => {
                        if (DOM.registerForm) DOM.registerForm.style.display = 'none';
                        if (DOM.loginForm) DOM.loginForm.style.display = 'block';
                    }, 2000);
                } else {
                    showNotification(result.message || 'Registration failed', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Reset button state
                if (submitBtn) {
                    submitBtn.querySelector('.btn-text').textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
    
// CHECKOUT FORM SUBMISSION - FIXED TO ACTUALLY CALL BACKEND
if (DOM.checkoutForm) {
    DOM.checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data - ONLY SEND WHAT purchase.php NEEDS
        const formData = {
            // Purchase configuration data
            model: appState.config.model,
            color: appState.config.color,
            wheels: appState.config.wheels,
            material: appState.config.material,
            wheel_color: appState.config.wheelColor,
            finish: appState.config.material,
            total_price: appState.config.price,
            
            // User info from form (optional for purchase.php)
            full_name: document.getElementById('checkoutName').value,
            email: document.getElementById('checkoutEmail').value,
            phone: document.getElementById('checkoutPhone').value,
            
            // Session token for user authentication
            session_token: localStorage.getItem('porsche_session_token')
        };
        
        console.log('Purchase data being sent:', formData);
        
        // Validate required fields for the purchase
        const requiredFields = ['model', 'color', 'wheels', 'material', 'total_price'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                showNotification(`Missing required field: ${field}`, 'error');
                return;
            }
        }
        
        // Validate email format if provided
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
        }
        
        // Show loading state
        const submitBtn = DOM.checkoutForm.querySelector('.btn-purchase');
        const originalText = submitBtn?.querySelector('.btn-text')?.textContent || 'CONFIRM PURCHASE';
        if (submitBtn) {
            submitBtn.querySelector('.btn-text').textContent = 'PROCESSING...';
            submitBtn.disabled = true;
        }
        
        // Show processing message
        const purchaseMessage = document.getElementById('purchaseMessage');
        if (purchaseMessage) {
            purchaseMessage.textContent = 'Processing your order...';
            purchaseMessage.className = 'neo-message';
            purchaseMessage.style.display = 'block';
        }
        
        try {
            // ACTUAL API CALL to purchase.php
            console.log('Calling purchase.php with data:', formData);
            
            const response = await fetch('php/purchase.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            console.log('Response status:', response.status);
            
            // Get response text first for debugging
            const responseText = await response.text();
            console.log('Raw response from purchase.php:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                console.error('Response was:', responseText);
                throw new Error('Invalid server response format');
            }
            
            if (result.success) {
                console.log('Purchase successful! Order saved to database:', result);
                
                // Show success notification with order number
                const orderNumber = result.data.order_number || result.data.orderNumber;
                showNotification(`Order #${orderNumber} confirmed!`, 'success');
                
                // Update purchase message
                if (purchaseMessage) {
                    purchaseMessage.textContent = `Order #${orderNumber} saved to database!`;
                    purchaseMessage.className = 'neo-message success';
                }
                
                // Also save to localStorage as backup/offline cache
                const orders = JSON.parse(localStorage.getItem('porsche_orders') || '[]');
                orders.push({
                    order_id: orderNumber,
                    ...formData,
                    timestamp: new Date().toISOString(),
                    db_id: result.data.order_id,
                    user_id: appState.user?.id || null
                });
                localStorage.setItem('porsche_orders', JSON.stringify(orders));
                
                // Close modal after delay
                setTimeout(() => {
                    closeModal(DOM.purchaseModal);
                    if (purchaseMessage) {
                        purchaseMessage.style.display = 'none';
                    }
                    
                    // Reset form
                    DOM.checkoutForm.reset();
                    
                    // Show order confirmation
                    showOrderConfirmation(orderNumber, formData);
                }, 3000);
                
            } else {
                console.log('Purchase failed:', result.message);
                showNotification(result.message || 'Purchase failed to save to database', 'error');
                
                if (purchaseMessage) {
                    purchaseMessage.textContent = result.message || 'Failed to save order to database.';
                    purchaseMessage.className = 'neo-message error';
                }
            }
        } catch (error) {
            console.error('Purchase error:', error);
            showNotification('Failed to process order. Please try again.', 'error');
            
            if (purchaseMessage) {
                purchaseMessage.textContent = 'Network error. Please check your connection.';
                purchaseMessage.className = 'neo-message error';
            }
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}
    // Demo login button
const demoLoginBtn = document.querySelector('.demo-hint');
if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (DOM.loginForm) {
            // Auto-fill demo credentials
            document.getElementById('username').value = CONFIG.DEMO_USER.email;
            document.getElementById('password').value = CONFIG.DEMO_USER.password;
            
            // Auto-submit after a delay
            setTimeout(() => {
                DOM.loginForm.dispatchEvent(new Event('submit'));
            }, 500);
        }
    });
}
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize model cards event listeners after DOM is fully loaded
    setTimeout(() => {
        const modelCards = document.querySelectorAll('.models-grid .model-card, .model-carousel .model-card');
        modelCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const model = card.getAttribute('data-model');
                
                // Update active state
                modelCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                // Load the selected model
                loadCarModel(model);
                
                // Scroll to configurator section
                const configSection = document.getElementById('customize');
                if (configSection) {
                    window.scrollTo({
                        top: configSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }, 100);
    
    // Credit card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
        });
    }
    
    // Card expiry date formatting
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }
}



// Add logout button to navigation
function addLogoutOption() {
    // Remove existing logout button if present
    const existingLogout = document.querySelector('.logout-btn');
    if (existingLogout) existingLogout.remove();
    
    // Create logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'nav-link logout-btn';
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>LOGOUT</span>';
    
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Clear user data
        appState.user = null;
        localStorage.removeItem('porsche_user');
        
        // Reset login button
        if (DOM.loginBtn) {
            DOM.loginBtn.innerHTML = '<i class="fas fa-terminal"></i><span>SYSTEM ACCESS</span>';
            DOM.loginBtn.classList.remove('logged-in');
            DOM.loginBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(DOM.loginModal);
            };
        }
        
        // Remove logout button
        logoutBtn.remove();
        
        showNotification('Logged out successfully', 'success');
    });
    
    // Add to navigation menu
    if (DOM.navLinks) {
        DOM.navLinks.appendChild(logoutBtn);
    }
}

// ===== ORDER CONFIRMATION =====
function showOrderConfirmation(orderId, orderData) {
    // Create confirmation modal dynamically
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal neo-modal';
    confirmationModal.id = 'confirmationModal';
    confirmationModal.style.cssText = 'display: flex !important;';
    
    confirmationModal.innerHTML = `
        <div class="modal-content purchase-modal">
            <div class="modal-header">
                <div class="modal-logo" style="background: linear-gradient(135deg, #00ff9d, #00f3ff);">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>ORDER CONFIRMED!</h2>
                <span class="close-confirmation-modal" style="cursor: pointer;">&times;</span>
            </div>
            <div class="modal-body">
                <div class="confirmation-content" style="text-align: center;">
                    <div class="confirmation-icon" style="font-size: 4rem; color: #00ff9d; margin-bottom: 1rem;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 style="color: var(--cyber-blue); margin-bottom: 1rem;">THANK YOU FOR YOUR ORDER</h3>
                    <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 2rem;">
                        Your Porsche Exclusive order has been confirmed and is being processed.
                    </p>
                    
                    <div class="order-details neo-glass" style="padding: 1.5rem; margin-bottom: 2rem; text-align: left;">
                        <h4 style="color: var(--cyber-blue); margin-bottom: 1rem;">
                            <i class="fas fa-receipt"></i> ORDER DETAILS
                        </h4>
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <span>Order Number:</span>
                            <span style="color: var(--cyber-red); font-weight: bold;">${orderId}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <span>Vehicle:</span>
                            <span>${orderData.model.toUpperCase()}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <span>Total Amount:</span>
                            <span style="color: var(--cyber-green); font-weight: bold;">$${orderData.total_price.toLocaleString()}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                            <span>Order Date:</span>
                            <span>${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div class="confirmation-message" style="background: rgba(0, 255, 157, 0.1); border: 1px solid rgba(0, 255, 157, 0.3); border-radius: 8px; padding: 1rem; margin-bottom: 2rem;">
                        <p style="color: rgba(255, 255, 255, 0.9); margin: 0;">
                            <i class="fas fa-info-circle" style="color: #00ff9d;"></i>
                            A confirmation email has been sent to <strong>${orderData.email}</strong>. 
                            Our team will contact you within 24 hours.
                        </p>
                    </div>
                    
                    <button id="closeConfirmationBtn" class="neo-btn" style="background: linear-gradient(135deg, #00ff9d, #00f3ff); border: none;">
                        <i class="fas fa-home"></i>
                        <span>RETURN TO DASHBOARD</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmationModal);
    
    // Add event listeners for closing modal
    const closeBtn = confirmationModal.querySelector('.close-confirmation-modal');
    const closeConfirmationBtn = confirmationModal.querySelector('#closeConfirmationBtn');
    
    function closeConfirmationModal() {
        gsap.to(confirmationModal.querySelector('.modal-content'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => {
                document.body.removeChild(confirmationModal);
                document.body.style.overflow = '';
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeConfirmationModal);
    }
    
    if (closeConfirmationBtn) {
        closeConfirmationBtn.addEventListener('click', closeConfirmationModal);
    }
    
    // Close modal when clicking on background
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            closeConfirmationModal();
        }
    });
    
    // Animate modal appearance
    gsap.fromTo(confirmationModal.querySelector('.modal-content'), 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
}


// ===== API FUNCTIONS =====
async function handleLogin(username, password) {
    try {
        const response = await fetch('php/login.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        return {success: false, message: 'Network error'};
    }
}

async function handleRegister(username, email, password) {
    try {
        const response = await fetch('php/register.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        return {success: false, message: 'Network error'};
    }
}

async function handlePurchase(purchaseData) {
    // Simulate API call with delay
    return new Promise((resolve) => {
        setTimeout(() => {
            const orderId = 'PORSCHE-' + Date.now();
            
            // Save to local storage for demo purposes
            const orders = JSON.parse(localStorage.getItem('porsche_orders') || '[]');
            orders.push({
                ...purchaseData,
                orderId,
                date: new Date().toISOString()
            });
            localStorage.setItem('porsche_orders', JSON.stringify(orders));
            
            resolve({
                success: true,
                orderId,
                message: 'Purchase completed successfully'
            });
        }, 1500);
    });
}


// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in from right side
    gsap.from(notification, {
        x: 300,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.out'
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        gsap.to(notification, {
            x: 300,
            opacity: 0,
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => notification.remove()
        });
    }, 5000);
    
    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        gsap.to(notification, {
            x: 300,
            opacity: 0,
            duration: 0.2,
            onComplete: () => notification.remove()
        });
    });
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: var(--shadow-heavy);
    }
    
    .notification-success {
        border-color: rgba(0, 255, 0, 0.3);
        background: rgba(0, 255, 0, 0.1);
    }
    
    .notification-error {
        border-color: rgba(255, 0, 0, 0.3);
        background: rgba(255, 0, 0, 0.1);
    }
    
    .notification-warning {
        border-color: rgba(255, 221, 0, 0.3);
        background: rgba(255, 221, 0, 0.1);
    }
    
    .notification i:first-child {
        font-size: 1.2rem;
    }
    
    .notification-success i:first-child {
        color: #00ff00;
    }
    
    .notification-error i:first-child {
        color: #ff003c;
    }
    
    .notification-warning i:first-child {
        color: #ffdd00;
    }
    
    .notification span {
        flex: 1;
        color: var(--neo-white);
        font-weight: 500;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        padding: 0.25rem;
        transition: color 0.2s;
    }
    
    .notification-close:hover {
        color: var(--neo-white);
    }
`;
document.head.appendChild(notificationStyles);



// ===== STATS COUNTER ANIMATION =====
function animateStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const startTime = Date.now();
        
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOutQuart * target);
            
            stat.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                stat.textContent = target.toLocaleString();
            }
        };
        
        // Start animation when element comes into viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

// Initialize stats counter animation when page loads
window.addEventListener('load', animateStatsCounter);
