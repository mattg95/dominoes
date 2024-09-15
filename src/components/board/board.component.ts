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
        this.checkProximity(childComponent);
      });
    });
  }

  checkProximity(currentDomino: Domino) {
    this.dominos.forEach((otherDomino) => {
      if (otherDomino !== currentDomino) {
        const proximity = this.calculateEdgesProximity(
          currentDomino,
          otherDomino
        );
        this.snapToPlace(proximity, currentDomino, otherDomino);
      }
    });
  }

  // calcualtes the prxomitiy between the dragged domino and another domino, measured from the dragged domino
  calculateEdgesProximity(
    currentDomino: Domino,
    otherDomino: Domino
  ): Proximity {
    const current = currentDomino.rect;
    const other = otherDomino.rect;

    let top;
    let bottom;
    let right;
    let left;
    // both vertical
    if (currentDomino.getIsVertical() && otherDomino.getIsVertical()) {
      left = current.x - other.x;
      right = current.x - other.x;

      top = Math.abs(current.y - (other.y + other.width));
      bottom = Math.abs(current.y + current.width - other.y);
      // both horizontal
    } else if (!currentDomino.getIsVertical() && !otherDomino.getIsVertical()) {
      left = current.x - (other.x + other.width);
      right = current.x + current.width - other.x;

      top = current.y - other.top;
      bottom = current.bottom - other.bottom;
    } else if (currentDomino.getIsVertical() && !otherDomino.getIsVertical()) {
      left = current.x - other.x - 90;
      right = current.x + 90 - other.x;
      top = current.y - other.y - 60;
      bottom = current.y - other.y;
    } else if (!currentDomino.getIsVertical() && otherDomino.getIsVertical()) {
      left = current.x - 90 - other.x;
      right = current.x + 90 - other.x;
      top = current.y - other.y;
      bottom = current.y + 120 - other.y;
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
    currentDomino: Domino,
    otherDomino: Domino
  ) {
    const offset = 3;
    const dominoHeight = 60;
    const dominoWidth = 120;
    // todo- send as css props in html template
    // both vertical

    const absLeft = Math.abs(left);
    const absRight = Math.abs(right);

    const absTop = Math.abs(top);
    const absBottom = Math.abs(bottom);

    const leftMinusWidth = Math.abs(absLeft - 60);
    const rightMinusWidth = Math.abs(absRight - 60);
    const topMinusWidth = Math.abs(absTop - 60);
    const bottomMinuswidth = Math.abs(absBottom - 60);

    if (
      currentDomino.getIsVertical() &&
      otherDomino.getIsVertical() &&
      right <= this.snapBoxOverflow
    ) {
      // domino joins others from below
      if (absTop <= this.snapBoxOverflow) {
        if (currentDomino.getTopValue() === otherDomino.getBottomValue()) {
          currentDomino.setPosition(left, top);
        }
      }
      // domino joins from above
      if (absBottom <= this.snapBoxOverflow) {
        if (currentDomino.getBottomValue() === otherDomino.getTopValue()) {
          currentDomino.setPosition(left, bottom);
        }
      }
    }
    // both horizontal
    if (
      !currentDomino.getIsVertical() &&
      !otherDomino.getIsVertical() &&
      bottom <= this.snapBoxOverflow
    ) {
      // domino joins others from right
      if (absLeft <= this.snapBoxOverflow) {
        if (currentDomino.getLeftValue() === otherDomino.getRightValue()) {
          currentDomino.setPosition(left - offset, top);
        }
      }
      // domino joins others from left
      if (absRight <= this.snapBoxOverflow) {
        if (currentDomino.getRightValue() === otherDomino.getLeftValue()) {
          currentDomino.setPosition(right - offset, top);
        }
      }
    }
    // one vetical, other horizontal
    if (
      (currentDomino.getIsVertical() && !otherDomino.getIsVertical()) ||
      (!otherDomino.getIsVertical() && currentDomino.getIsVertical())
    ) {
      console.log(top, bottom, left, right);

      // left side top alignment
      if (absLeft <= this.snapBoxOverflow && absTop <= this.snapBoxOverflow) {
        currentDomino.setPosition(left, top);
      }
      if (
        leftMinusWidth <= this.snapBoxOverflow &&
        topMinusWidth <= this.snapBoxOverflow
      ) {
        currentDomino.setPosition(leftMinusWidth, topMinusWidth);
      }
      // left side bottom
      if (
        absLeft <= this.snapBoxOverflow &&
        absBottom <= this.snapBoxOverflow
      ) {
        currentDomino.setPosition(absLeft, absBottom);
      }

      if (
        leftMinusWidth <= this.snapBoxOverflow &&
        bottomMinuswidth <= this.snapBoxOverflow
      ) {
        currentDomino.setPosition(leftMinusWidth, bottomMinuswidth);
      }
      // right side top
      if (absRight <= this.snapBoxOverflow && absTop <= this.snapBoxOverflow) {
        currentDomino.setPosition(right, top);
      }
      if (
        rightMinusWidth <= this.snapBoxOverflow &&
        topMinusWidth <= this.snapBoxOverflow
      ) {
        currentDomino.setPosition(rightMinusWidth, topMinusWidth);
      }

      // right side bottom
      if (
        absRight <= this.snapBoxOverflow &&
        absBottom <= this.snapBoxOverflow
      ) {
        currentDomino.setPosition(right, bottom);
      }
      if (
        rightMinusWidth <= this.snapBoxOverflow &&
        bottomMinuswidth <= this.snapBoxOverflow
      ) {
        currentDomino.setPosition(rightMinusWidth, bottomMinuswidth);
      }
    }
  }
}
