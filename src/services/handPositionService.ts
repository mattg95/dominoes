import { Injectable } from '@angular/core';
import { Hand } from '../components/hand/hand.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HandPositionService {
  private handPosition: DOMRect | null = null;
  private dominoValues = new BehaviorSubject<{
    values: number[];
    isPlayersTurn: boolean;
  }>(null); // Initial value can be set to null or any default value
  private hands: Hand[] = []; // Array to store two Hand instances
  private currentHandIndex = 0; // Track which Hand was last called

  registerHand(hand: Hand) {
    if (this.hands.length < 2) {
      this.hands.push(hand);
    }
  }

  newDomino$ = this.dominoValues.asObservable();

  setHandPosition(rect: DOMRect) {
    // this.handPosition = rect;

    this.handPosition = rect;
  }

  getHandPosition(): DOMRect | null {
    const hand = this.getNextHand();
    if (hand) {
      return this.handPosition;
    }
    return null;
  }

  setDominoValues(dominoValues) {
    this.dominoValues.next({
      values: dominoValues,
      isPlayersTurn: this.currentHandIndex === 0,
    });
  }

  // Helper function to alternate between the two Hand instances
  private getNextHand(): Hand | null {
    if (this.hands.length === 0) return null; // No hands registered

    const hand = this.hands[this.currentHandIndex];

    // Alternate between the two Hand instances
    console.log('here', this.currentHandIndex);
    this.currentHandIndex = (this.currentHandIndex + 1) % this.hands.length;

    return hand;
  }
}
