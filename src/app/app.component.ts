import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Board } from '../components/board/board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Board],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'dominoes';
}
