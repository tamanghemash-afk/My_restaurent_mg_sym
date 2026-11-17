import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <app-button variant="primary" size="sm" (onClick)="refresh()">Refresh</app-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div class="text-xs text-zinc-500 uppercase mb-1">Total Orders</div>
          <div class="text-xl font-bold text-white">{{ stats().totalOrders }}</div>
        </div>
        <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div class="text-xs text-emerald-400 uppercase mb-1">Active Orders</div>
          <div class="text-xl font-bold text-emerald-400">{{ stats().activeOrders }}</div>
        </div>
        <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div class="text-xs text-zinc-400 uppercase mb-1">Completed Orders</div>
          <div class="text-xl font-bold text-zinc-300">{{ stats().completedOrders }}</div>
        </div>
        <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div class="text-xs text-blue-400 uppercase mb-1">Total Revenue</div>
          <div class="text-xl font-bold text-blue-400">\${{ stats().totalRevenue.toFixed(2) }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <h3 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Tables</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs p-2 rounded bg-zinc-950/50">
              <span class="text-zinc-300">Available</span>
              <span class="text-emerald-400 font-mono">{{ stats().availableTables }}</span>
            </div>
            <div class="flex items-center justify-between text-xs p-2 rounded bg-zinc-950/50">
              <span class="text-zinc-300">Occupied</span>
              <span class="text-amber-400 font-mono">{{ stats().occupiedTables }}</span>
            </div>
          </div>
          <div class="mt-4">
            <app-button variant="outline" size="sm" [flex]="true" (onClick)="goToTables()">Manage Tables</app-button>
          </div>
        </div>

        <div class="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <h3 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Menu</h3>
          <div class="text-xs text-zinc-400 mb-3">{{ stats().totalTables }} tables · {{ stats().activeOrders }} active orders</div>
          <app-button variant="primary" size="sm" [flex]="true" (onClick)="goToMenu()">Manage Menu</app-button>
        </div>

        <div class="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <h3 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Orders</h3>
          <div class="space-y-2">
            @for (order of recentOrders(); track order.id) {
              <div class="flex items-center justify-between text-xs p-2 rounded bg-zinc-950/50">
                <div>
                  <div class="text-zinc-300">Table {{ order.tableNumber }}</div>
                  <div class="text-[10px] text-zinc-500">{{ order.items.length }} items</div>
                </div>
                <div class="text-[10px] font-mono text-zinc-400 capitalize">{{ order.status }}</div>
              </div>
            } @empty {
              <p class="text-xs text-zinc-500 text-center py-2">No orders.</p>
            }
          </div>
          <div class="mt-4">
            <app-button variant="outline" size="sm" [flex]="true" (onClick)="goToOrders()">View All Orders</app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `:host { display: contents; }`,
})
export class DashboardComponent {
  readonly restaurantService = inject(RestaurantService);
  readonly router = inject(Router);

  readonly stats = this.restaurantService.dashboardStats;

  readonly recentOrders = computed(() =>
    [...this.restaurantService.allOrders()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  );

  refresh(): void { window.location.reload(); }

  goToTables(): void { this.router.navigate(['/tables']); }
  goToMenu(): void { this.router.navigate(['/menu']); }
  goToOrders(): void { this.router.navigate(['/orders']); }
  goToBilling(): void { this.router.navigate(['/billing']); }
}
