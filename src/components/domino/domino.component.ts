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
import { CdkDragStart, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'domino',
  standalone: true,
  imports: [Dots, CommonModule, CdkDrag],
  templateUrl: './domino.component.html',
  styleUrl: './domino.component.css',
})
export class Domino {
  isVertical = false;
  public dragging = false;
  public isDragDisabled = false;
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
    this.isVertical = !this.isVertical;
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
