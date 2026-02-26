
# AVAA Backend

## Dependencies

- PHP 8.4.X
- Composer
- Laravel 12
- MySQL/MariaDB

Currently, Hostinger is providing support with PHP 8.4, make sure that your version matches to avoid conflict issues.

## Installation
Before you run, make sure that you currently have MySQL/MariaDB running either via XAMPP or any form of local hosting of a database for testing.

Ensure that you have setup your environment variables at ```.env``` with configuration depending on how you created your database.

1. **Clone the repository**
    ```bash
    git clone https://github.com/chynnnnx/avaa-backend.git
    cd avaa-backend
    ```

2. **Install PHP dependencies**
    ```bash
    composer install
    ```
3.  **Set up environment variables** (Copy the environment file and generate an app key)
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. **Run migrations** (if applicable)
    ```bash
    php artisan migrate
    ```
5. **Run database seeders**
    ```bash
    php artisan db:seed --class=SupportTopicSeeder
    ```

6. **Run the backend server**
    ```bash
    php artisan serve
    ```

## API Features

Feel free to test this out by using Postman, or directly from the frontend, as long as both servers are up and running.

### POST /api/support

Handles support ticket submissions with form data:
- `name` (required)
- `email` (required)
- `topic_id` (required)
- `message` (required)
- `attachment` (optional)

### GET /api/support/topics

This is dedicated for the dropdown menu for topics in the Support Page.

Returns available support topics with:
- `id`
- `label`


