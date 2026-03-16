<?php

namespace App\Http\Controllers;

class AdminerController extends Controller
{
    public function index()
    {
        // Execute the adminer-wrapper.php file in this context
        ob_start();
        include base_path('public/adminer-wrapper.php');
        $content = ob_get_clean();
        
        return response($content)->header('Content-Type', 'text/html; charset=utf-8');
    }
}
