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
  public direction = 0;
  public dragging = false;
  public isLocked = false;
  public rect = null;

  public getIsVertical() {
    return this.direction % 2 == 1;
  }

  @Output() positionChanged = new EventEmitter<DOMRect>();

  @ViewChild('domino') domino!: ElementRef;

  @ViewChild('draggable', { static: true }) draggable!: CdkDrag;

  public setPosition(x: number, y: number) {
    console.log('snappin');
    const currentPosition = this.draggable._dragRef.getFreeDragPosition();
    this.draggable._dragRef.setFreeDragPosition({
      x: currentPosition.x - x,
      y: currentPosition.y - y,
    });
    this.isLocked = true;
  }

  ngOnInit() {
    this.emitPosition();
  }

  private emitPosition() {
    const rect = this.domino.nativeElement;
    this.rect = rect;
    this.positionChanged.emit(rect);
  }

  private rotate() {
    if (!this.isLocked) {
      if (this.direction < 3) {
        this.direction++;
      } else {
        this.direction = 0;
      }
      this.emitPosition();
    }
  }

  public getRightValue() {
    if (this.direction === 0) {
      return this.values[1];
    } else if (this.direction === 2) {
      return this.values[0];
    } else return null;
  }

  public getLeftValue() {
    if (this.direction === 0) {
      return this.values[0];
    } else if (this.direction === 2) {
      return this.values[1];
    } else return null;
  }

  public getTopValue() {
    if (this.direction === 1) {
      return this.values[0];
    } else if (this.direction === 3) {
      return this.values[1];
    } else return null;
  }

  public getBottomValue() {
    if (this.direction === 1) {
      return this.values[1];
    } else if (this.direction === 3) {
      return this.values[0];
    } else return null;
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

  @Input() values = [0, 0];
}
