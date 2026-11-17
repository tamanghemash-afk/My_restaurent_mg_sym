import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-zinc-950">
      <!-- Ambient Background Glows -->
      <div class="pointer-events-none absolute -top-24 left-1/4 w-[520px] h-[320px] bg-emerald-600/15 rounded-full blur-[130px]"></div>
      <div class="pointer-events-none absolute -bottom-24 right-1/4 w-[520px] h-[320px] bg-zinc-700/20 rounded-full blur-[130px]"></div>

      <div class="w-full max-w-md relative z-10">
        <!-- Card -->
        <div class="p-8 sm:p-9 rounded-3xl border border-zinc-800/90 bg-zinc-900/85 backdrop-blur-xl shadow-2xl shadow-black/60 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>

          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-zinc-800 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-950/30">
              <span class="text-base font-bold text-emerald-400">A</span>
            </div>
            <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">Aurum Hospitality</span>
            <h1 class="text-2xl font-bold text-white tracking-tight mt-1">Welcome Back</h1>
            <p class="text-xs text-zinc-400 mt-1.5">Sign in to access the restaurant management console</p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label for="login-email" class="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div class="relative">
                <input
                  id="login-email"
                  type="email"
                  [(ngModel)]="credentials.email"
                  name="email"
                  autocomplete="email"
                  required
                  placeholder="admin@aurum.com"
                  class="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label for="login-password" class="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div class="relative">
                <input
                  id="login-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  [(ngModel)]="credentials.password"
                  name="password"
                  autocomplete="current-password"
                  required
                  placeholder="••••••••••••"
                  class="w-full pl-4 pr-11 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute inset-y-0 right-0 px-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  @if (showPassword()) {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  } @else {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  }
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between pt-0.5">
              <label class="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  [(ngModel)]="rememberMe"
                  name="rememberMe"
                  class="w-4 h-4 rounded border-zinc-700 bg-zinc-950 accent-emerald-500 cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                (click)="fillDemo('admin@aurum.com')"
                class="text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Use Admin Demo
              </button>
            </div>

            @if (authService.error()) {
              <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-2.5">
                <svg class="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs text-rose-300 leading-relaxed">{{ authService.error() }}</p>
              </div>
            }

            <button
              type="submit"
              class="w-full py-3.5 px-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
              [disabled]="!credentials.email.trim() || !credentials.password || authService.isLoading()"
            >
              @if (authService.isLoading()) {
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              } @else {
                <span>Sign In</span>
              }
            </button>
          </form>

          <!-- Quick Demo Access -->
          <div class="mt-7 pt-6 border-t border-zinc-800/80">
            <p class="text-[11px] font-mono uppercase tracking-wider text-zinc-500 text-center mb-3">
              Quick Demo Access (Click to Autofill)
            </p>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                (click)="fillDemo('admin@aurum.com')"
                class="p-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
              >
                <div class="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">Admin</div>
                <div class="text-[10px] font-mono text-zinc-500 truncate mt-0.5">Full Access</div>
              </button>
              <button
                type="button"
                (click)="fillDemo('staff@aurum.com')"
                class="p-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
              >
                <div class="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">Staff</div>
                <div class="text-[10px] font-mono text-zinc-500 truncate mt-0.5">Floor &amp; POS</div>
              </button>
              <button
                type="button"
                (click)="fillDemo('customer@aurum.com')"
                class="p-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
              >
                <div class="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">Customer</div>
                <div class="text-[10px] font-mono text-zinc-500 truncate mt-0.5">Guest View</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class LoginComponent {
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);
  readonly router = inject(Router);

  credentials = { email: '', password: '' };
  rememberMe = true;
  readonly showPassword = signal(false);

  fillDemo(email: string): void {
    this.authService.clearError();
    this.credentials = {
      email,
      password: 'password123',
    };
  }

  async onSubmit(): Promise<void> {
    this.authService.clearError();
    const cleanEmail = this.credentials.email.trim().toLowerCase();
    try {
      await this.authService.login({
        email: cleanEmail,
        password: this.credentials.password,
      }, this.rememberMe);
      const user = this.authService.user();
      this.notificationService.success(`Welcome back, ${user?.name ?? 'User'}!`);
      const role = user?.role;
      if (role === 'Admin') {
        this.router.navigate(['/dashboard']);
      } else if (role === 'Staff') {
        this.router.navigate(['/staff']);
      } else {
        this.router.navigate(['/customer']);
      }
    } catch {
      // Error state is handled and shown inline by AuthService
    }
  }
}
