import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Domino } from '../domino/domino.component';
import { HandPositionService } from '../../services/handPositionService';

@Component({
  selector: 'deck',
  standalone: true,
  templateUrl: './deck.component.html',
  imports: [Domino],
  styleUrls: ['../domino/domino.component.css', './deck.component.css'],
})
export class Deck {
  @ViewChild('dominoContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  constructor(private handPositionService: HandPositionService) {}

  public deck: number[][] = [];
  private dotValues = Array.from({ length: 7 }, (_, i) => i);

  ngAfterViewInit() {
    this.createDeck();
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

    const newDomino = this.container.createComponent(Domino);
    newDomino.instance.values = dominoValues;

    const handRect = this.handPositionService.getHandPosition();
    if (handRect) {
      this.animateDominoToHand(
        newDomino.location.nativeElement,
        handRect.right,
        handRect.top
      );
      setTimeout(() => {
        this.handPositionService.setDominoValues(newDomino.instance.values);
        newDomino.destroy();
      }, 2000);
    }
  }

  animateDominoToHand(
    dominoElement: HTMLElement,
    targetX: number,
    targetY: number
  ) {
    // Animate the Domino using CSS transitions
    setTimeout(() => {
      dominoElement.style.transition = 'transform 2s ease-in-out';
      const currentRect = dominoElement.getBoundingClientRect();
      const deltaX = targetX - currentRect.left;
      const deltaY = targetY - currentRect.top;
      dominoElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }, 100); // Delay to ensure it’s positioned correctly initially
  }
}
