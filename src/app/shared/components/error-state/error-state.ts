import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  template: `<section class="state" role="alert"><p>{{ message() }}</p><button class="button secondary" type="button" (click)="retry.emit()">Try again</button></section>`,
  styles: [`.state{min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:24px;text-align:center}.state p{margin:0;color:#b91c1c;font-size:13px}`],
})
export class ErrorStateComponent {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
