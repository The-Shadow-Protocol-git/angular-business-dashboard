import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `<div class="state" role="status"><span class="spinner" aria-hidden="true"></span>{{ message() }}</div>`,
  styles: [`.state{min-height:200px;display:flex;align-items:center;justify-content:center;gap:10px;color:#6b7280;font-size:13px}.spinner{width:18px;height:18px;border:2px solid #e0e7ff;border-top-color:#4f46e5;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spinner{animation:none}}`],
})
export class LoadingStateComponent {
  readonly message = input('Loading…');
}
