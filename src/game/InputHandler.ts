export interface InputState {
  isDown: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export class InputHandler {
  private state: InputState = {
    isDown: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  };

  onPointerDown(x: number, y: number): void {
    this.state.isDown = true;
    this.state.startX = x;
    this.state.startY = y;
    this.state.currentX = x;
    this.state.currentY = y;
  }

  onPointerMove(x: number, y: number): void {
    if (this.state.isDown) {
      this.state.currentX = x;
      this.state.currentY = y;
    }
  }

  onPointerUp(x: number, y: number): void {
    this.state.currentX = x;
    this.state.currentY = y;
    this.state.isDown = false;
  }

  getState(): Readonly<InputState> {
    return this.state;
  }

  getDrag(): { dx: number; dy: number; distance: number } {
    const dx = this.state.startX - this.state.currentX;
    const dy = this.state.startY - this.state.currentY;
    return {
      dx,
      dy,
      distance: Math.sqrt(dx * dx + dy * dy),
    };
  }
}
