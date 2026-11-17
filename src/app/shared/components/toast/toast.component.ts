import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  template: `
    <div class="fixed top-20 right-4 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      @for (notification of notificationService.items(); track notification.id) {
        <div
          [class]="toastClasses(notification.type)"
          (click)="notificationService.remove(notification.id)"
        >
          <div class="shrink-0">
            @switch (notification.type) {
              @case ('success') {
                <svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              }
              @case ('error') {
                <svg class="w-5 h-5 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              @case ('warning') {
                <svg class="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              @default {
                <svg class="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            }
          </div>
          <div class="text-xs font-medium leading-snug flex-1">{{ notification.message }}</div>
          <button
            type="button"
            class="ml-auto p-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            (click)="notificationService.remove(notification.id); $event.stopPropagation()"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class ToastComponent {
  readonly notificationService = inject(NotificationService);

  protected toastClasses(type: Notification['type']): string {
    const base =
      'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md text-white shadow-xl cursor-pointer transition-all';
    const typeMap: Record<Notification['type'], string> = {
      info: 'bg-zinc-900/95 border-zinc-700 text-zinc-100',
      success: 'bg-emerald-950/95 border-emerald-700/70 text-emerald-100',
      warning: 'bg-amber-950/95 border-amber-700/70 text-amber-100',
      error: 'bg-rose-950/95 border-rose-700/70 text-rose-100',
    };
    return [base, typeMap[type]].join(' ');
  }
}
