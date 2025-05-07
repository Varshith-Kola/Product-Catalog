import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/product.service';

/**
 * Reusable component for displaying individual product information
 * Features:
 * - Displays product image, name, price, and description
 * - Has direct navigation to product details
 * - Emits selection events
 * - Handles broken images with fallbacks
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  /**
   * The product to display in this card
   * Required input from parent component
   */
  @Input() product!: Product;
  
  /**
   * Event emitted when the product is selected
   * Parent components can listen to this event
   */
  @Output() selected = new EventEmitter<Product>();
  
  /**
   * URL for fallback image when product image fails to load
   */
  private fallbackImageUrl = 'https://via.placeholder.com/500x300?text=Product+Image';

  /**
   * Handle product selection and emit the selected event
   */
  onSelect(): void {
    this.selected.emit(this.product);
  }
  
  /**
   * Handle image loading errors by providing fallback
   * Uses a retry mechanism before falling back to placeholder
   * @param event The error event from the img element
   */
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    
    // Store original source before attempting reload
    const originalSrc = imgElement.src;
    imgElement.src = '';
    
    // Delay reload attempt to prevent browser caching issues
    setTimeout(() => {
      // If original source was the product image, use fallback
      if (originalSrc === this.product.imageUrl) {
        imgElement.src = this.fallbackImageUrl;
      } else {
        // Try original URL again or use fallback
        imgElement.src = this.product.imageUrl || this.fallbackImageUrl;
      }
    }, 100);
  }
}
