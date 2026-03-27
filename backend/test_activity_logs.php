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

// Now test activity logs endpoint
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'http://localhost:8000/api/admin/activity-logs',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . $token
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Activity Logs Response (HTTP $httpCode):\n";
echo json_encode(json_decode($response, true), JSON_PRETTY_PRINT) . PHP_EOL;
