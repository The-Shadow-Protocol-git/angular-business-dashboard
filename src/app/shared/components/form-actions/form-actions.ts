import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-actions',
  template: `<div class="actions"><ng-content select="[formCancel]"></ng-content><button class="button primary" type="submit" [disabled]="saving()">{{ saving() ? 'Saving…' : submitLabel() }}</button></div>`,
  styles: [`.actions{display:flex;justify-content:flex-end;gap:10px;margin-top:28px;padding-top:20px;border-top:1px solid #eef0f4}`],
})
export class FormActionsComponent {
  readonly saving = input(false);
  readonly submitLabel = input('Save changes');
}
