import { Injectable, signal, computed } from '@angular/core';
import { User, AuthCredentials, AuthState } from '../models/auth.model';

const STORAGE_KEY = 'aurum_auth_user';
const DEMO_USERS: User[] = [
  { id: '1', email: 'admin@aurum.com', name: 'Admin User', role: 'Admin' },
  { id: '2', email: 'staff@aurum.com', name: 'Staff User', role: 'Staff' },
  { id: '3', email: 'customer@aurum.com', name: 'Customer User', role: 'Customer' },
];

const DEMO_PASSWORD = 'password123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private state = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);
  readonly role = computed(() => this.state().user?.role ?? null);

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        this.state.set({ user, isAuthenticated: true, isLoading: false, error: null });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  async login(credentials: AuthCredentials, rememberMe = true): Promise<void> {
    this.state.update((prev: AuthState) => ({ ...prev, isLoading: true, error: null }));

    await new Promise(resolve => setTimeout(resolve, 450));

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      const msg = 'No account found with this email address.';
      this.state.update((prev: AuthState) => ({ ...prev, isLoading: false, error: msg }));
      throw new Error(msg);
    }

    if (credentials.password !== DEMO_PASSWORD) {
      const msg = 'Incorrect password. Please try again.';
      this.state.update((prev: AuthState) => ({ ...prev, isLoading: false, error: msg }));
      throw new Error(msg);
    }

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.removeItem(STORAGE_KEY);
    }

    this.state.set({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    this.state.set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }

  clearError(): void {
    this.state.update((prev: AuthState) => ({ ...prev, error: null }));
  }
}
