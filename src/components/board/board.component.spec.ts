import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Board } from './board.component';

describe('Board', () => {
  let component: Board;
  let fixture: ComponentFixture<Board>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Board],
    }).compileComponents();

    fixture = TestBed.createComponent(Board);
    component = fixture.componentInstance;
  });

  it('should return true when rectangles are within the proximity', () => {
    const rect1 = { left: 0, right: 100, top: 0, bottom: 100 } as DOMRect;
    const rect2 = { left: 105, right: 205, top: 0, bottom: 100 } as DOMRect;
    const proximity = 10;

    const result = component.areRectanglesClose(rect1, rect2, proximity);
    expect(result).toBeTrue(); // Test passes if the rectangles are within 10px proximity
  });

  it('should return false when rectangles are far apart', () => {
    const rect1 = { left: 0, right: 100, top: 0, bottom: 100 } as DOMRect;
    const rect2 = { left: 120, right: 220, top: 0, bottom: 100 } as DOMRect;
    const proximity = 10;

    const result = component.areRectanglesClose(rect1, rect2, proximity);
    expect(result).toBeFalse(); // Test passes if rectangles are too far apart
  });

  it('should return true when rectangles exactly touch at the threshold', () => {
    const rect1 = { left: 0, right: 100, top: 0, bottom: 100 } as DOMRect;
    const rect2 = { left: 110, right: 210, top: 0, bottom: 100 } as DOMRect;
    const proximity = 10;

    const result = component.areRectanglesClose(rect1, rect2, proximity);
    expect(result).toBeTrue(); // Test passes if rectangles touch exactly at 10px distance
  });

  it('should return false when rectangles are vertically far apart', () => {
    const rect1 = { left: 0, right: 100, top: 0, bottom: 100 } as DOMRect;
    const rect2 = { left: 0, right: 100, top: 150, bottom: 250 } as DOMRect;
    const proximity = 10;

    const result = component.areRectanglesClose(rect1, rect2, proximity);
    expect(result).toBeFalse(); // Test passes if rectangles are vertically too far apart
  });
});
