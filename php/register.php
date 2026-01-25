<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method', null, 405);
}

// Get and sanitize input
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST;
}

$username = sanitizeInput($data['username'] ?? '');
$email = sanitizeInput($data['email'] ?? '');
$password = $data['password'] ?? '';

// Validate input
if (empty($username)  empty($email)  empty($password)) {
    sendResponse(false, 'All fields are required');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Invalid email format');
}

if (strlen($password) < 6) {
    sendResponse(false, 'Password must be at least 6 characters');
}

$conn = getDBConnection();
if (!$conn) {
    sendResponse(false, 'Database connection failed');
}

// Check if user already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $email, $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    sendResponse(false, 'Username or email already exists');
}

// Hash password and create user
$password_hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, NOW())");

if (!$stmt) {
    sendResponse(false, 'Database error: ' . $conn->error);
}

$stmt->bind_param("sss", $username, $email, $password_hash);

if ($stmt->execute()) {
    $user_id = $stmt->insert_id;
    
    // Create session token
    $session_token = bin2hex(random_bytes(32));
    $expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
    
    $stmt2 = $conn->prepare("INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)");
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $stmt2->bind_param("issss", $user_id, $session_token, $ip_address, $user_agent, $expires_at);
    $stmt2->execute();
    
    sendResponse(true, 'Registration successful', [
        'user' => [
            'id' => $user_id,
            'username' => $username,
            'email' => $email
        ],
        'session_token' => $session_token
    ]);
} else {
    sendResponse(false, 'Registration failed: ' . $stmt->error);
}

$stmt->close();
$conn->close();
?>