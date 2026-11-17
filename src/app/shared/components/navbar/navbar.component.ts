import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Brand -->
        <a routerLink="/tables" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-zinc-900 border border-emerald-500/30 flex items-center justify-center shadow-inner group-hover:border-emerald-400/50 transition-colors">
            <span class="text-sm font-bold text-emerald-400">A</span>
          </div>
          <div class="flex flex-col">
            <span class="text-base font-bold text-white tracking-wider leading-none">AURUM</span>
            <span class="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mt-0.5">POS &amp; Dining</span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1 bg-zinc-900/70 p-1 rounded-xl border border-zinc-800/80">
          @if (authService.role() === 'Admin') {
            <a
              routerLink="/dashboard"
              routerLinkActive="!bg-zinc-800 !text-white shadow-sm"
              class="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-all"
            >
              Dashboard
            </a>
          } @else if (authService.role() === 'Staff') {
            <a
              routerLink="/staff"
              routerLinkActive="!bg-zinc-800 !text-white shadow-sm"
              class="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-all"
            >
              Staff Console
            </a>
          } @else if (authService.role() === 'Customer') {
            <a
              routerLink="/customer"
              routerLinkActive="!bg-zinc-800 !text-white shadow-sm"
              class="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-all"
            >
              Customer Dashboard
            </a>
          }
          @if (authService.role() === 'Admin' || authService.role() === 'Staff') {
            <a
              routerLink="/tables"
              routerLinkActive="!bg-zinc-800 !text-white shadow-sm"
              class="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-all"
            >
              Tables
            </a>
          }
          @if (authService.role() === 'Admin' || authService.role() === 'Customer') {
            <a
              routerLink="/menu"
              routerLinkActive="!bg-zinc-800 !text-white shadow-sm"
              class="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-all"
            >
              Menu
            </a>
          }
          @if (authService.role() === 'Admin' || authService.role() === 'Staff') {
            <a
              routerLink="/orders"
              routerLinkActive="!bg-zinc-800 !text-white shadow-sm"
              class="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-all"
            >
              Orders
            </a>
          }
          @if (authService.role() === 'Admin' || authService.role() === 'Staff') {
            <a
              routerLink="/billing"
              routerLinkActive="!bg-zinc-800 !text-white shadow-sm"
              class="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-all"
            >
              Billing
            </a>
          }
        </div>

        <!-- Right User & Sign Out -->
        <div class="flex items-center gap-3">
          @if (authService.isAuthenticated()) {
            <div class="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs font-medium text-zinc-200">{{ authService.user()?.name }}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 uppercase tracking-wider">
                {{ authService.role() }}
              </span>
            </div>

            <button
              type="button"
              (click)="logout()"
              class="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-300 border border-zinc-800 hover:border-rose-800/60 text-xs font-medium transition-all active:scale-95 cursor-pointer"
              title="Sign Out"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>

            <!-- Mobile Hamburger -->
            <button
              type="button"
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              aria-label="Toggle Menu"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (mobileMenuOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          } @else {
            <a
              routerLink="/login"
              class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
            >
              Sign In
            </a>
          }
        </div>
      </div>

      <!-- Mobile Dropdown -->
      @if (mobileMenuOpen() && authService.isAuthenticated()) {
        <div class="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 space-y-1">
          <div class="flex items-center justify-between px-3 py-2 mb-2 rounded-lg bg-zinc-900/70 border border-zinc-800/80">
            <span class="text-xs font-medium text-zinc-200">{{ authService.user()?.name }}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 uppercase">
              {{ authService.role() }}
            </span>
          </div>
          @if (authService.role() === 'Admin') {
            <a routerLink="/dashboard" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-zinc-900 text-white" class="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white">Dashboard</a>
          } @else if (authService.role() === 'Staff') {
            <a routerLink="/staff" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-zinc-900 text-white" class="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white">Staff Console</a>
          } @else if (authService.role() === 'Customer') {
            <a routerLink="/customer" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-zinc-900 text-white" class="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white">Customer Dashboard</a>
          }
          @if (authService.role() === 'Admin' || authService.role() === 'Staff') {
            <a routerLink="/tables" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-zinc-900 text-white" class="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white">Tables</a>
          }
          @if (authService.role() === 'Admin' || authService.role() === 'Customer') {
            <a routerLink="/menu" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-zinc-900 text-white" class="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white">Menu</a>
          }
          @if (authService.role() === 'Admin' || authService.role() === 'Staff') {
            <a routerLink="/orders" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-zinc-900 text-white" class="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white">Orders</a>
          }
          @if (authService.role() === 'Admin' || authService.role() === 'Staff') {
            <a routerLink="/billing" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-zinc-900 text-white" class="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white">Billing</a>
          }
        </div>
      }
    </nav>
    <div class="h-16"></div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);
  readonly router = inject(Router);
  readonly mobileMenuOpen = signal(false);

  logout(): void {
    this.mobileMenuOpen.set(false);
    this.authService.logout();
    this.notificationService.info('You have been signed out.');
    this.router.navigate(['/login']);
  }
}
