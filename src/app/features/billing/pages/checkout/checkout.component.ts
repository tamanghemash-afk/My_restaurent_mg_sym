import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Order } from '../../../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <div class="max-w-5xl mx-auto p-6">
      <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Checkout &amp; Billing</h1>
          <p class="text-sm text-zinc-400 mt-1">Review active orders and generate receipts</p>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Table</label>
          <select
            [(ngModel)]="selectedTableId"
            class="bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            @for (t of restaurantService.allTables(); track t.id) {
              <option [value]="t.id">Table 0{{ t.id }}</option>
            }
          </select>
        </div>
      </div>

      @if (activeOrder()) {
        <div class="flex justify-center">
          <div class="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl" id="receipt">
            <div class="text-center pb-6 border-b border-zinc-800 mb-6">
              <h2 class="text-sm font-bold text-white tracking-widest uppercase">Aurum Restaurant</h2>
              <p class="text-[10px] text-zinc-500 mt-1">
                Invoice #{{ activeOrder()!.tableId }}-{{ activeOrder()!.id.slice(-4) }} &bull;
                {{ formatDate(activeOrder()!.createdAt) }}
              </p>
              @if (activeOrder()!.servedBy) {
                <p class="text-[10px] text-zinc-500 mt-0.5">Served by: {{ activeOrder()!.servedBy }}</p>
              }
            </div>

            <div class="space-y-3 mb-6">
              @for (item of activeOrder()!.items; track item.id) {
                <div class="flex justify-between items-center pb-2 border-b border-zinc-800/50 last:border-0">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-zinc-300">{{ item.quantity }}x</span>
                    <span class="text-sm text-zinc-300">{{ item.menuItem.name }}</span>
                  </div>
                  <span class="text-sm font-mono text-white">
                    \${{ (item.priceAtOrder * item.quantity).toFixed(2) }}
                  </span>
                </div>
              }
            </div>

            <div class="space-y-2 mb-6">
              <div class="flex justify-between text-xs text-zinc-400">
                <span>Subtotal</span>
                <span>\${{ activeOrder()!.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-xs text-zinc-400">
                <span>Tax (8%)</span>
                <span>\${{ activeOrder()!.tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>Total Amount</span>
                <span>\${{ activeOrder()!.total.toFixed(2) }}</span>
              </div>
            </div>

            <div class="flex gap-3">
              <app-button
                variant="secondary"
                size="md"
                [flex]="true"
                (onClick)="printReceipt()"
              >
                Print
              </app-button>
              <app-button
                variant="danger"
                size="md"
                [flex]="true"
                (onClick)="settleBill()"
              >
                Settle &amp; Clear
              </app-button>
            </div>
          </div>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <span class="text-zinc-500">🧾</span>
          </div>
          <p class="text-sm text-zinc-500">No active bill or order found for Table 0{{ selectedTableId() }}</p>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class CheckoutComponent {
  readonly restaurantService = inject(RestaurantService);
  readonly notificationService = inject(NotificationService);

  readonly selectedTableId = signal(1);

  readonly activeOrder = computed<Order | undefined>(() =>
    this.restaurantService.getActiveOrderForTable(Number(this.selectedTableId()))
  );

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  settleBill(): void {
    const order = this.activeOrder();
    if (!order) return;
    if (!confirm(`Settle bill for Table ${order.tableNumber} (Total: $${order.total.toFixed(2)})?`)) return;

    this.restaurantService.completeOrder(order.id);
    this.notificationService.success(`Bill settled for Table ${order.tableNumber}`);
  }

  printReceipt(): void {
    const order = this.activeOrder();
    if (!order) return;
    const receipt = document.getElementById('receipt');
    if (receipt) {
      const original = receipt.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html><head><title>Receipt</title></head><body>${original}</body></html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      window.print();
    }
  }
}
