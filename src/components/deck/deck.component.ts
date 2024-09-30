import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Domino } from '../domino/domino.component';

@Component({
  selector: 'deck',
  standalone: true,
  templateUrl: './deck.component.html',
  imports: [Domino],
  styleUrl: '../domino/domino.component.css',
})
export class Deck {
  constructor(private viewContainer: ViewContainerRef) {}
  public uncoverDomino() {
    this.viewContainer.createComponent(Domino);
  }
}
