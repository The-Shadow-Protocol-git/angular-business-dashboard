import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EntityType } from '../core/models/business.models';
import { EntityDetails, ManagementService } from '../core/services/management.service';

@Component({
  selector: 'app-entity-detail-page',
  imports: [RouterLink],
  templateUrl: './entity-detail-page.html',
  styleUrl: './entity-detail-page.scss',
})
export class EntityDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly management = inject(ManagementService);
  protected readonly type = this.route.snapshot.data['entity'] as EntityType;
  protected readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly details = signal<EntityDetails | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.management.details(this.type, this.id).subscribe({
      next: (value) => { this.details.set(value); this.loading.set(false); },
      error: () => { this.error.set(`Unable to load this ${this.type.slice(0, -1)}. It may have been removed.`); this.loading.set(false); },
    });
  }
}
