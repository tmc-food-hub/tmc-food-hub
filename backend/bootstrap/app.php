<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // CORS must run first (before routing), including for OPTIONS preflight requests
        $middleware->prepend(HandleCors::class);
        
        // Allow Google OAuth popup communication
        $middleware->use(function ($request, $next) {
            $response = $next($request);
            $response->header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
            return $response;
        });
        
        $middleware->validateCsrfTokens(except: [
            'adminer*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

