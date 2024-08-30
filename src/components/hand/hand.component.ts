import { Component } from '@angular/core';
import { Domino } from '../domino/domino.component';

@Component({
  selector: 'hand',
  standalone: true,
  imports: [Domino],
  templateUrl: './hand.component.html',
  styleUrl: './hand.component.css',
})
export class Hand {}
