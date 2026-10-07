import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [class]="status().toLowerCase().replace(' ', '-')">{{ status() }}</span>`,
  styles: [`
    .badge { display: inline-block; padding: 5px 8px; border-radius: 20px; background: #f3f4f6; color: #4b5563; font-size: 10px; font-weight: 600; text-transform: capitalize; }
    .badge.completed, .badge.active { background: #ecfdf5; color: #047857; }
    .badge.pending { background: #fffbeb; color: #b45309; }
    .badge.processing { background: #eef2ff; color: #4338ca; }
    .badge.cancelled, .badge.inactive, .badge.out-of-stock { background: #fef2f2; color: #b91c1c; }
  `],
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
}
