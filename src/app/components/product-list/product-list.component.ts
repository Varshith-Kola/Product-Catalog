import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService, Product } from '../../services/product.service';

/**
 * Component responsible for displaying the list of products
 * Uses ProductCardComponent to render individual product cards
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  /**
   * Initialize the component by loading product data
   */
  ngOnInit(): void {
    this.getProducts();
  }

  /**
   * Fetch products from the service
   * Handles loading state and error cases
   */
  getProducts(): void {
    this.loading = true;
    this.productService.getProducts()
      .subscribe({
        next: (products) => {
          this.products = products;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching products', error);
          this.loading = false;
        }
      });
  }

  /**
   * Handle product selection and navigate to detail page
   * @param product The selected product
   */
  onProductSelected(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }
}
