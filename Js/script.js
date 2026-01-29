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