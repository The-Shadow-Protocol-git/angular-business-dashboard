import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly change = input.required<number>();
  readonly icon = input.required<string>();
  readonly prefix = input('');
  readonly suffix = input('');
}
