import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TableCardComponent } from '../../../../features/tables/components/table-card/table-card.component';
import { MenuItem, OrderItem } from '../../../../core/models';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [FormsModule, ButtonComponent, TableCardComponent],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white tracking-tight">Staff Console</h1>
        <app-button variant="primary" size="sm" (onClick)="refresh()">Refresh</app-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div class="text-xs text-zinc-500 uppercase mb-1">Tables</div>
          <div class="text-xl font-bold text-white">{{ stats().totalTables }}</div>
        </div>
        <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div class="text-xs text-emerald-400 uppercase mb-1">Available</div>
          <div class="text-xl font-bold text-emerald-400">{{ stats().availableTables }}</div>
        </div>
        <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div class="text-xs text-amber-400 uppercase mb-1">Occupied</div>
          <div class="text-xl font-bold text-amber-400">{{ stats().occupiedTables }}</div>
        </div>
        <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div class="text-xs text-zinc-400 uppercase mb-1">Active Orders</div>
          <div class="text-xl font-bold text-zinc-300">{{ stats().activeOrders }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Tables -->
        <div class="lg:col-span-5 space-y-4">
          <h3 class="text-xs font-semibold text-white uppercase tracking-wider">Floor &amp; Tables</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            @for (table of restaurantService.allTables(); track table.id) {
              <app-table-card
                [table]="table"
                (onReserve)="handleReserve($event)"
                (onRelease)="handleRelease($event)"
              />
            } @empty {
              <p class="col-span-full text-xs text-zinc-500 text-center py-8">No tables.</p>
            }
          </div>
        </div>

        <!-- Order Taking -->
        <div class="lg:col-span-7 space-y-4">
          <h3 class="text-xs font-semibold text-white uppercase tracking-wider">Take Order</h3>
          <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div class="flex items-center gap-3 mb-4">
              <label class="text-[10px] font-mono text-zinc-400 uppercase">Table</label>
              <select
                [(ngModel)]="orderTableId"
                class="flex-1 bg-zinc-950 border border-zinc-800 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
              >
                @for (t of restaurantService.allTables(); track t.id) {
                  <option [value]="t.id">Table {{ t.id }}</option>
                }
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              @for (item of availableMenuItems(); track item.id) {
                <div class="p-2 rounded-lg border border-zinc-800/50 bg-zinc-950 hover:border-zinc-700 transition-colors">
                  <div class="flex items-center justify-between mb-1">
                    <div>
                      <div class="text-xs font-medium text-white">{{ item.name }}</div>
                      <div class="text-[10px] font-mono text-zinc-500">\${{ item.price.toFixed(2) }}</div>
                    </div>
                    <button
                      (click)="addItem(item)"
                      class="w-6 h-6 rounded bg-emerald-600 text-[10px] text-white font-bold hover:bg-emerald-500"
                    >
                      +
                    </button>
                  </div>
                </div>
              }
            </div>

            @if (cart().length > 0) {
              <div class="mt-4 p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                <div class="space-y-2">
                  @for (line of cart(); track line.menuItem.id) {
                    <div class="flex items-center justify-between text-xs">
                      <div class="flex items-center gap-2">
                        <span class="text-zinc-300">{{ line.menuItem.name }}</span>
                        <span class="text-zinc-500 ml-auto">\${{ (line.menuItem.price * line.quantity).toFixed(2) }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <button (click)="changeQty(line.menuItem.id, -1)" class="w-4 h-4 rounded bg-zinc-800 text-[10px] text-zinc-300">−</button>
                        <span class="w-3 text-center text-[10px] text-white">{{ line.quantity }}</span>
                        <button (click)="changeQty(line.menuItem.id, 1)" class="w-4 h-4 rounded bg-zinc-800 text-[10px] text-zinc-300">+</button>
                      </div>
                    </div>
                  }
                  <div class="mt-2 pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                    <span>Total</span>
                    <span>\${{ grandTotal().toFixed(2) }}</span>
                  </div>
                </div>
                <div class="mt-3 flex gap-2">
                  <app-button variant="outline" size="sm" [flex]="true" (onClick)="clearCart()">Clear</app-button>
                  <app-button variant="primary" size="sm" [flex]="true" (onClick)="submitOrder()" [disabled]="cart().length === 0">Submit</app-button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Active Orders -->
        <div class="lg:col-span-12">
          <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xs font-semibold text-white uppercase tracking-wider">Active Orders</h3>
              <app-button variant="outline" size="sm" (onClick)="goToBilling()">Billing</app-button>
            </div>
            <div class="space-y-2">
              @for (order of activeOrders(); track order.id) {
                <div class="p-2 rounded-lg border border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
                  <div>
                    <div class="text-xs font-mono text-zinc-400">Table {{ order.tableNumber }}</div>
                    <div class="text-xs font-bold text-white capitalize">{{ order.status }}</div>
                  </div>
                  <div class="text-xs font-mono text-zinc-300">{{ order.items.length }} items · \${{ order.total.toFixed(2) }}</div>
                </div>
              } @empty {
                <p class="text-xs text-zinc-500 text-center py-4">No active orders.</p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `:host { display: contents; }`,
})
export class StaffDashboardComponent {
  readonly restaurantService = inject(RestaurantService);
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);
  readonly router = inject(Router);

  readonly stats = this.restaurantService.dashboardStats;
  readonly orderTableId = 1;
  readonly cart = signal<OrderItem[]>([]);

  readonly availableMenuItems = computed(() =>
    this.restaurantService.menuItems().filter(i => i.available)
  );

  readonly grandTotal = computed(() =>
    this.cart().reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
  );

  readonly activeOrders = computed(() =>
    [...this.restaurantService.allOrders()]
      .filter(o => o.status === 'Active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  refresh(): void { window.location.reload(); }

  handleReserve(tableId: number): void {
    const t = this.restaurantService.getTable(tableId);
    if (t?.status === 'Available') {
      this.restaurantService.updateTableStatus(tableId, 'Reserved');
      this.notificationService.success(`Table ${t.id} reserved`);
    }
  }

  handleRelease(tableId: number): void {
    const t = this.restaurantService.getTable(tableId);
    if (t?.status === 'Reserved') {
      this.restaurantService.updateTableStatus(tableId, 'Available');
      this.notificationService.success(`Table ${t.id} released`);
    }
  }

  addItem(menuItem: MenuItem): void {
    this.cart.update(items => {
      const existing = items.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return items.map(i => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { id: crypto.randomUUID(), menuItem, menuItemId: menuItem.id, quantity: 1, priceAtOrder: menuItem.price }];
    });
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
    const existing = this.restaurantService.getActiveOrderForTable(this.orderTableId);
    if (existing) {
      this.notificationService.warning(`Table ${this.orderTableId} already has an active order`);
      return;
    }
    const items = this.cart().map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity, notes: i.notes }));
    const order = this.restaurantService.placeOrder({ tableId: this.orderTableId, items }, this.authService.user()?.name);
    if (order) {
      this.notificationService.success(`Order for Table ${order.tableNumber}`);
      this.cart.set([]);
    }
  }

  goToBilling(): void { this.router.navigate(['/billing']); }
}
