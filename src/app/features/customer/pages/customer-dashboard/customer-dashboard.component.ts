import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MenuItem, OrderItem } from '../../../../core/models';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <div class="max-w-5xl mx-auto p-6">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Welcome, {{ userName() }}</h1>
          <p class="text-xs text-zinc-500 uppercase tracking-wider">{{ authService.role() }}</p>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-[10px] font-mono text-zinc-400 uppercase">Table</label>
          <select
            [(ngModel)]="tableId"
            class="bg-zinc-950 border border-zinc-800 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 w-24"
          >
            @for (t of restaurantService.allTables(); track t.id) {
              <option [value]="t.id">Table {{ t.id }}</option>
            }
          </select>
        </div>
      </div>

      <h2 class="text-xs font-semibold text-white uppercase tracking-wider mb-3">Available Menu</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        @for (item of availableMenuItems(); track item.id) {
          <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div class="flex items-start justify-between mb-2">
              <div class="text-[10px] font-mono text-zinc-500 uppercase">{{ item.category }}</div>
            </div>
            <h3 class="text-sm font-semibold text-white mb-1">{{ item.name }}</h3>
            <p class="text-[10px] text-zinc-500 mb-3 leading-relaxed">{{ item.description || 'No description' }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-white">\${{ item.price.toFixed(2) }}</span>
              <app-button variant="primary" size="sm" (onClick)="addToOrder(item)">Add</app-button>
            </div>
          </div>
        } @empty {
          <div class="col-span-full text-center py-8 text-xs text-zinc-500">No menu items available.</div>
        }
      </div>

      @if (cart().length > 0) {
        <div class="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <h3 class="text-xs font-semibold text-white uppercase mb-3">Your Order</h3>
          <div class="space-y-2 max-h-60 overflow-y-auto pr-2 mb-4">
            @for (line of cart(); track line.menuItem.id) {
              <div class="flex items-center justify-between p-2 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-zinc-300">{{ line.menuItem.name }}</span>
                  <span class="text-[10px] font-mono text-zinc-500 ml-auto">\${{ (line.menuItem.price * line.quantity).toFixed(2) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <button (click)="changeQty(line.menuItem.id, -1)" class="w-5 h-5 rounded bg-zinc-800 text-[10px] text-zinc-300">−</button>
                  <span class="w-4 text-center text-[10px] text-white">{{ line.quantity }}</span>
                  <button (click)="changeQty(line.menuItem.id, 1)" class="w-5 h-5 rounded bg-zinc-800 text-[10px] text-zinc-300">+</button>
                </div>
              </div>
            }
          </div>
          <div class="flex justify-between text-sm font-bold text-white mb-4">
            <span>Total</span>
            <span>\${{ grandTotal().toFixed(2) }}</span>
          </div>
          <div class="flex gap-2">
            <app-button variant="outline" size="sm" [flex]="true" (onClick)="clearCart()">Clear</app-button>
            <app-button variant="primary" size="sm" [flex]="true" (onClick)="submitOrder()" [disabled]="cart().length === 0">Place Order</app-button>
          </div>
        </div>
      }

      <h2 class="text-xs font-semibold text-white uppercase tracking-wider mb-3 mt-8">Your Recent Orders</h2>
      <div class="space-y-2">
        @for (order of recentOrders(); track order.id) {
          <div class="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <div class="text-xs text-zinc-300">Table {{ order.tableNumber }} · {{ order.items.length }} items</div>
            <div class="text-xs font-mono text-zinc-500">\${{ order.total.toFixed(2) }} · {{ order.status }}</div>
          </div>
        } @empty {
          <p class="text-xs text-zinc-500 text-center py-4">No orders yet.</p>
        }
      </div>
    </div>
  `,
  styles: `:host { display: contents; }`,
})
export class CustomerDashboardComponent {
  readonly restaurantService = inject(RestaurantService);
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);
  readonly router = inject(Router);

  readonly cart = signal<OrderItem[]>([]);
  tableId = 1;

  readonly userName = computed(() => this.authService.user()?.name ?? 'Guest');

  readonly availableMenuItems = computed(() =>
    this.restaurantService.menuItems().filter(i => i.available)
  );

  readonly grandTotal = computed(() =>
    this.cart().reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
  );

  readonly recentOrders = computed(() =>
    [...this.restaurantService.allOrders()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  );

  addToOrder(menuItem: MenuItem): void {
    this.cart.update(items => {
      const existing = items.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return items.map(i => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { id: crypto.randomUUID(), menuItem, menuItemId: menuItem.id, quantity: 1, priceAtOrder: menuItem.price }];
    });
    this.notificationService.info(`${menuItem.name} added`);
  }

  changeQty(id: string, delta: number): void {
    this.cart.update(items =>
      items
        .map(i => i.menuItem.id === id ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0) as OrderItem[]
    );
  }

  clearCart(): void { this.cart.set([]); }

  submitOrder(): void {
    if (this.cart().length === 0) return;
    const existing = this.restaurantService.getActiveOrderForTable(this.tableId);
    if (existing) {
      this.notificationService.warning(`Table ${this.tableId} already has an active order`);
      return;
    }
    const items = this.cart().map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity, notes: i.notes }));
    const order = this.restaurantService.placeOrder({ tableId: this.tableId, items }, this.authService.user()?.name);
    if (order) {
      this.notificationService.success(`Order placed for Table ${order.tableNumber}`);
      this.cart.set([]);
    }
  }
}
