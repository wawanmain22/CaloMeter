# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CaloMeter is a Laravel + React (Inertia.js) application using TypeScript, Tailwind CSS, and modern tooling. It's built on Laravel's React Starter Kit with authentication, settings, and a dashboard system.

## Development Commands

### Backend (Laravel/PHP)
- `composer dev` - Start development environment (Laravel server, queue, logs, Vite)
- `composer dev:ssr` - Start development with SSR support
- `composer test` - Run PHP tests (clears config and runs PHPUnit via Pest)
- `php artisan serve` - Start Laravel development server
- `php artisan test` - Run tests directly
- `vendor/bin/pest` - Run Pest tests directly
- `php artisan pail` - View application logs in real-time

### Frontend (Node.js/React)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run build:ssr` - Build with SSR support
- `npm run lint` - Run ESLint with auto-fix
- `npm run types` - TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Docker Commands
- `docker-compose up -d` - Start MySQL and phpMyAdmin services
- `docker-compose down` - Stop and remove containers
- `docker-compose logs mysql` - View MySQL container logs
- `docker-compose logs phpmyadmin` - View phpMyAdmin container logs

### Code Quality
- **Linting**: ESLint with React, React Hooks, and TypeScript rules
- **Formatting**: Prettier with Tailwind CSS plugin and import organization
- **Type Checking**: TypeScript with strict configuration

## Architecture

### Backend Structure
- **Controllers**: Located in `app/Http/Controllers/` with auth and settings namespaces
- **Models**: Standard Laravel Eloquent models in `app/Models/`
- **Routes**: Split across `routes/web.php`, `routes/auth.php`, and `routes/settings.php`
- **Middleware**: Custom middleware for Inertia requests and appearance handling
- **Database**: SQLite for development (default), MySQL via Docker available, migrations in `database/migrations/`

### Frontend Structure
- **Pages**: Inertia pages in `resources/js/pages/` (auth, dashboard, settings, welcome)
- **Components**: Reusable React components in `resources/js/components/`
  - `ui/` - Radix UI-based components with Tailwind styling
  - App-specific components (app-shell, app-header, app-sidebar, etc.)
- **Layouts**: Page layouts in `resources/js/layouts/` (app, auth, settings)
- **Hooks**: Custom React hooks in `resources/js/hooks/`
- **Types**: TypeScript definitions in `resources/js/types/`

### Key Technologies
- **Inertia.js**: SPA-like experience with server-side routing
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS v4**: Utility-first styling with Vite plugin
- **Ziggy**: Laravel route helpers for JavaScript
- **Pest**: Modern PHP testing framework

### Styling System
- Uses `class-variance-authority` for component variants
- `clsx` and `tailwind-merge` for conditional classes
- Tailwind CSS with animations and custom utilities
- Theme system with dark/light mode support via `use-appearance` hook

### Testing
- **PHP**: Pest framework with Feature and Unit test suites
- **Database**: In-memory SQLite for testing
- **Configuration**: PHPUnit XML with environment variables for testing

### Build System
- **Vite**: Modern build tool with React and Tailwind plugins
- **Laravel Vite Plugin**: Integrates Vite with Laravel asset pipeline
- **SSR Support**: Server-side rendering capability with dedicated entry point
- **Hot Reload**: Development server with automatic refresh on changes

## Development Workflow

### Using SQLite (Default)
1. Run `composer dev` to start the full development environment
2. Database uses SQLite file at `database/database.sqlite`

### Using MySQL with Docker
1. Start Docker services: `docker-compose up -d`
2. Update `.env` to use MySQL configuration (see `.env.example`)
3. Run migrations: `php artisan migrate`
4. Access phpMyAdmin at http://localhost:8080 (root/root_password)
5. Run `composer dev` to start Laravel development environment

### General Workflow
1. Frontend changes are automatically compiled and hot-reloaded
2. Backend changes require manual server restart
3. Use `npm run lint` and `npm run types` before committing
4. Run tests with `composer test` to ensure functionality
5. Format code with `npm run format` for consistency

## File Organization

- React components follow a consistent naming pattern (kebab-case files, PascalCase components)
- TypeScript strict mode is enabled with path aliases (`@/` maps to `resources/js/`)
- CSS is organized with Tailwind utilities and component-based styling
- PHP follows PSR-4 autoloading and Laravel conventions