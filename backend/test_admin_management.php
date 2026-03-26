<?php

echo "=== Testing Admin Management Endpoint ===\n\n";

// Step 1: Login as admin to get token
echo "Step 1: Login as admin\n";
$ch = curl_init('http://localhost:8000/api/admin/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admin@tmcfoodhub.com',
    'password' => 'password'
]));

$loginResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$loginData = json_decode($loginResponse, true);

if ($httpCode === 200 && isset($loginData['token'])) {
    $token = $loginData['token'];
    echo "✓ Login successful\n";
    echo "Token: " . substr($token, 0, 30) . "...\n\n";
    
    // Step 2: Fetch admins using token
    echo "Step 2: Fetch admin list\n";
    $ch = curl_init('http://localhost:8000/api/admin/admins');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Accept: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Status: $httpCode\n";
    
    $data = json_decode($response, true);
    
    if ($httpCode === 200 && isset($data['data'])) {
        echo "✓ Endpoint responding successfully\n";
        echo "Admin count: " . count($data['data']) . "\n\n";
        
        if (count($data['data']) > 0) {
            echo "Admin List:\n";
            foreach ($data['data'] as $admin) {
                echo "  - {$admin['name']} ({$admin['email']}) - {$admin['role']} - {$admin['status']}\n";
            }
        } else {
            echo "⚠ No admins found in database\n";
        }
    } else {
        echo "✗ Error: " . ($data['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "✗ Login failed\n";
    echo "Response: " . $loginResponse . "\n";
}

echo "\n=== Test Complete ===\n";

