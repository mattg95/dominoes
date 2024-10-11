import { Component } from '@angular/core';
import { Board } from '../board/board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Board],
  templateUrl: './game.component.html',
  //   styleUrl: './app.component.css',
})
export class Game {}
