# My Components - React Component Library

## Overview

This is a modern React component library built with TypeScript that provides flexible, accessible UI components. The project features a comprehensive architecture with a React frontend, Express.js backend, PostgreSQL database integration, and development tools including Storybook for component documentation and testing infrastructure. The library currently focuses on two main components: InputField and DataTable, both designed with multiple variants, full accessibility support, and comprehensive customization options.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern React features
- **Vite** as the build tool and development server for fast development and optimized builds
- **Tailwind CSS** with custom CSS variables for consistent theming and responsive design
- **Component-driven architecture** with separate folders for each major component (InputField, DataTable)
- **shadcn/ui integration** for base UI components with extensive Radix UI primitives
- **Theme system** supporting light/dark modes with CSS custom properties
- **Accessibility-first design** with ARIA labels, keyboard navigation, and screen reader support

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **Modular route structure** with separation of concerns between routes and business logic
- **Storage abstraction layer** with interface-based design allowing for different storage implementations
- **In-memory storage** as the default implementation with planned database integration
- **Middleware setup** for JSON parsing, URL encoding, and request logging
- **Error handling middleware** with proper HTTP status codes and error responses

### Data Storage Solutions
- **Drizzle ORM** configured for PostgreSQL with type-safe database operations
- **Neon Database** integration via `@neondatabase/serverless` for cloud PostgreSQL
- **Database migrations** managed through Drizzle Kit with schema versioning
- **Zod schemas** for runtime validation and type inference
- **User entity** with username/password authentication structure

### Development and Testing Infrastructure
- **Storybook** for component documentation and isolated development
- **Vitest** with React Testing Library for unit and integration testing
- **Custom render utility** with provider setup for consistent testing environment
- **ESBuild** for production server bundling
- **Development vs. production** environment handling with different configurations

### Component System Design
- **Variant-based components** using class-variance-authority for consistent styling
- **Forwarded refs** for proper DOM element access
- **Controlled/uncontrolled** component patterns with flexible prop interfaces
- **Loading states** and error handling built into components
- **Responsive design** with mobile-first approach
- **Icon integration** using Lucide React for consistent iconography

## External Dependencies

### Core Framework Dependencies
- **React 18** and **React DOM** for the component library foundation
- **TypeScript** for type safety across the entire codebase
- **Vite** for development server and build tooling with React plugin support

### UI and Styling
- **Tailwind CSS** for utility-first styling with PostCSS and Autoprefixer
- **Radix UI** components (@radix-ui/*) for accessible primitive components
- **Lucide React** for consistent icon library
- **class-variance-authority** for variant-based component styling
- **clsx** and **tailwind-merge** for conditional class name management

### Backend and Database
- **Express.js** for server-side API development
- **Drizzle ORM** with PostgreSQL dialect for type-safe database operations
- **@neondatabase/serverless** for cloud PostgreSQL database connection
- **Drizzle Kit** for database migrations and schema management
- **Zod** for runtime schema validation and type inference

### Development Tools
- **Storybook** (@storybook/*) for component documentation and development
- **Vitest** for testing framework with React Testing Library integration
- **@testing-library/jest-dom** for additional DOM testing assertions
- **ESBuild** for server-side bundling in production

### State Management and Data Fetching
- **@tanstack/react-query** for server state management and caching
- **React Hook Form** with @hookform/resolvers for form state management

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal** for development error handling
- **@replit/vite-plugin-cartographer** and **@replit/vite-plugin-dev-banner** for Replit development environment enhancements

### Additional Utilities
- **wouter** for client-side routing
- **nanoid** for unique ID generation
- **date-fns** for date manipulation utilities
- **connect-pg-simple** for PostgreSQL session storage (if needed for authentication)