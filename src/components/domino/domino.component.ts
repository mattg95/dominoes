import { Component, Input } from '@angular/core';
import { Dots } from '../dots/dots.component';
import { Direction } from '../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'domino',
  standalone: true,
  imports: [Dots, CommonModule],
  templateUrl: './domino.component.html',
  styleUrl: './domino.component.css',
})
export class Domino {
  @Input() values = [0, 0];
  @Input() direction: Direction = 'vertical';
}
