import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Domino } from '../components/domino/domino.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Domino],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'dominoes';
}
