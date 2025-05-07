# Product App - Angular Technical Assessment

A clean, responsive Angular application for displaying product information with detailed documentation.

## Features

- **Product Listing**: View all products in a responsive grid
- **Product Details**: See detailed information about each product
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Design**: Works on devices of all sizes
- **Accessibility Features**: ARIA attributes and keyboard navigation
- **Error Handling**: Graceful image load error recovery
- **Image Preloading**: Improved performance with image caching

## Project Structure

The project follows Angular best practices with a clean, modular structure:

```
/src/app/
│
├── components/                # UI components
│   ├── product-card/          # Reusable product card component 
│   ├── product-list/          # Product listing page
│   └── product-detail/        # Product details page
│
├── services/                  # Application services
│   ├── product.service.ts     # Product data management
│   └── image-cache.service.ts # Image preloading & caching
│
├── app.component.*            # Root application component
└── app.routes.ts              # Application routing
```

## Key Components

### 1. ProductCardComponent
- Reusable card for displaying product summaries
- Handles image errors with fallbacks
- Emits selection events to parent
- Provides direct navigation to detail view

### 2. ProductListComponent
- Displays grid of product cards
- Manages loading states
- Handles navigation to product details

### 3. ProductDetailComponent
- Shows comprehensive product information
- Handles route parameter validation
- Provides error handling for invalid IDs or missing products
- Navigation back to product list

## Services

### 1. ProductService
- Manages product data
- Simulates API calls with RxJS Observables
- Provides methods to get all products or specific product by ID
- Demonstrates proper error handling

### 2. ImageCacheService
- Preloads product images for better user experience
- Implements caching to reduce network requests
- Handles image loading errors gracefully
- Provides server-side rendering compatibility

## Technical Implementation

### 1. Angular Features Used
- Standalone components
- Angular Router with parameterized routes
- Component Input/Output for communication
- RxJS Observables for async operations
- Angular SSR compatibility

### 2. UX Enhancements
- Dark mode toggle with system preference detection
- Theme persistence using localStorage
- Loading indicators for async operations
- Responsive grid layout
- Accessible UI elements

## Running the Project

1. **Install dependencies**
   ```
   npm install
   ```

2. **Start development server**
   ```
   ng serve
   ```

3. **Build for production**
   ```
   ng build
   ```

## Meeting Assessment Requirements

This project fulfills all the technical assessment requirements:

1. **Project Setup** ✓
   - Angular CLI project with clean structure
   - Best practices for organization

2. **Component & Data Binding** ✓
   - ProductCardComponent with @Input() for product data
   - @Output() for selection events

3. **Service & Data Handling** ✓
   - ProductService for data management
   - RxJS Observables for async operations

4. **Routing & Navigation** ✓
   - Angular routing with product list and detail views
   - Parameter-based navigation

5. **Additional Enhancements** ✓
   - Dark/Light theme toggle
   - Accessibility features
   - Image error handling
   - Responsive design 