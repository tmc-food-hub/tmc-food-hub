<?php

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'http://localhost:8000/api/admin/login',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        'email' => 'admin@tmcfoodhub.com',
        'password' => 'admin12345'
    ]),
    CURLOPT_HTTPHEADER => ['Content-Type: application/json']
]);

$response = curl_exec($ch);
$data = json_decode($response, true);
$token = $data['token'] ?? '';
curl_close($ch);

echo "Login Response: " . json_encode($data, JSON_PRETTY_PRINT) . PHP_EOL . PHP_EOL;

if (!$token) {
    echo "Failed to get token\n";
    exit(1);
}

// Test GET security settings
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'http://localhost:8000/api/admin/security-settings',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . $token
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "GET /admin/security-settings (HTTP $httpCode):\n";
echo json_encode(json_decode($response, true), JSON_PRETTY_PRINT) . PHP_EOL . PHP_EOL;

// Test PUT security settings
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'http://localhost:8000/api/admin/security-settings',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => json_encode([
        'two_factor_auth' => false,
        'max_login_attempts' => 3,
    ]),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $token
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "PUT /admin/security-settings (HTTP $httpCode):\n";
echo json_encode(json_decode($response, true), JSON_PRETTY_PRINT) . PHP_EOL . PHP_EOL;

// Verify the change
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'http://localhost:8000/api/admin/security-settings',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . $token
    ]
]);

$response = curl_exec($ch);
curl_close($ch);

echo "Verification GET:\n";
echo json_encode(json_decode($response, true), JSON_PRETTY_PRINT) . PHP_EOL;
