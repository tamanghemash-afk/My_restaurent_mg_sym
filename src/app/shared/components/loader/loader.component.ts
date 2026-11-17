import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center gap-2 text-zinc-500">
      <svg [class]="svgClasses()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      @if (message()) {
        <p class="text-xs font-medium tracking-wider uppercase">{{ message() }}</p>
      }
    </div>
  `,
  styles: `
    :host { display: contents; }
  `,
})
export class LoaderComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly message = input<string>('');

  protected svgClasses(): string {
    const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
    return `animate-spin ${sizeMap[this.size()]}`;
  }
}
