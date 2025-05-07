import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service that handles image preloading and caching to improve user experience
 * Provides browser/server compatibility for SSR
 */
@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {
  // Cache maps to store loaded images and loading states
  private cache: Map<string, any> = new Map();
  private loadingImages: Map<string, boolean> = new Map();
  
  // Flag to check if we're in browser environment
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Preload a single image and cache it for future use
   * @param url URL of the image to preload
   * @returns Observable that completes when image is loaded
   */
  preloadImage(url: string): Observable<string> {
    // If not in browser, just return the URL
    if (!this.isBrowser) {
      return of(url);
    }

    // If already cached, return immediately
    if (this.cache.has(url)) {
      return of(url);
    }

    // If currently loading, wait
    if (this.loadingImages.get(url)) {
      return of(url);
    }

    // Mark as loading
    this.loadingImages.set(url, true);

    // Create a new image to load (only in browser)
    return new Observable<string>(observer => {
      if (this.isBrowser) {
        const img = new Image();
        
        // Handle successful load
        img.onload = () => {
          this.cache.set(url, img);
          this.loadingImages.set(url, false);
          observer.next(url);
          observer.complete();
        };

        // Handle load error
        img.onerror = () => {
          this.loadingImages.set(url, false);
          observer.error(`Failed to load image: ${url}`);
        };

        // Start loading the image
        img.src = url;

        // Return cleanup function
        return {
          unsubscribe() {
            if (img.src) {
              img.src = '';
            }
          }
        };
      } else {
        // Simple completion for non-browser environments
        observer.next(url);
        observer.complete();
        return { unsubscribe() {} };
      }
    }).pipe(
      catchError(() => of('error'))
    );
  }

  /**
   * Preload multiple images at once
   * @param urls Array of image URLs to preload
   * @returns Observable that completes when operation is finished
   */
  preloadImages(urls: string[]): Observable<string[]> {
    // Skip if not in browser environment
    if (!this.isBrowser) {
      return of(urls);
    }

    // Filter out duplicates and empty strings
    const uniqueUrls = [...new Set(urls)].filter(url => url && url.trim() !== '');
    
    if (uniqueUrls.length === 0) {
      return of([]);
    }

    // Trigger preloads in background
    uniqueUrls.forEach(url => {
      this.preloadImage(url).subscribe();
    });

    // Return original URLs regardless of load status
    return of(uniqueUrls);
  }

  /**
   * Check if an image is already cached
   * @param url URL to check in cache
   * @returns boolean indicating if image is cached
   */
  isImageCached(url: string): boolean {
    if (!this.isBrowser) return false;
    return this.cache.has(url);
  }

  /**
   * Clear the image cache
   */
  clearCache(): void {
    this.cache.clear();
    this.loadingImages.clear();
  }
} 