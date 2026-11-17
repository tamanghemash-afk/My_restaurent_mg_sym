import { Component, Input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="w-full">
      @if (label) {
        <label class="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider" [for]="id">
          {{ label }}
        </label>
      }
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value()"
        (input)="onInput($event)"
        [disabled]="disabled"
        [readonly]="readonly"
        [required]="required"
        class="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-colors disabled:bg-zinc-900/50 disabled:text-zinc-500 disabled:cursor-not-allowed"
      />
      @if (helperText) {
        <p class="text-[11px] text-zinc-500 mt-1">{{ helperText }}</p>
      }
      @if (errorText) {
        <p class="text-[11px] text-rose-400 mt-1">{{ errorText }}</p>
      }
    </div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class InputComponent {
  readonly value = model<string | number>('');
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() id = `input-${Math.random().toString(36).slice(2, 9)}`;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() helperText = '';
  @Input() errorText = '';

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (this.type === 'number') {
      this.value.set(target.value === '' ? '' : Number(target.value));
    } else {
      this.value.set(target.value);
    }
  }
}
