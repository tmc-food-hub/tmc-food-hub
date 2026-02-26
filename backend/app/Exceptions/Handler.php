<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException; 
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        if ($request->is('api/*')) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    private function handleApiException($request, Throwable $e)
    {
        if ($e instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        $status = 500;
        $message = 'Server error';
        $error = config('app.debug') ? $e->getMessage() : null;

        $map = [
            ModelNotFoundException::class => ['Resource not found', 404],
            NotFoundHttpException::class => ['Endpoint not found', 404],
            MethodNotAllowedHttpException::class => ['Method not allowed', 405],
            AuthenticationException::class => ['Unauthenticated', 401],
            QueryException::class => ['Database error', 500, $error ?: 'Database error occurred'],
        ];

        foreach ($map as $class => $data) {
            if ($e instanceof $class) {
                [$message, $status] = $data;
                $errors = $data[2] ?? null;

                return response()->json(array_filter([
                    'success' => false,
                    'message' => $message,
                    'errors' => $errors,
                ]), $status);
            }
        }

        return response()->json([
            'success' => false,
            'message' => $message,
            'error' => $error ?? 'Something went wrong',
        ], $status);
    }
}
