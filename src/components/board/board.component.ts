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

  private snapBoxOverflow = 10;

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
          currentComponent,
          child
        );
        this.snapToPlace(proximity, currentComponent, child);
      }
    });
  }

  // calcualtes the prxomitiy between the dragged domino and another domino, measured from the dragged domino
  calculateEdgesProximity(
    current: DOMRect,
    other: DOMRect,
    currentComponent: Domino,
    otherComponent: Domino
  ): Proximity {
    let top;
    let bottom;
    let right;
    let left;
    // both vertical
    if (currentComponent.isVertical && otherComponent.isVertical) {
      left = Math.abs(current.x - other.x);
      right = Math.abs(current.x - other.x);

      top = Math.abs(current.y - (other.y + other.width));
      bottom = Math.abs(current.y + current.width - other.y);
      // both horizontal
    } else if (!currentComponent.isVertical && !otherComponent.isVertical) {
      left = Math.abs(current.x - (other.x + other.width));
      right = Math.abs(current.x + current.width - other.x);

      top = current.y - other.top;
      bottom = current.bottom - other.bottom;
    } else if (currentComponent.isVertical && !otherComponent.isVertical) {
      left = Math.abs(current.x - other.x - 90);
      right = Math.abs(current.x + 90 - other.x);
      top = Math.abs(current.y - other.y - 60);
      bottom = Math.abs(current.y - other.y);
    } else if (!currentComponent.isVertical && otherComponent.isVertical) {
      left = Math.abs(current.x - 90 - other.x);
      right = Math.abs(current.x + 90 - other.x);
      top = Math.abs(current.y - other.y);
      bottom = Math.abs(current.y + 120 - other.y);
    } else throw new Error('cannot calculate proximity');

    return {
      bottom,
      top,
      left,
      right,
    };
  }

  public snapToPlace(
    { top, bottom, left, right }: Proximity,
    currentComponent: Domino,
    otherComponent: Domino
  ) {
    const offset = 3;
    const dominoHeight = 60;
    const dominoWidth = 120;
    // todo- send as css props in html template
    // both vertical

    if (
      currentComponent.isVertical &&
      otherComponent.isVertical &&
      right <= this.snapBoxOverflow
    ) {
      // domino joins from above
      if (top <= this.snapBoxOverflow) {
        currentComponent.setPosition(left, top);
      }
      // domino joins from below
      if (bottom <= this.snapBoxOverflow) {
        currentComponent.setPosition(left, bottom);
      }
    }
    // both horizontal
    if (
      !currentComponent.isVertical &&
      !otherComponent.isVertical &&
      bottom <= this.snapBoxOverflow
    ) {
      // domino joins from left
      if (left <= this.snapBoxOverflow) {
        currentComponent.setPosition(left - offset, top);
      }
      // domino joins from right
      if (right <= this.snapBoxOverflow) {
        currentComponent.setPosition(right - offset, top);
      }
    }
    // current component vetical, other horizontal
    if (
      (currentComponent.isVertical && !otherComponent.isVertical) ||
      (otherComponent.isVertical && !currentComponent.isVertical)
    ) {
      const leftMinusWidth = Math.abs(left - 60);
      const rightMinusWidth = Math.abs(right - 60);
      const topMinusWidth = Math.abs(top - 60);
      const bottomMinuswidth = Math.abs(bottom - 60);
      // left side top alignment
      if (left <= this.snapBoxOverflow && top <= this.snapBoxOverflow) {
        currentComponent.setPosition(left, top);
      }
      if (
        leftMinusWidth <= this.snapBoxOverflow &&
        topMinusWidth <= this.snapBoxOverflow
      ) {
        currentComponent.setPosition(leftMinusWidth, topMinusWidth);
      }
      // left side bottom

      if (
        leftMinusWidth <= this.snapBoxOverflow &&
        bottomMinuswidth <= this.snapBoxOverflow
      ) {
        currentComponent.setPosition(leftMinusWidth, bottomMinuswidth);
      }
      // right side top
      if (
        rightMinusWidth <= this.snapBoxOverflow &&
        topMinusWidth <= this.snapBoxOverflow
      ) {
        currentComponent.setPosition(rightMinusWidth, topMinusWidth);
      }
      if (right <= this.snapBoxOverflow && top <= this.snapBoxOverflow) {
        currentComponent.setPosition(right, top);
      }
      // right side bottom
      if (right <= this.snapBoxOverflow && bottom <= this.snapBoxOverflow) {
        currentComponent.setPosition(right, bottom);
      }
      if (
        rightMinusWidth <= this.snapBoxOverflow &&
        bottomMinuswidth <= this.snapBoxOverflow
      ) {
        currentComponent.setPosition(rightMinusWidth, bottomMinuswidth);
      }
    }
  }
}
