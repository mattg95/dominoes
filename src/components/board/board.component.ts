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
        const proximity = this.calculateEdgesProximity(
          currentRect,
          otherRect,
          currentComponent
        );
        currentComponent.snapToPlace(proximity, currentComponent);
      }
    });
  }

  calculateEdgesProximity(
    current: DOMRect,
    other: DOMRect,
    currentComponent: Domino
  ): Proximity {
    let top;
    let bottom;
    let right;
    let left;
    if (currentComponent.isVertical) {
      left = current.x - other.x;
      right = current.x - other.x;

      top = Math.abs(current.y - (other.y + other.width));
      bottom = Math.abs(current.y + current.width - other.y);
    } else {
      left = Math.abs(current.x - (other.x + other.width));
      right = Math.abs(current.x + current.width - other.x);

      top = current.y - other.top;
      bottom = current.bottom - other.bottom;
    }
    return {
      bottom,
      top,
      left,
      right,
    };
  }
}
