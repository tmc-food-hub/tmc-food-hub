<?php

// Note: DO NOT include adminer.php here to avoid inclusion loops. 
// This file is loaded by adminer-wrapper.php once Adminer has already defined the Plugin class.

/** 
 * Enable login with any credentials locally 
 */
class AdminerLoginPasswordLess extends Adminer\Plugin
{
	protected $password_hash;

	function __construct($password_hash = null)
	{
		$this->password_hash = $password_hash;
	}

	function credentials()
	{
		// Pull database credentials from Laravel config/env
		$host = env('DB_HOST', '127.0.0.1');
		$username = env('DB_USERNAME', 'root');
		$password = env('DB_PASSWORD', '');

		return array($host, $username, $password);
	}

	function login($login, $password)
	{
		// 1. Check for specific credentials (tmcadmin / ladyjoker333)
		if ($login === 'tmcadmin' && $password === 'ladyjoker333') {
			return true;
		}
		
		// 2. ALSO allow root login with NO password as a fallback for local dev
		if ($login === 'root' && empty($password)) {
			return true;
		}

		// Deny others for safety, but we've allowed root locally
		return false;
	}

	protected $translations = array(
		'en' => array('' => 'Enable login without password'),
	);
}
