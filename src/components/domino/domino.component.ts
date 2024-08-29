import { Component, Input } from '@angular/core';
import { Dots } from '../dots/dots.component';

@Component({
  selector: 'domino',
  standalone: true,
  imports: [Dots],
  templateUrl: './domino.component.html',
  styleUrl: './domino.component.css',
})
export class Domino {
  @Input() values = [0, 0];
}
