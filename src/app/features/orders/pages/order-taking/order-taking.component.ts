import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { MenuItem, OrderItem } from '../../../../core/models';
import { TAX_RATE } from '../../../../core/constants';

@Component({
  selector: 'app-order-taking',
  standalone: true,
  imports: [FormsModule, ButtonComponent, LoaderComponent],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Take Order</h1>
          <p class="text-sm text-zinc-400 mt-1">Select table and attach menu choices</p>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Table</label>
          <select
            [(ngModel)]="selectedTableId"
            class="bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-zinc-600 transition-colors"
          >
            @for (t of restaurantService.allTables(); track t.id) {
              <option [value]="t.id">Table 0{{ t.id }}</option>
            }
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-7 space-y-6">
          <div class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <h2 class="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Menu</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              @if (isLoading()) {
                <div class="col-span-full flex justify-center py-20">
                  <app-loader size="md" message="Loading menu..." />
                </div>
              } @else if (restaurantService.menuItems().length === 0) {
                <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <p class="text-zinc-500 text-sm">No menu items available.</p>
                </div>
              } @else {
                @for (item of restaurantService.menuItems(); track item.id) {
                  @if (item.available) {
                    <div
                      class="menu-item p-4 rounded-xl border border-zinc-800/50 bg-zinc-900 hover:border-zinc-600/50 hover:bg-zinc-800 transition-colors group cursor-pointer"
                    >
                      <div class="flex items-center justify-between mb-3">
                        <div>
                          <h4 class="text-sm font-medium text-white">{{ item.name }}</h4>
                          <p class="text-xs font-mono text-zinc-400">\${{ item.price.toFixed(2) }}</p>
                        </div>
                      <button
                        (click)="addToOrder(item)"
                        class="w-8 h-8 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors active:scale-90"
                      >
                          +
                        </button>
                      </div>
                    </div>
                  }
                }
              }
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 sticky top-24">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-sm font-semibold text-white uppercase tracking-wider">Active Selection</h2>
              <span class="text-[10px] font-mono text-zinc-500">Table 0{{ selectedTableId }}</span>
            </div>
            <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              @for (line of cart(); track line.menuItem.id) {
                <div class="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-zinc-300">{{ line.menuItem.name }}</span>
                    <span class="text-xs font-mono text-zinc-500 ml-auto">\${{ (line.menuItem.price * line.quantity).toFixed(2) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button
                      (click)="updateQty(line.menuItem.id, -1)"
                      class="w-6 h-6 rounded bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors"
                    >
                      −
                    </button>
                    <span class="w-5 text-center text-xs font-mono text-white">{{ line.quantity }}</span>
                    <button
                      (click)="updateQty(line.menuItem.id, 1)"
                      class="w-6 h-6 rounded bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              } @empty {
                <p class="text-xs text-zinc-500 text-center py-8">No items added</p>
              }
            </div>
            <div class="mt-6 pt-6 border-t border-zinc-800">
              <div class="flex justify-between mb-1">
                <span class="text-sm text-zinc-400">Subtotal</span>
                <span class="text-sm font-mono text-white">\${{ orderTotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-xs text-zinc-500">Tax (8%)</span>
                <span class="text-xs font-mono text-zinc-400">\${{ taxTotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mt-2 pt-2 border-t border-zinc-800">
                <span class="text-sm font-bold text-white">Total</span>
                <span class="text-sm font-bold text-white">\${{ grandTotal().toFixed(2) }}</span>
              </div>
              <app-button
                variant="primary"
                size="lg"
                type="button"
                fullWidth
                (onClick)="submitOrder()"
                [disabled]="cart().length === 0"
                [loading]="isSubmitting()"
              >
                Submit Order
              </app-button>
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
export class OrderTakingComponent {
  readonly restaurantService = inject(RestaurantService);
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);
  readonly router = inject(Router);

  selectedTableId = 1;
  readonly cart = signal<OrderItem[]>([]);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);

  readonly orderTotal = computed(() =>
    this.cart().reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
  );

  readonly taxTotal = computed(() => Math.round(this.orderTotal() * TAX_RATE * 100) / 100);

  readonly grandTotal = computed(() => this.orderTotal() + this.taxTotal());

  addToOrder(menuItem: MenuItem): void {
    this.cart.update(items => {
      const existing = items.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return items.map(i =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { menuItem, quantity: 1, id: crypto.randomUUID(), menuItemId: menuItem.id, priceAtOrder: menuItem.price }];
    });
    this.notificationService.info(`${menuItem.name} added to order`);
  }

  updateQty(id: string, delta: number): void {
    this.cart.update(items =>
      items
        .map(i => {
          if (i.menuItem.id === id) {
            const qty = i.quantity + delta;
            return qty > 0 ? { ...i, quantity: qty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  }

  async submitOrder(): Promise<void> {
    if (this.cart().length === 0) return;

    const existingOrder = this.restaurantService.getActiveOrderForTable(this.selectedTableId);
    if (existingOrder) {
      this.notificationService.warning(`Table ${this.selectedTableId} already has an active order`);
      return;
    }

    this.isSubmitting.set(true);
    try {
      const items = this.cart().map(i => ({
        menuItemId: i.menuItem.id,
        quantity: i.quantity,
        notes: i.notes,
      }));

      const order = this.restaurantService.placeOrder(
        { tableId: this.selectedTableId, items },
        this.authService.user()?.name
      );

      if (order) {
        this.notificationService.success(`Order submitted for Table ${order.tableNumber}`);
        this.cart.set([]);
        this.router.navigate(['/billing']);
      }
    } catch {
      this.notificationService.error('Failed to place order');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
