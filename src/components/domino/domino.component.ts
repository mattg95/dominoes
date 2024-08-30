import { Component, Input } from '@angular/core';
import { Dots } from '../dots/dots.component';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragStart } from '@angular/cdk/drag-drop';

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

  private rotate() {
    this.isVertical = !this.isVertical;
  }

  public handleDragStart(_: CdkDragStart): void {
    this.dragging = true;
  }

  public handleDragEnd(_: CdkDragStart): void {
    this.dragging = false;
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
