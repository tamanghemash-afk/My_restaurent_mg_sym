import { Injectable, signal, computed } from '@angular/core';
import { Notification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  readonly items = computed(() => this.notifications());

  show(message: string, type: Notification['type'] = 'info', duration = 4000): void {
    const id = crypto.randomUUID();
    const notification: Notification = {
      id,
      type,
      message,
      duration,
      timestamp: new Date(),
    };
    this.notifications.update(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  remove(id: string): void {
    this.notifications.update(prev => prev.filter(n => n.id !== id));
  }

  clear(): void {
    this.notifications.set([]);
  }
}
