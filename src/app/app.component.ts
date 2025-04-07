import { Component } from '@angular/core';
import { CheckersComponent } from './components/checkers/checkers.component';

@Component({
  selector: 'app-root',
  imports: [CheckersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
