import { Injectable } from '@angular/core';

/**
 * Injectable service for managing the game logic of a checkers game.
 * Handles board initialization, piece selection, movement, and game state.
 */
@Injectable({
  providedIn: 'root',
})
export class GameService {
  /**
   * 2D array representing the 8x8 checkers grid.
   * Each cell contains a string representing the piece ('red', 'black', 'red-king', 'black-king') or is empty ('').
   */
  board: string[][] = [];

  /**
   * The current player ('red' or 'black').
   */
  currentPlayer: string = 'red';

  /**
   * The currently selected piece, represented by its row and column indices.
   * Null if no piece is selected.
   */
  selectedPiece: { row: number; col: number } | null = null;

  /**
   * Boolean flag indicating whether the game is over.
   */
  gameOver: boolean = false;

  /**
   * Constructor initializes the board and sets the initial game state.
   */
  constructor() {
    this.initializeBoard();
  }

  /**
   * Initializes the checkers board with pieces in their starting positions.
   * Black pieces occupy the first 3 rows, red pieces occupy the last 3 rows.
   */
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

  /**
   * Selects a piece on the board if it belongs to the current player.
   * @param row - The row index of the piece to select.
   * @param col - The column index of the piece to select.
   * @returns True if the piece was successfully selected, false otherwise.
   */
  selectPiece(row: number, col: number): boolean {
    // Checks if the selected cell belongs to the current player
    if (this.board[row][col].startsWith(this.currentPlayer)) {
      this.selectedPiece = { row, col };
      return true;
    }
    // Return false if the cell does not belong to the current player
    return false;
  }

  /**
   * Switches the current player to the other player.
   */
  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
  }

  /**
   * Counts the number of pieces of a specific color on the board.
   * @param color - The color of the pieces to count ('red' or 'black').
   * @returns The number of pieces of the specified color.
   */
  private countPieces(color: string): number {
    return this.board.flat().filter((piece) => piece.startsWith(color)).length;
  }

  /**
   * Checks if the game is over by counting the remaining pieces for each player.
   * Declares the winner if one player has no pieces left.
   */
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

  /**
   * Validates whether a move is valid for the selected piece.
   * @param targetRow - The row index of the target cell.
   * @param targetCol - The column index of the target cell.
   * @returns True if the move is valid, false otherwise.
   */
  private isValidMove(targetRow: number, targetCol: number): boolean {
    // Get row and column from selectedPiece
    const { row, col } = this.selectedPiece!;
    // Get the piece at the selected position on the board
    const piece = this.board[row][col];
    // Calculate distance to target
    const dx = targetCol - col;
    const dy = targetRow - row;

    // Check if the target cell is empty
    if (this.board[targetRow][targetCol] !== '') return false;

    const isKing = piece.includes('king');

    // Checks if the move is forward for the respective player
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
    // Returns false if it does not match any of those patterns from above
    return false;
  }

  /**
   * Moves the selected piece to the target cell if the move is valid.
   * Handles capturing enemy pieces and king promotion.
   * @param targetRow - The row index of the target cell.
   * @param targetCol - The column index of the target cell.
   * @returns True if the move was successful, false otherwise.
   */
  movePiece(targetRow: number, targetCol: number): boolean {
    // If the move is not valid, return false
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
