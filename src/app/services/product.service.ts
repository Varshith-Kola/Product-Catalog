import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { ImageCacheService } from './image-cache.service';

/**
 * Interface representing a product in the application
 */
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

/**
 * Mock product data for demonstration purposes
 * In a real application, this would come from an API
 */
export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro',
    price: 1299.99,
    description: 'High-performance laptop with 16GB RAM and 512GB SSD.',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: 'Smart Home Hub',
    price: 199.99,
    description: 'Control your entire home with voice commands and automate routines for comfort and efficiency.',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: 'Wireless Headphones',
    price: 249.99,
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    name: 'Smart Watch',
    price: 399.99,
    description: 'Fitness tracker with heart rate monitor and GPS.',
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 5,
    name: 'Wireless Speaker',
    price: 129.99,
    description: 'Portable Bluetooth speaker with waterproof design.',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 6,
    name: 'Digital Camera',
    price: 749.99,
    description: 'Professional DSLR camera with 24MP sensor and 4K video recording.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 7,
    name: 'Gaming Console',
    price: 499.99,
    description: 'Next-generation gaming console with 1TB storage and 4K gaming capabilities.',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 8,
    name: 'Tablet Pro',
    price: 649.99,
    description: 'Ultra-thin tablet with 12-inch display, stylus support, and all-day battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  }
];

/**
 * Service responsible for providing product data throughout the application
 * Uses RxJS Observables to simulate asynchronous data fetching (like an API)
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private imageCacheService: ImageCacheService) {
    // Preload all product images when service is initialized
    this.preloadAllProductImages();
  }

  /**
   * Preload all product images at once to improve user experience
   * Filters out undefined imageUrls
   */
  private preloadAllProductImages(): void {
    const imageUrls = PRODUCTS.map(product => product.imageUrl)
      .filter(url => url !== undefined) as string[];
    
    this.imageCacheService.preloadImages(imageUrls).subscribe();
  }

  /**
   * Get all products with simulated API delay
   * @returns Observable of Product array
   */
  getProducts(): Observable<Product[]> {
    // Simulate network delay with 500ms
    return of(PRODUCTS).pipe(
      delay(500),
      switchMap(products => {
        // Preload images for better user experience
        const imageUrls = products
          .map(product => product.imageUrl)
          .filter(url => url !== undefined) as string[];
        
        return this.imageCacheService.preloadImages(imageUrls).pipe(
          tap(() => console.log('Product images preloaded')),
          switchMap(() => of(products))
        );
      })
    );
  }

  /**
   * Get a specific product by ID
   * @param id The product ID to retrieve
   * @returns Observable of Product or undefined if not found
   */
  getProduct(id: number): Observable<Product | undefined> {
    const product = PRODUCTS.find(product => product.id === id);
    
    if (product && product.imageUrl) {
      // Preload the specific product image
      return this.imageCacheService.preloadImage(product.imageUrl).pipe(
        delay(300), // Simulate network delay
        switchMap(() => of(product))
      );
    }
    
    return of(product).pipe(
      delay(300) // Simulate network delay
    );
  }
}
