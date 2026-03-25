<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | allowed_origins is driven by FRONTEND_URL env var so it works
    | for both local (.env) and production (deploy.yml writes it).
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(array_unique([
        // Dev origins
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'http://localhost:3000',
        'https://tmc-backend.test',
        // Production — env-driven so deploy.yml sets the correct live domain
        env('FRONTEND_URL', 'https://foodhub.tmc-innovations.com'),
        // www variant
        env('FRONTEND_URL')
            ? preg_replace('#^(https?://)#', '$1www.', env('FRONTEND_URL'))
            : 'https://www.foodhub.tmc-innovations.com',
    ])),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => true,

];
