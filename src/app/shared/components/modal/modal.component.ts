import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm transition-opacity"
        (click)="onBackdropClick.emit(); onClose.emit()"
      ></div>
      <div class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[90vh] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden flex flex-col">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
            <h3 class="text-lg font-semibold text-white tracking-tight">{{ title() }}</h3>
            <button
              type="button"
              class="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              (click)="onClose.emit()"
              aria-label="Close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class ModalComponent {
  readonly open = input.required<boolean>();
  readonly title = input<string>('');
  readonly onClose = output<void>();
  readonly onBackdropClick = output<void>();
}
