<?php

// Load Adminer first to establish the Plugin class
require_once __DIR__ . '/adminer.php';

/** Enable login without password
* @link https://www.adminer.org/plugins/#use
* @author Jakub Vrana, https://www.vrana.cz/
* @license https://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
* @license https://www.gnu.org/licenses/gpl-2.0.html GNU General Public License, version 2 (one or other)
*/
class AdminerLoginPasswordLess extends Adminer\Plugin {
	protected $password_hash;

	/** Set allowed password
	* @param string $password_hash result of password_hash()
	*/
	function __construct($password_hash) {
		$this->password_hash = $password_hash;
	}

	function credentials() {
		// Pull database credentials from Laravel config/env
		$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
		$username = $_ENV['DB_USERNAME'] ?? 'root';
		$password = $_ENV['DB_PASSWORD'] ?? '';
		
		return array($host, $username, $password);
	}

	function login($login, $password) {
		// Pseudo credentials for Adminer access
		$validUsername = 'tmcadmin';
		$validPassword = 'ladyjoker333';
		
		// Only allow if the correct credentials are entered
		return ($login === $validUsername && $password === $validPassword);
	}

	protected $translations = array(
		'cs' => array('' => 'Povolí přihlášení bez hesla'),
		'de' => array('' => 'Ermöglicht die Anmeldung ohne Passwort'),
		'pl' => array('' => 'Włącz logowanie bez hasła'),
		'ro' => array('' => 'Activați autentificarea fără parolă'),
		'ja' => array('' => 'パスワードなしのログインを許可'),
	);
}
