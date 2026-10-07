import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `<section class="state"><strong>{{ title() }}</strong><p>{{ description() }}</p></section>`,
  styles: [`.state{min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}.state strong{color:#172033;font-size:14px}.state p{margin:7px 0 0;color:#6b7280;font-size:12px}`],
})
export class EmptyStateComponent {
  readonly title = input('Nothing to show');
  readonly description = input('');
}
