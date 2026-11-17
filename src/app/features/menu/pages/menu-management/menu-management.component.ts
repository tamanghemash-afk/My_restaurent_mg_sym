import { Component, inject, signal } from '@angular/core';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MenuItemCardComponent } from '../../components/menu-item-card/menu-item-card.component';
import { MenuItemFormComponent } from '../../components/menu-item-form/menu-item-form.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { CreateMenuItemDto } from '../../../../core/models';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [MenuItemCardComponent, MenuItemFormComponent, ButtonComponent, LoaderComponent],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Menu Catalog</h1>
          <p class="text-sm text-zinc-400 mt-1">Manage kitchen items and pricing</p>
        </div>
        @if (authService.role() === 'Admin') {
          <app-button
            variant="primary"
            size="md"
            (onClick)="showForm.set(true)"
          >
            + Add Item
          </app-button>
        }
      </div>

      @if (authService.role() === 'Admin') {
        <app-menu-item-form
          [open]="showForm()"
          (onClose)="showForm.set(false)"
          (onSave)="handleSave($event)"
        />
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
            <app-menu-item-card
              [item]="item"
              (onDelete)="handleDelete($event)"
            />
          }
        }
      </div>
    </div>
  `,
})
export class MenuManagementComponent {
  readonly restaurantService = inject(RestaurantService);
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);

  readonly showForm = signal(false);
  readonly isLoading = signal(false);

  async handleSave(dto: CreateMenuItemDto): Promise<void> {
    this.isLoading.set(true);
    try {
      this.restaurantService.addMenuItem({
        name: dto.name,
        category: dto.category,
        price: dto.price,
        description: dto.description,
        available: dto.available,
      });
      this.notificationService.success('Menu item added successfully');
      this.showForm.set(false);
    } catch {
      this.notificationService.error('Failed to add menu item');
    } finally {
      this.isLoading.set(false);
    }
  }

  async handleDelete(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    this.restaurantService.removeMenuItem(id);
    this.notificationService.success('Menu item removed');
  }
}
