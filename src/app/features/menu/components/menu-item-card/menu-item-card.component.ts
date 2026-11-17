import { Component, input, output } from '@angular/core';
import { MenuItem } from '../../../../core/models/menu-item.model';

@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [],
  template: `
    <div
      class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700/70 transition-all duration-200 group"
      [class.opacity-60]="!item().available"
    >
      <div class="flex items-start justify-between mb-3">
        <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{{ item().category }}</span>
        <button
          type="button"
          class="p-1.5 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-400 hover:bg-rose-900/50 hover:text-rose-300 transition-colors cursor-pointer"
          (click)="onDelete.emit(item().id)"
          aria-label="Delete item"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
      <h3 class="text-lg font-semibold text-white mb-1">{{ item().name }}</h3>
      <p class="text-xs text-zinc-400 mb-4 leading-relaxed">{{ item().description || 'No description available' }}</p>
      <div class="flex items-center justify-between">
        <span class="text-sm font-mono font-bold text-white">\${{ item().price.toFixed(2) }}</span>
        <span
          class="text-[10px] font-mono uppercase px-2 py-0.5 rounded border"
          [class]="item().available ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'"
        >
          {{ item().available ? 'Available' : 'Unavailable' }}
        </span>
      </div>
    </div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class MenuItemCardComponent {
  readonly item = input.required<MenuItem>();
  readonly onDelete = output<string>();
}
