import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    <app-toast />
    @if (authService.isAuthenticated()) {
      <app-navbar />
    }
    <main class="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  readonly authService = inject(AuthService);
}
