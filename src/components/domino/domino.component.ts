import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Dots } from '../dots/dots.component';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Proximity } from '../../types';

@Component({
  selector: 'domino',
  standalone: true,
  imports: [Dots, CommonModule, CdkDrag],
  templateUrl: './domino.component.html',
  styleUrl: './domino.component.css',
})
export class Domino {
  public isVertical = false;
  public dragging = false;
  public isLocked = false;
  private snapBoxOverflow = 10;

  @Output() positionChanged = new EventEmitter<DOMRect>();

  @ViewChild('domino') domino!: ElementRef;

  @ViewChild('draggable', { static: true }) draggable!: CdkDrag;

  public setPosition(x: number, y: number) {
    const currentPosition = this.draggable._dragRef.getFreeDragPosition();
    this.draggable._dragRef.setFreeDragPosition({
      x: currentPosition.x - x,
      y: currentPosition.y - y,
    });
  }

  private emitPosition() {
    const rect = this.domino.nativeElement;

    this.positionChanged.emit(rect);
  }

  private rotate() {
    if (!this.isLocked) {
      this.isVertical = !this.isVertical;
    }
  }

  public handleDragStart(_: CdkDragStart): void {
    this.dragging = true;
  }

  public handleDragEnd(_: CdkDragEnd): void {
    this.dragging = false;
    this.emitPosition();
  }

  public handleClick(_: MouseEvent): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.rotate();
  }

  public snapToPlace(
    { top, bottom, left, right }: Proximity,
    currentComponent: Domino
  ) {
    const offset = 3;
    if (currentComponent.isVertical && right <= this.snapBoxOverflow) {
      if (top <= this.snapBoxOverflow) {
        currentComponent.setPosition(left, top);
        currentComponent.isLocked = true;
      }
      if (bottom <= this.snapBoxOverflow) {
        currentComponent.setPosition(left, bottom);
        currentComponent.isLocked = true;
      }
    }

    if (!currentComponent.isVertical && bottom <= this.snapBoxOverflow) {
      if (left <= this.snapBoxOverflow) {
        currentComponent.setPosition(left - offset, top);
        currentComponent.isLocked = true;
      }
      if (right <= this.snapBoxOverflow) {
        currentComponent.setPosition(right - offset, top);
        currentComponent.isLocked = true;
      }
    }
  }

  @Input() values = [0, 0];
}
