import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TableCardComponent } from '../../components/table-card/table-card.component';

@Component({
  selector: 'app-table-grid',
  standalone: true,
  imports: [FormsModule, TableCardComponent],
  template: `
    <div class="max-w-6xl mx-auto p-6 relative overflow-hidden">
      <div class="pointer-events-none absolute top-0 left-1/4 -translate-x-1/4 w-[700px] h-[350px] bg-zinc-800/20 rounded-full blur-[140px] -z-10"></div>
      <div class="pointer-events-none absolute bottom-0 right-1/4 -translate-x-1/4 w-[600px] h-[300px] bg-emerald-900/20 rounded-full blur-[120px] -z-10"></div>

      <div class="relative z-10">
        <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white tracking-tight">Floor &amp; Tables</h1>
            <p class="text-sm text-zinc-400 mt-1">Live grid status and table management</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{{ restaurantService.availableTables().length }} Available</span>
            </div>
            <button
              type="button"
              (click)="showAddForm.set(!showAddForm())"
              class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-700 hover:border-zinc-600 transition-all active:scale-95 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              {{ showAddForm() ? 'Close' : 'Add Table' }}
            </button>
          </div>
        </div>

        @if (showAddForm()) {
          <div class="mb-8 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
            <h3 class="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Add New Table</h3>
            <form (ngSubmit)="addTable()" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Capacity</label>
                  <input
                    type="number"
                    [(ngModel)]="newTableCapacity"
                    name="capacity"
                    min="1"
                    max="20"
                    placeholder="2-20 seats"
                    class="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Status</label>
                  <select
                    [(ngModel)]="newTableStatus"
                    name="status"
                    class="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                class="w-full py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-all active:scale-95 cursor-pointer"
              >
                Create Table
              </button>
            </form>
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (table of restaurantService.allTables(); track table.id) {
            <app-table-card
              [table]="table"
              (onReserve)="handleReserve($event)"
              (onRelease)="handleRelease($event)"
            />
          } @empty {
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <p class="text-zinc-500 text-sm">No tables available. Add one above.</p>
            </div>
          }
        </div>

        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Total Tables</div>
            <div class="text-2xl font-bold text-white">{{ restaurantService.allTables().length }}</div>
          </div>
          <div class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div class="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1">Available</div>
            <div class="text-2xl font-bold text-emerald-400">{{ restaurantService.availableTables().length }}</div>
          </div>
          <div class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div class="text-xs font-medium text-amber-400 uppercase tracking-wider mb-1">Reserved</div>
            <div class="text-2xl font-bold text-amber-400">{{ restaurantService.reservedTables().length }}</div>
          </div>
          <div class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Occupied</div>
            <div class="text-2xl font-bold text-zinc-300">{{ restaurantService.occupiedTables().length }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class TableGridComponent {
  readonly restaurantService = inject(RestaurantService);
  readonly notificationService = inject(NotificationService);

  readonly showAddForm = signal(false);
  newTableCapacity = 2;
  newTableStatus: 'Available' | 'Reserved' = 'Available';

  handleReserve(tableId: number): void {
    const table = this.restaurantService.getTable(tableId);
    if (table && table.status === 'Available') {
      this.restaurantService.updateTableStatus(tableId, 'Reserved');
      this.notificationService.success(`Table ${table.id} reserved`);
    }
  }

  handleRelease(tableId: number): void {
    const table = this.restaurantService.getTable(tableId);
    if (table && table.status === 'Reserved') {
      this.restaurantService.updateTableStatus(tableId, 'Available');
      this.notificationService.success(`Table ${table.id} released`);
    }
  }

  addTable(): void {
    if (!this.newTableCapacity || this.newTableCapacity < 1) return;
    const table = this.restaurantService.addTable(this.newTableCapacity, this.newTableStatus);
    if (table) {
      this.notificationService.success(`Table ${table.id} created`);
      this.newTableCapacity = 2;
      this.showAddForm.set(false);
    }
  }
}
