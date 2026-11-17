import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CreateMenuItemDto } from '../../../../core/models';

@Component({
  selector: 'app-menu-item-form',
  standalone: true,
  imports: [FormsModule, ModalComponent, InputComponent, ButtonComponent],
  template: `
    <app-modal [open]="open()" title="Create Menu Item" (onClose)="onClose.emit()">
      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <app-input
          label="Item Name"
          placeholder="e.g. Truffle Mushroom Risotto"
          [required]="true"
          [(value)]="form.name"
        />
        <app-input
          label="Price ($)"
          type="number"
          placeholder="0.00"
          [required]="true"
          [(value)]="form.price"
        />
        <div>
          <label class="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Category</label>
          <select
            [(ngModel)]="form.category"
            name="category"
            class="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="Appetizers">Appetizers</option>
            <option value="Mains">Mains</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>
        <app-input
          label="Description"
          placeholder="Describe the dish..."
          [(value)]="form.description"
        />
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            [(ngModel)]="form.available"
            name="available"
            class="w-4 h-4 rounded border-zinc-600 bg-zinc-950 accent-emerald-500"
          />
          <span class="text-xs text-zinc-300">Available</span>
        </label>
        <div class="flex gap-3 pt-4">
          <app-button
            variant="outline"
            size="md"
            [flex]="true"
            (onClick)="onClose.emit()"
          >
            Cancel
          </app-button>
          <app-button
            variant="primary"
            size="md"
            type="submit"
            [flex]="true"
            [loading]="isSubmitting()"
            [disabled]="!form.name || !form.price || form.price <= 0 || isSubmitting()"
          >
            Save Item
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class MenuItemFormComponent {
  readonly open = input.required<boolean>();
  readonly onClose = output<void>();
  readonly onSave = output<CreateMenuItemDto>();

  readonly restaurantService = inject(RestaurantService);
  readonly notificationService = inject(NotificationService);
  readonly isSubmitting = signal(false);

  form: {
    name: string;
    price: number;
    category: 'Appetizers' | 'Mains' | 'Desserts' | 'Beverages';
    description: string;
    available: boolean;
  } = {
    name: '',
    price: 0,
    category: 'Mains',
    description: '',
    available: true,
  };

  async onSubmit(): Promise<void> {
    if (!this.form.name || !this.form.price || Number(this.form.price) <= 0) return;
    this.isSubmitting.set(true);
    try {
      this.onSave.emit({
        ...this.form,
        price: Number(this.form.price),
      });
      this.resetForm();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  resetForm(): void {
    this.form = { name: '', price: 0, category: 'Mains', description: '', available: true };
  }
}
