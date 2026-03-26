<?php

echo "=== Testing Permissions & Roles Endpoint ===\n\n";

// Step 1: Login as admin
echo "Step 1: Login as admin\n";
$ch = curl_init('http://localhost:8000/api/admin/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admin@tmcfoodhub.com',
    'password' => 'admin12345'
]));

$loginResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$loginData = json_decode($loginResponse, true);

if ($httpCode === 200 && isset($loginData['token'])) {
    $token = $loginData['token'];
    echo "✓ Login successful\n";
    echo "Token: " . substr($token, 0, 30) . "...\n\n";
    
    // Step 2: Fetch permissions and roles
    echo "Step 2: Fetch permissions and roles\n";
    $ch = curl_init('http://localhost:8000/api/admin/permissions-roles');
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
    
    if ($httpCode === 200 && isset($data['roles']) && isset($data['permissions'])) {
        echo "✓ Endpoint responding successfully\n\n";
        
        echo "Roles (" . count($data['roles']) . "):\n";
        foreach ($data['roles'] as $role) {
            echo "  - {$role['name']} (ID: {$role['id']})\n";
        }
        
        echo "\nPermissions by Category:\n";
        foreach ($data['permissions'] as $cat) {
            echo "  {$cat['category']}:\n";
            foreach ($cat['items'] as $item) {
                $roleCount = count($item['roleIds']);
                echo "    - {$item['label']} ({$roleCount} roles)\n";
            }
        }
    } else {
        echo "✗ Error: " . ($data['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "✗ Login failed\n";
}

echo "\n=== Test Complete ===\n";
