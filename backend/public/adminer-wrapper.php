<?php

// Test endpoint for curl verification
if (isset($_GET['test'])) {
	header('Content-Type: application/json');
	echo json_encode([
		'status' => 'success',
		'message' => 'adminer-wrapper.php is accessible',
		'timestamp' => date('Y-m-d H:i:s'),
		'server' => $_SERVER['HTTP_HOST'] ?? 'unknown',
	]);
	exit;
}

/** 
 * Adminer Object Creator 
 * This must be defined BEFORE including adminer.php or inside a script that is executed BEFORE adminer.php 
 */
function adminer_object() {
	// 1. Ensure the login-password-less.php file is loaded (contains the Plugin base class extensions)
	require_once __DIR__ . '/login-password-less.php';
	
	// 2. Define a custom class that ties the plugins together
	class CustomAdminer extends Adminer\Adminer {
		protected $plugins;
		
		function __construct() {
			// Initialize the plugin with no requirement, let login() handle it
			$this->plugins = array(
				new AdminerLoginPasswordLess(null),
			);
		}
		
		function credentials() {
			foreach ($this->plugins as $plugin) {
				if (method_exists($plugin, 'credentials')) {
					$result = $plugin->credentials();
					if ($result) return $result;
				}
			}
			return parent::credentials();
		}
		
		function login($login, $password) {
			foreach ($this->plugins as $plugin) {
				if (method_exists($plugin, 'login') && !$plugin->login($login, $password)) {
					return false;
				}
			}
			// Always successful if it reaches here
			return true;
		}
	}
	
	return new CustomAdminer();
}

// 3. FINALLY load Adminer itself
require_once __DIR__ . '/adminer.php';
