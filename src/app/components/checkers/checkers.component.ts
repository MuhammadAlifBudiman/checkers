import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-checkers',
  imports: [CommonModule],
  templateUrl: './checkers.component.html',
  styleUrl: './checkers.component.scss',
})
export class CheckersComponent {
  constructor(public gameService: GameService) {}

  onCellClick(row: number, col: number): void {
    if (this.gameService.gameOver) return;
    if (this.gameService.selectedPiece) {
      this.gameService.movePiece(row, col);
    } else {
      this.gameService.selectPiece(row, col);
    }
  }

  isSelected(rowIndex: number, colIndex: number): boolean {
    return (
      this.gameService.selectedPiece?.row === rowIndex &&
      this.gameService.selectedPiece?.col === colIndex
    );
  }

  resetGame(): void {
    this.gameService.initializeBoard();
  }

  handleClick(row: number, col: number): void {
    const piece = this.gameService.board[row][col];

    // Prevent clicking on opponent's piece
    if (piece && !piece.startsWith(this.gameService.currentPlayer)) return;

    this.onCellClick(row, col);
  }
}
