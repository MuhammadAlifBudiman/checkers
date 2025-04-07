import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // 2D array for 8x8 checkers grid
  board: string[][] = [];
  currentPlayer: string = 'red';
  selectedPiece: { row: number; col: number } | null = null;
  gameOver: boolean = false;

  constructor() {
    this.initializeBoard();
  }

  initializeBoard(): void {
    this.board = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => {
        // Place black pieces on the first 3 rows
        if (row < 3 && (row + col) % 2 === 1) return 'black';
        // Place red pieces on the last 3 rows
        if (row > 4 && (row + col) % 2 === 1) return 'red';
        return '';
      })
    );
    this.currentPlayer = 'red'; // Red always starts
    this.selectedPiece = null;
    this.gameOver = false;
  }

  selectPiece(row: number, col: number): boolean {
    //  Chekcs if the selected cell belongs to the current player
    if (this.board[row][col].startsWith(this.currentPlayer)) {
      this.selectedPiece = { row, col };
      return true;
    }
    // return false if the cell does not belong to the current player
    return false;
  }

  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
  }

  // Count the number of pieces for a specific color on the board
  private countPieces(color: string): number {
    return this.board.flat().filter((piece) => piece.startsWith(color)).length;
  }

  private checkGameOver(): void {
    const redPieces = this.countPieces('red');
    const blackPieces = this.countPieces('black');

    if (redPieces === 0) {
      console.log('Game Over! Black wins!');
      this.gameOver = true;
    } else if (blackPieces === 0) {
      console.log('Game Over! Red wins!');
      this.gameOver = true;
    }
  }

  private isValidMove(targetRow: number, targetCol: number): boolean {
    // get row and column from selectedPiece
    const { row, col } = this.selectedPiece!;
    // get the piece at the selected position on the board
    const piece = this.board[row][col];
    // calculate distance to target
    const dx = targetCol - col;
    const dy = targetRow - row;

    // Check if the target cell is empty
    if (this.board[targetRow][targetCol] !== '') return false;

    const isKing = piece.includes('king');

    // Checks if the move is forward  for the respective player
    const forwardMove =
      (this.currentPlayer === 'red' && dy === -1) ||
      (this.currentPlayer === 'black' && dy === 1);

    if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
      // King can move both forward and backward
      return isKing || forwardMove;
    }

    // Jump move (capturing enemy pieces)
    if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
      const jumpedRow = (row + targetRow) / 2;
      const jumpedCol = (col + targetCol) / 2;
      return (
        this.board[jumpedRow][jumpedCol] !== '' &&
        !this.board[jumpedRow][jumpedCol].startsWith(this.currentPlayer)
      );
    }
    // returns false if it does not match any of those patterns from above
    return false;
  }

  movePiece(targetRow: number, targetCol: number): boolean {
    // if the move is not valid, return false
    if (!this.isValidMove(targetRow, targetCol)) {
      this.selectedPiece = null;
      return false;
    }

    // Get the current position of the selected piece
    const { row, col } = this.selectedPiece!;
    const piece = this.board[row][col];

    // Move the piece to the target position
    this.board[targetRow][targetCol] = piece;
    this.board[row][col] = '';

    // Handle jumping (capturing enemy piece)
    if (Math.abs(targetRow - row) === 2) {
      const jumpedRow = (row + targetRow) / 2;
      const jumpedCol = (col + targetCol) / 2;
      // Remove the captured piece
      this.board[jumpedRow][jumpedCol] = '';
    }

    // Handle king promotion (when a piece is on the opposite end)
    if (
      (this.currentPlayer === 'red' && targetRow === 0) ||
      (this.currentPlayer === 'black' && targetRow === 7)
    ) {
      this.board[targetRow][targetCol] = `${this.currentPlayer}-king`;
    }

    // Deselect the piece and switch the player
    this.selectedPiece = null;
    this.switchPlayer();
    this.checkGameOver();
    return true;
  }
}
