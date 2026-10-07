import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-recent-orders',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.scss',
})
export class RecentOrdersComponent {
  readonly orders = input.required<Order[]>();

  protected initials(name: string): string {
    return name.split(' ').map((part) => part[0] ?? '').join('');
  }
}
