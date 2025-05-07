import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

/**
 * Component for displaying detailed information about a specific product
 * Features:
 * - Displays full product details
 * - Handles loading states and errors
 * - Provides navigation back to product list
 * - Handles image loading errors
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  /** The product being displayed */
  product: Product | undefined;
  
  /** Loading state indicator */
  loading = false;
  
  /** Error message for display (if any) */
  errorMessage = '';
  
  /** Fallback image URL for when product image fails to load */
  private fallbackImageUrl = 'https://via.placeholder.com/800x600?text=Product+Image';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  /**
   * Initialize component by fetching product data
   */
  ngOnInit(): void {
    this.getProduct();
  }

  /**
   * Fetch product details from the service based on route parameter
   * Handles validation, loading state, and error cases
   */
  getProduct(): void {
    this.loading = true;
    const idParam = this.route.snapshot.paramMap.get('id');
    
    // Validate product ID exists in URL
    if (!idParam) {
      this.errorMessage = 'Invalid product ID';
      this.loading = false;
      return;
    }

    // Validate product ID is a number
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      this.errorMessage = 'Invalid product ID';
      this.loading = false;
      return;
    }

    // Fetch product by ID
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        if (!product) {
          this.errorMessage = 'Product not found';
        }
      },
      error: (error) => {
        console.error('Error fetching product details', error);
        this.errorMessage = 'Error loading product details';
        this.loading = false;
      }
    });
  }

  /**
   * Navigate back to the product list
   */
  goBack(): void {
    this.router.navigate(['/products']);
  }
  
  /**
   * Handle image loading errors by providing fallback
   * @param event The error event from the img element
   */
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    
    // Store original source for comparison
    const originalSrc = imgElement.src;
    imgElement.src = '';
    
    // Delay reload attempt to prevent browser caching issues
    setTimeout(() => {
      if (this.product && originalSrc === this.product.imageUrl) {
        // If original source was product image, use fallback
        imgElement.src = this.fallbackImageUrl;
      } else if (this.product) {
        // Try original URL again or use fallback
        imgElement.src = this.product.imageUrl || this.fallbackImageUrl;
      } else {
        // If no product available, use fallback
        imgElement.src = this.fallbackImageUrl;
      }
    }, 100);
  }
}
