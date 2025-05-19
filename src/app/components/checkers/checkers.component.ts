import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';

/**
 * The CheckersComponent is responsible for managing the checkers game UI and interactions.
 * It interacts with the GameService to handle game logic and state.
 */
@Component({
  selector: 'app-checkers', // The HTML tag used to include this component.
  imports: [CommonModule], // Modules imported for use in this component.
  templateUrl: './checkers.component.html', // Path to the HTML template for this component.
  styleUrl: './checkers.component.scss', // Path to the SCSS styles for this component.
})
export class CheckersComponent {
  /**
   * Constructor initializes the component with the GameService.
   * @param gameService - The service managing the game logic and state.
   */
  constructor(public gameService: GameService) {}

  /**
   * Handles the logic when a cell on the board is clicked.
   * @param row - The row index of the clicked cell.
   * @param col - The column index of the clicked cell.
   */
  onCellClick(row: number, col: number): void {
    if (this.gameService.gameOver) return; // Do nothing if the game is over.
    if (this.gameService.selectedPiece) {
      this.gameService.movePiece(row, col); // Move the selected piece to the clicked cell.
    } else {
      this.gameService.selectPiece(row, col); // Select a piece at the clicked cell.
    }
  }

  /**
   * Checks if a cell is currently selected.
   * @param rowIndex - The row index of the cell.
   * @param colIndex - The column index of the cell.
   * @returns True if the cell is selected, otherwise false.
   */
  isSelected(rowIndex: number, colIndex: number): boolean {
    return (
      this.gameService.selectedPiece?.row === rowIndex &&
      this.gameService.selectedPiece?.col === colIndex
    );
  }

  /**
   * Resets the game by reinitializing the board.
   */
  resetGame(): void {
    this.gameService.initializeBoard();
  }

  /**
   * Handles the click event on a cell, including piece selection and movement.
   * @param row - The row index of the clicked cell.
   * @param col - The column index of the clicked cell.
   */
  handleClick(row: number, col: number): void {
    const piece = this.gameService.board[row][col];

    // Prevent clicking on opponent's piece
    if (piece && !piece.startsWith(this.gameService.currentPlayer)) return;

    this.onCellClick(row, col);
  }
}
