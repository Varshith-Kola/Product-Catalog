import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

/**
 * Root component for the Product App
 * Handles application-wide functionality like theme switching
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'product-app';
  isDarkTheme = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Initialize the component and check for saved theme preferences
   */
  ngOnInit(): void {
    if (!this.isBrowser) return;
    
    // Check if user previously set a theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
      this.enableDarkTheme();
    } else if (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // If no saved preference but system prefers dark mode
      this.enableDarkTheme();
    }
  }

  /**
   * Toggle between light and dark themes
   * Saves preference to localStorage for persistence
   */
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    
    if (this.isDarkTheme) {
      this.enableDarkTheme();
    } else {
      this.disableDarkTheme();
    }
    
    // Save preference to localStorage
    if (this.isBrowser) {
      localStorage.setItem('darkTheme', this.isDarkTheme.toString());
    }
  }

  /**
   * Enable dark theme by adding the dark-theme class to body
   */
  private enableDarkTheme(): void {
    if (this.isBrowser) {
      document.body.classList.add('dark-theme');
    }
    this.isDarkTheme = true;
  }

  /**
   * Disable dark theme by removing the dark-theme class from body
   */
  private disableDarkTheme(): void {
    if (this.isBrowser) {
      document.body.classList.remove('dark-theme');
    }
    this.isDarkTheme = false;
  }
}
