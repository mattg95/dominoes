import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Domino } from '../domino/domino.component';
import { HandPositionService } from '../../services/handPositionService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hand',
  standalone: true,
  imports: [Domino],
  templateUrl: './hand.component.html',
  styleUrl: './hand.component.css',
})
export class Hand {
  @ViewChild('handContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  dominoSubscription: Subscription = new Subscription();
  public newDominoValues: number[];
  @Input() isComputer = false;

  constructor(
    private root: ElementRef,
    private handPositionService: HandPositionService
  ) {}

  ngOnInit(): void {
    // Subscribe to the data$ Observable from the shared service
    this.dominoSubscription = this.handPositionService.newDomino$.subscribe(
      (data) => {
        if (data.isPlayersTurn === this.isComputer) {
          const newDomino = this.container.createComponent(Domino);
          this.container.insert(newDomino.hostView);

          this.newDominoValues = data.values;
          newDomino.instance.values = this.newDominoValues;
          this.emitPosition();
        }
      }
    );
    this.handPositionService.registerHand(this);
  }

  ngAfterViewInit() {
    this.emitPosition();
  }

  private emitPosition() {
    const rect = this.root.nativeElement.getBoundingClientRect();
    console.log('rect here;', rect);
    this.handPositionService.setHandPosition(rect);
  }

  addDomino(dominoComponent: any) {
    this.container.insert(dominoComponent);
  }
}
