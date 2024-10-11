import { Injectable } from '@angular/core';
import { Hand } from '../components/hand/hand.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HandPositionService {
  private handPosition: DOMRect | null = null;
  private dominoValues = new BehaviorSubject<number[]>(null); // Initial value can be set to null or any default value

  newDomino$ = this.dominoValues.asObservable();

  setHandPosition(rect: DOMRect) {
    this.handPosition = rect;
  }

  getHandPosition(): DOMRect | null {
    return this.handPosition;
  }

  setDominoValues(dominoValues) {
    this.dominoValues.next(dominoValues);
  }
}
