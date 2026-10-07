import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);
  protected readonly pageTitle = computed(() => {
    const segment = this.currentUrl().split('?')[0].split('/').filter(Boolean);
    const title = segment[0] || 'dashboard';
    return title.charAt(0).toUpperCase() + title.slice(1);
  });
  protected readonly pageDescription = computed(() => this.pageTitle() === 'Dashboard'
    ? "Welcome back. Here's what's happening today."
    : `Manage your ${this.pageTitle().toLowerCase()} and keep your business moving.`);

  constructor() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntilDestroyed(),
    ).subscribe((event) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }
}
