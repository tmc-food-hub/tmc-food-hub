# Collaborator Setup & Workflow Commands

A quick reference guide for setting up the project locally and collaborating using Git.

---

## 🚀 1. Initial Setup (First Time Only)

When you first clone the repository, run these commands to set everything up.

### Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup (Laravel)
Make sure XAMPP (MySQL) is running first!
```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Setup database (Make sure you created the database in MySQL first)
# Then run migrations to create tables
php artisan migrate

# Seed the database with initial fake data
php artisan db:seed

# Start the Laravel server
php artisan serve
```

---

## 🔄 2. Daily Git Workflow (Collaborating)

Always pull the latest code before you start working to avoid conflicts!

### 1️⃣ Get Latest Code
```bash
# Make sure you are on the main branch
git checkout main

# Pull the latest changes from GitHub
git pull origin main
```

### 2️⃣ Create a New Branch for Your Work
Always work on a separate branch, not directly on `main`. Name it descriptively (e.g., `feat/login-page`, `fix/navbar-bug`).
```bash
git checkout -b your-branch-name
```

### 3️⃣ Save Your Work (Commit)
```bash
# Check what files you changed
git status

# Add all changed files to staging
git add .

# Or add a specific file: git add frontend/src/App.jsx

# Commit with a clear message
git commit -m "feat: added login page UI"
```

### 4️⃣ Push Your Branch to GitHub
```bash
# First time pushing this branch:
git push -u origin your-branch-name

# Future pushes on the same branch:
git push
```

### 5️⃣ Create a Pull Request (PR)
- Go to the repository on GitHub.
- Click **"Compare & pull request"**.
- Add a description and submit for review.

---

## 🛠️ 3. Useful Laravel / Database Commands
When someone else changes the database structure or adds new packages, you need to run these:

```bash
# If someone added new packages to composer.json
composer install

# If someone changes the database structure (migrations)
php artisan migrate

# If you want to completely WIPE and RESET your local database (WARNING: Deletes all local data)
php artisan migrate:fresh --seed

# To clear Laravel caches if things are acting weird
php artisan optimize:clear
```
