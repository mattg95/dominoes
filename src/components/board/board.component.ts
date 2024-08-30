import { Component } from '@angular/core';

import { Hand } from '../hand/hand.component';

@Component({
  selector: 'board',
  standalone: true,
  imports: [Hand],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class Board {}
