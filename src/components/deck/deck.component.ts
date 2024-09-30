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

  public deck: number[][] = [];
  private dotValues = Array.from({ length: 7 }, (_, i) => i);

  ngAfterViewInit() {
    console.log('here');
    this.createDeck();
    console.log(this.deck);
  }

  private createDeck() {
    for (const value1 of this.dotValues) {
      for (const value2 of this.dotValues) {
        this.deck.push([value1, value2]);
      }
    }
  }

  public uncoverDomino() {
    const randomIndex = Math.floor(Math.random() * this.deck.length);
    const [dominoValues] = this.deck.splice(randomIndex, 1);

    console.log(dominoValues);

    const newDomino = this.viewContainer.createComponent(Domino);
    newDomino.instance.values = dominoValues;
  }
}
