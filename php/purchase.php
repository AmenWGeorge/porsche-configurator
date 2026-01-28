<?php
require_once 'config.php';

// Add debug logging
error_log("=== PURCHASE REQUEST START ===");
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("Wrong method, returning 405");
    sendResponse(false, 'Invalid request method', null, 405);
}

$data = json_decode(file_get_contents('php://input'), true);

// Log what we received
error_log("Received data: " . print_r($data, true));

if (!$data) {
    $data = $_POST;
    error_log("Using POST data instead: " . print_r($data, true));
}

// Validate required fields
$required = ['model', 'color', 'wheels', 'material', 'total_price'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        error_log("Missing field: $field");
        sendResponse(false, "Missing required field: $field");
    }
}

// Log session token if present
if (!empty($data['session_token'])) {
    error_log("Session token received: " . $data['session_token']);
} else {
    error_log("No session token received");
}

// Generate order number
$order_number = 'PORSCHE-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(4)));
error_log("Generated order number: $order_number");

$conn = getDBConnection();
if (!$conn) {
    error_log("Database connection failed");
    sendResponse(false, 'Database connection failed');
}

// Get user ID from session token if provided
$user_id = null;
if (!empty($data['session_token'])) {
    $stmt = $conn->prepare("SELECT user_id FROM user_sessions WHERE session_token = ? AND expires_at > NOW()");
    if ($stmt) {
        $stmt->bind_param("s", $data['session_token']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $session = $result->fetch_assoc();
            $user_id = $session['user_id'];
            error_log("Found user_id from session: $user_id");
        } else {
            error_log("No valid session found for token");
        }
        $stmt->close();
    } else {
        error_log("Failed to prepare session query: " . $conn->error);
    }
}

// Save order
$stmt = $conn->prepare("
    INSERT INTO orders (
        order_number, user_id, model, color, wheels, material, 
        wheel_color, finish, total_price, configuration_data, order_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
");

if (!$stmt) {
    error_log("Failed to prepare order insert: " . $conn->error);
    sendResponse(false, 'Database error: ' . $conn->error);
}

$config_data = json_encode($data);
$wheel_color = $data['wheel_color'] ?? null;
$finish = $data['finish'] ?? null;

$stmt->bind_param(
    "sissssssds",
    $order_number, $user_id, $data['model'], $data['color'], $data['wheels'],
    $data['material'], $wheel_color, $finish, $data['total_price'], $config_data
);

if ($stmt->execute()) {
    $order_id = $stmt->insert_id;
    error_log("Order saved successfully! ID: $order_id, Order #: $order_number");
    
    sendResponse(true, 'Purchase successful', [
        'order_number' => $order_number,
        'order_id' => $order_id,
        'total' => $data['total_price'],
        'date' => date('Y-m-d H:i:s')
    ]);
} else {
    error_log("Order save failed: " . $stmt->error);
    sendResponse(false, 'Purchase failed: ' . $stmt->error);
}

$stmt->close();
$conn->close();

error_log("=== PURCHASE REQUEST END ===");
?>