<?php
// login.php - UPDATED WITH BETTER RESPONSE FORMAT

require_once 'config.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON header first
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Main login handler
try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method. Use POST.', 405);
    }

    // Get and parse input data
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        // Fallback to form data
        $data = $_POST;
    }

    // Validate required fields
    if (empty($data['username']) || empty($data['password'])) {
        throw new Exception('Username and password are required', 400);
    }

    $username = trim($data['username']);
    $password = $data['password'];

    // ================= DEMO USER LOGIN =================
    $demo_email = 'demo@porsche.com';
    $demo_password = 'demo123';
    
    if ($username === $demo_email && $password === $demo_password) {
        $response = [
            'success' => true,
            'message' => 'Demo login successful',
            'data' => [
                'user' => [
                    'id' => 999,
                    'username' => 'Demo User',
                    'email' => $demo_email,
                    'is_demo' => true
                ],
                'session_token' => 'demo_' . bin2hex(random_bytes(8))
            ]
        ];
        
        echo json_encode($response);
        exit();
    }

    // ================= DATABASE LOGIN =================
    $conn = getDBConnection();
    
    if (!$conn) {
        // Try with explicit credentials
        $conn = new mysqli('localhost', 'root', '', 'porsche_exclusive');
        
        if ($conn->connect_error) {
            throw new Exception('Database connection failed. Please check if WAMP is running.', 500);
        }
    }

    // Check if users table exists
    $checkTable = $conn->query("SHOW TABLES LIKE 'users'");
    if ($checkTable->num_rows === 0) {
        throw new Exception('Database not set up. Please run database setup first.');
    }

    // Prepare SQL statement
    $sql = "SELECT id, username, email, password_hash FROM users WHERE email = ? OR username = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Database error: ' . $conn->error);
    }

    $stmt->bind_param("ss", $username, $username);
    
    if (!$stmt->execute()) {
        throw new Exception('Login failed: ' . $stmt->error);
    }

    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Invalid username or password', 401);
    }

    $user = $result->fetch_assoc();

    // Verify password
    if (!password_verify($password, $user['password_hash'])) {
        throw new Exception('Invalid username or password', 401);
    }

    // Generate session token
    $session_token = bin2hex(random_bytes(32));

    // Success response - FIXED FORMAT
    $response = [
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'user' => [
                'id' => (int)$user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'is_demo' => false
            ],
            'session_token' => $session_token
        ]
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);

    // Cleanup
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // Error response
    http_response_code($e->getCode() ?: 500);
    
    $response = [
        'success' => false,
        'message' => $e->getMessage(),
        'data' => null
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
    
    error_log("Login Error: " . $e->getMessage());
}
?>