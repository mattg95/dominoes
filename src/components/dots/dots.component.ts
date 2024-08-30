import { Component, Input } from '@angular/core';
import { Dot } from '../dot/dot.component';

@Component({
  selector: 'dots',
  standalone: true,
  templateUrl: './dots.component.html',
  imports: [Dot],
  styleUrl: './dots.component.css',
})
export class Dots {
  @Input() value = 0;
}
