import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Dots } from '../dots/dots.component';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';

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
  public isEnd = false;
  public rect = null;

  @Input() values = [0, 0];
  @Input() initial = false;
  @Input() hidden = false;

  @Output() positionChanged = new EventEmitter<DOMRect>();

  @ViewChild('domino') domino!: ElementRef;
  @ViewChild('draggable', { static: true }) draggable!: CdkDrag;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initial']) {
      this.isLocked = true;
      this.isEnd = true;
    }
  }

  public getIsVertical() {
    return this.direction % 2 == 1;
  }

  public setPosition(x: number, y: number) {
    const currentPosition = this.draggable._dragRef.getFreeDragPosition();
    this.draggable._dragRef.setFreeDragPosition({
      x: currentPosition.x - x,
      y: currentPosition.y - y,
    });
    this.isLocked = true;
    this.isEnd = true;
  }

  ngAfterViewInit() {
    this.emitPosition();
  }

  private emitPosition() {
    const rect = this.domino.nativeElement.getBoundingClientRect();

    this.rect = rect;
    this.positionChanged.emit(this.rect);
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
}
