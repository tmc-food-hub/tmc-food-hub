<?php

echo "Testing API route directly...\n";

$url = 'http://localhost:8000/api/admin/promotions';
echo "URL: {$url}\n\n";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

echo "HTTP Status: {$httpCode}\n";
echo "Headers:\n{$headers}\n";
echo "Body:\n{$body}\n";

// Try with auth token
echo "\n\n=== With Bearer Token ===\n";

$token = 'test-token-12345';
$url2 = 'http://localhost:8000/api/admin/promotions';
echo "URL: {$url2}\n";

$ch = curl_init($url2);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

echo "HTTP Status: {$httpCode}\n";
echo "Headers:\n{$headers}\n";
echo "Body:\n{$body}\n";
