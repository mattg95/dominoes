import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { Hand } from '../hand/hand.component';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { Domino } from '../domino/domino.component';
import { Proximity } from '../../types';

@Component({
  selector: 'board',
  standalone: true,
  imports: [Hand, Domino],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class Board implements AfterViewInit {
  @ViewChildren(Domino) dominos!: QueryList<Domino>;

  ngAfterViewInit() {
    this.dominos.forEach((childComponent) => {
      childComponent.positionChanged.subscribe((rect) => {
        const childRect = (rect as any as HTMLElement).getBoundingClientRect();
        this.checkProximity(childRect, childComponent);
      });
    });
  }

  checkProximity(currentRect: DOMRect, currentComponent: Domino) {
    this.dominos.forEach((child) => {
      if (child !== currentComponent) {
        const otherRect = (
          document.getElementById('domino') as HTMLElement
        ).getBoundingClientRect();
        const proximity = this.calculateEdgesProximity(currentRect, otherRect);
        this.snapRectangles(proximity, currentComponent, 10);
      }
    });
  }

  calculateEdgesProximity(current: DOMRect, other: DOMRect): Proximity {
    const left = Math.abs(current.left - other.right);
    const right = Math.abs(current.right - other.left);

    const top = current.top - other.top;
    const bottom = current.bottom - other.bottom;

    return {
      bottom,
      top,
      left,
      right,
    };
  }

  snapRectangles(
    { top, bottom, left, right }: Proximity,
    currentComponent: Domino,
    proximity: number
  ) {
    const offset = 3;
    if (bottom <= proximity || top <= proximity) {
      if (left <= proximity) {
        currentComponent.setPosition(left - offset, top);
        currentComponent.isLocked = true;
      }
      if (right <= proximity) {
        currentComponent.setPosition(right - offset, top);
        currentComponent.isLocked = true;
      }
    }
  }
}
