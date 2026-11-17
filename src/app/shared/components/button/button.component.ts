import { Component, Input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [type]="type"
      (click)="handleClick($event)"
      [disabled]="disabled || loading"
      [class]="buttonClasses()"
    >
      @if (loading) {
        <svg class="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        @if (label) {
          <span>{{ label }}</span>
        } @else {
          <ng-content />
        }
      } @else {
        <ng-content />
      }
    </button>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() label = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth = false;
  @Input() flex = false;
  readonly onClick = output<void>();

  handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onClick.emit();
  }

  protected buttonClasses(): string {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

    const variantMap: Record<ButtonVariant, string> = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-950/50',
      secondary: 'bg-zinc-800 text-zinc-200 border border-zinc-700/70 hover:bg-zinc-700 hover:text-white',
      outline: 'bg-transparent border border-zinc-700 text-zinc-200 hover:bg-zinc-800/70 hover:border-zinc-600 hover:text-white',
      ghost: 'bg-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-white',
      danger: 'bg-rose-600/90 text-white hover:bg-rose-500 shadow-sm shadow-rose-950/50',
      success: 'bg-emerald-600 text-white hover:bg-emerald-500',
    };

    const sizeMap: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return [
      base,
      variantMap[this.variant],
      sizeMap[this.size],
      this.fullWidth ? 'w-full' : '',
      this.flex ? 'flex-1' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
