import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Table } from '../../../../core/models/table.model';

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div
      class="h-full rounded-2xl border bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-300 group relative overflow-hidden backdrop-blur-md"
      [class]="cardBorderClass()"
    >
      <div class="absolute top-0 right-0 w-8 h-8 bg-zinc-800/50 rounded-bl-lg -translate-y-1 translate-x-1"></div>
      <div class="relative z-10 p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2 h-2 rounded-full" [class]="dotClass()"></span>
              <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Table</span>
            </div>
            <h3 class="text-2xl font-bold text-white mt-0.5">{{ table().id < 10 ? '0' + table().id : table().id }}</h3>
          </div>
          <span class="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border" [class]="badgeClass()">
            {{ table().status }}
          </span>
        </div>
        <div class="flex items-center justify-between text-xs font-mono text-zinc-400 mb-6">
          <span>{{ table().capacity }} Seats</span>
          <span>{{ table().name }}</span>
        </div>
        <div class="flex gap-2">
          @if (table().status === 'Available') {
            <app-button
              variant="outline"
              size="sm"
              [flex]="true"
              (onClick)="onReserve.emit(table().id)"
            >
              Reserve
            </app-button>
          } @else if (table().status === 'Reserved') {
            <app-button
              variant="outline"
              size="sm"
              [flex]="true"
              (onClick)="onRelease.emit(table().id)"
            >
              Release
            </app-button>
          } @else {
            <app-button
              variant="ghost"
              size="sm"
              [flex]="true"
              [disabled]="true"
            >
              Occupied
            </app-button>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class TableCardComponent {
  readonly table = input.required<Table>();
  readonly onReserve = output<number>();
  readonly onRelease = output<number>();

  protected cardBorderClass(): string {
    switch (this.table().status) {
      case 'Available': return 'border-emerald-500/25 hover:border-emerald-500/50';
      case 'Reserved': return 'border-amber-500/25 hover:border-amber-500/50';
      default: return 'border-zinc-700/50';
    }
  }

  protected dotClass(): string {
    switch (this.table().status) {
      case 'Available': return 'bg-emerald-400';
      case 'Reserved': return 'bg-amber-400';
      default: return 'bg-zinc-500';
    }
  }

  protected badgeClass(): string {
    switch (this.table().status) {
      case 'Available': return 'bg-emerald-950/50 border-emerald-700/50 text-emerald-400';
      case 'Reserved': return 'bg-amber-950/50 border-amber-700/50 text-amber-400';
      default: return 'bg-zinc-800 border-zinc-700 text-zinc-400';
    }
  }
}
