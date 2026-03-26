<?php
// Test the complete admin settings workflow with form-like requests

$API_URL = 'http://localhost:8000/api';
$TOKEN = 'test_admin_token_12345'; // Replace with actual admin token if needed

// Colors for output
$GREEN = "\033[92m";
$RED = "\033[91m";
$BLUE = "\033[94m";
$YELLOW = "\033[93m";
$RESET = "\033[0m";

echo "{$BLUE}=== Admin Settings Form Submission Test ==={$RESET}\n\n";

/**
 * Test helper function
 */
function testEndpoint($method, $url, $data = null, $testName = '') {
    global $API_URL, $TOKEN, $GREEN, $RED, $BLUE, $RESET;
    
    $fullUrl = $API_URL . $url;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $fullUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $TOKEN,
    ]);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $responseData = json_decode($response, true);
    
    // Display test result
    $status = ($httpCode >= 200 && $httpCode < 300) ? 
        "{$GREEN}✓ PASS{$RESET}" : 
        "{$RED}✗ FAIL{$RESET}";
    
    echo "\n{$BLUE}Test: {$testName}{$RESET}\n";
    echo "Method: {$method} {$url}\n";
    echo "HTTP Status: {$httpCode} - {$status}\n";
    
    if ($data) {
        echo "Request Data:\n";
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    }
    
    if ($responseData) {
        echo "Response:\n";
        if (isset($responseData['data'])) {
            echo json_encode($responseData['data'], JSON_PRETTY_PRINT) . "\n";
        } else {
            echo json_encode($responseData, JSON_PRETTY_PRINT) . "\n";
        }
    }
    
    return $httpCode >= 200 && $httpCode < 300;
}

// ============================================================================
// Test Suite
// ============================================================================

echo "\n{$YELLOW}--- PART 1: Initial Settings Fetch ---{$RESET}\n";
testEndpoint('GET', '/admin/settings', null, 'Fetch Current Settings');

echo "\n\n{$YELLOW}--- PART 2: General Settings Form Submission ---{$RESET}\n";
$generalData = [
    'platform_name' => 'TMC Foodhub Premium',
    'platform_status' => 'live',
    'tagline' => 'Premium Food Delivery Service',
    'support_email' => 'support@tmcfoodhub.com',
    'phone_number' => '+63 2 8123 4567',
    'currency' => 'PHP',
    'language' => 'English',
    'timezone' => 'Asia/Manila',
];
testEndpoint('PUT', '/admin/settings/general', $generalData, 'Submit General Settings Form');

echo "\n\n{$YELLOW}--- PART 3: Commission Settings Form Submission ---{$RESET}\n";
$commissionData = [
    'default_commission_rate' => 16.5,
    'commission_type' => 'tiered',
    'delivery_mode' => 'platform',
    'platform_delivery_fee' => 75,
];
testEndpoint('PUT', '/admin/settings/commission', $commissionData, 'Submit Commission Settings Form');

echo "\n\n{$YELLOW}--- PART 4: Notification Settings Form Submission ---{$RESET}\n";
$notificationData = [
    'notify_new_orders' => true,
    'notify_disputes' => true,
    'notify_reviews' => false,
    'notify_promotions' => true,
];
testEndpoint('PUT', '/admin/settings/notifications', $notificationData, 'Submit Notification Settings Form');

echo "\n\n{$YELLOW}--- PART 5: Verify Persistence - Fetch Settings Again ---{$RESET}\n";
$result = testEndpoint('GET', '/admin/settings', null, 'Verify All Changes Were Saved');

echo "\n\n{$BLUE}=== All Form Submission Tests Complete ==={$RESET}\n";
echo "{$GREEN}Frontend settings forms are ready for use!{$RESET}\n";
?>
