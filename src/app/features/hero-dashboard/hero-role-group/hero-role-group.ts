import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HeroCard } from '../hero-card/hero-card';
import { HeroRole, HeroSnapshot, ROLE_LABELS } from '../../../core/models/overwatch.models';

@Component({
  selector: 'app-hero-role-group',
  imports: [HeroCard],
  templateUrl: './hero-role-group.html',
  styleUrl: './hero-role-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroRoleGroup {
  readonly role = input.required<HeroRole>();
  readonly heroes = input.required<HeroSnapshot[]>();
  readonly heroSelect = output<HeroSnapshot>();

  protected readonly roleLabels = ROLE_LABELS;
}
