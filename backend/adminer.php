<?php

// Standalone Adminer entry point - completely separate from Laravel
function adminer_object() {
	// Load the plugins AFTER adminer.php establishes the Adminer\Plugin class
	require_once __DIR__ . '/public/login-password-less.php';
	
	// Create custom Adminer class that includes plugins
	class CustomAdminer extends Adminer\Adminer {
		protected $plugins;
		
		function __construct() {
			$this->plugins = array(
				new AdminerLoginPasswordLess(password_hash("", PASSWORD_DEFAULT)),
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
			return true;
		}
	}
	
	return new CustomAdminer();
}

// Load Adminer with the custom object
require_once __DIR__ . '/public/adminer.php';
