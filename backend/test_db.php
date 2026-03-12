<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306", "root", "");
    echo "Connected to MySQL server successfully.\n";
    $stmt = $pdo->query("SHOW DATABASES LIKE 'tmcfoodhub'");
    if ($stmt->fetch()) {
        echo "Database 'tmcfoodhub' exists.\n";
    } else {
        echo "Database 'tmcfoodhub' does NOT exist.\n";
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
