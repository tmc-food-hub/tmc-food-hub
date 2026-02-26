<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\ContactRepositoryInterface;
use App\Repositories\ContactRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            ContactRepositoryInterface::class,
            ContactRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}