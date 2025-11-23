import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  selectedNumber: number | null = null;
  errors = 0;

  board: string[] = [];
  solution: string[] = [];
  boardTiles: any[] = [];
  difficulty: string = '';
  score = 100; // Starting score
  totalMoves: number = 0;

  isGameFinished: boolean = false;
  isGameRevealed: boolean = false;
  isErrorMovedExceeded: boolean = false;
  gameStatus: string = ""
  user: any = {};
  userid: number = 0;

  levels: any[] = [
    { name: 'Easy', code: 'easy' },
    { name: 'Medium', code: 'medium' },
    { name: 'Hard', code: 'hard' },
  ];

  minutes: number = 0;
  seconds: number = 0;
  private timer: any; // Reference for setInterval
  private gameInProgress: boolean = false;

  constructor(private messageService: MessageService, private globalService: GlobalService) {

  }

  ngOnInit() {
    var data = localStorage.getItem("user");
    if (data != null && data != undefined) {
      this.user = JSON.parse(data);
      this.userid = this.user.userid;
    }
    this.startNewGame();
  }

  startNewGame() {
    this.submitGame();
    this.isGameFinished = false;
    this.isGameRevealed = false;
    this.isErrorMovedExceeded = false;
    this.errors = 0;
    this.score = 100;
    this.boardTiles = [];
    this.generateSudoku(this.difficulty);  // Pass the selected difficulty
    this.setGame();
    this.resetTimer();
    this.gameInProgress = true;
    this.startTimer();
  }

  generateSolvedSudoku(): string[] {
    const baseBoard = [
      '123456789',
      '456789123',
      '789123456',
      '231564897',
      '564897231',
      '897231564',
      '312645978',
      '645978312',
      '978312645',
    ];

    // Shuffle rows, columns, and numbers to randomize
    const shuffledRows = this.shuffleRows(baseBoard);
    const shuffledCols = this.shuffleColumns(shuffledRows);

    return this.shuffleNumbers(shuffledCols);
  }

  shuffleRows(board: string[]): string[] {
    const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

    // Shuffle rows within blocks
    const rowBlocks = [
      shuffle(board.slice(0, 3)),
      shuffle(board.slice(3, 6)),
      shuffle(board.slice(6, 9)),
    ];

    return [...rowBlocks[0], ...rowBlocks[1], ...rowBlocks[2]];
  }

  shuffleColumns(board: string[]): string[] {
    const transpose = (matrix: string[]) =>
      matrix[0].split('').map((_, colIndex) => matrix.map(row => row[colIndex]).join(''));

    // Transpose, shuffle rows (now columns), and transpose back
    const transposed = transpose(board);
    const shuffledRows = this.shuffleRows(transposed);
    return transpose(shuffledRows);
  }

  shuffleNumbers(board: string[]): string[] {
    const numbers = '123456789'.split('');
    const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
    const mapping: { [key: string]: string } = {};

    numbers.forEach((num, index) => {
      mapping[num] = shuffledNumbers[index];
    });

    return board.map(row =>
      row
        .split('')
        .map(cell => mapping[cell] || cell)
        .join('')
    );
  }

  generateSudoku(difficulty: string) {
    const solvedBoard = this.generateSolvedSudoku();
    this.solution = [...solvedBoard];

    // Determine the number of clues (pre-filled cells) based on difficulty
    let clueCount: number;

    if (difficulty === 'easy') {
      clueCount = 75;  // 45 clues for easy
    } else if (difficulty === 'medium') {
      clueCount = 35;  // 35 clues for medium
    } else {  // 'hard'
      clueCount = 25;  // 25 clues for hard
    }

    // Create a board with random removed clues
    this.board = this.removeNumbersForDifficulty(solvedBoard, clueCount);
  }

  removeNumbersForDifficulty(board: string[], clueCount: number): string[] {
    // Flatten the board into a single array of cells
    const flattenedBoard = board.join('').split('');
    const indicesToKeep = new Set<number>();

    // Randomly select which indices to keep as clues
    while (indicesToKeep.size < clueCount) {
      const randomIndex = Math.floor(Math.random() * flattenedBoard.length);
      indicesToKeep.add(randomIndex);
    }

    // Create the puzzle board with '-'
    const puzzleBoard = flattenedBoard.map((cell, index) => {
      return indicesToKeep.has(index) ? cell : '-';
    });

    // Convert the flattened array back into 9 rows
    const puzzleRows = [];
    for (let i = 0; i < 9; i++) {
      puzzleRows.push(puzzleBoard.slice(i * 9, (i + 1) * 9).join(''));
    }

    return puzzleRows;
  }



  setGame() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const tile = {
          id: `${r}-${c}`,
          value: this.board[r][c] !== '-' ? this.board[r][c] : '',
          classes: this.getTileClasses(r, c),
        };
        this.boardTiles.push(tile);
      }
    }
  }

  getTileClasses(r: number, c: number): string {
    let classes = 'tile';
    if (this.board[r][c] !== '-') classes += ' tile-start';
    if (r === 2 || r === 5) classes += ' horizontal-line';
    if (c === 2 || c === 5) classes += ' vertical-line';
    return classes;
  }

  selectNumber(number: number) {
    this.selectedNumber = number;
  }

  selectTile(tile: any) {
    if (!this.selectedNumber || tile.value) return;

    const [row, col] = tile.id.split('-').map(Number);
    if (!this.isValidMove(this.selectedNumber.toString(), row, col)) {
      // Invalid placement
      tile.classes += ' tile-error';

      // Increment the error count and update the UI
      this.errors++;
      this.updateScore();
      this.updateErrorCount();

      // Remove error indication after a short delay (500ms)
      setTimeout(() => {
        tile.classes = tile.classes.replace(' tile-error', '');
      }, 500);

      return; // Stop further execution if the move is invalid
    }

    // Check if the number is correct according to the solution
    if (this.solution[row][col] === this.selectedNumber.toString()) {
      // Place the number if it's correct
      tile.value = this.selectedNumber.toString();
      this.board[row] = this.board[row].substring(0, col) + this.selectedNumber + this.board[row].substring(col + 1);
      this.totalMoves += 1
    } else {
      // If the number is wrong, show error indication
      tile.classes += ' tile-error';

      // Increment the error count for incorrect number placement
      this.errors++;
      this.updateErrorCount();
      this.updateScore();

      // Remove error indication after a short delay (500ms)
      setTimeout(() => {
        tile.classes = tile.classes.replace(' tile-error', '');
      }, 500);
    }

    this.checkGameCompletion();
  }


  // Method to update the error count in the UI
  updateErrorCount() {
    const errorDisplay = document.getElementById('errors');
    if (errorDisplay) {
      errorDisplay.innerText = this.errors.toString();
    }
  }


  isValidMove(num: string, row: number, col: number): boolean {
    // Check the row
    for (let c = 0; c < 9; c++) {
      if (this.board[row][c] === num) return false;
    }

    // Check the column
    for (let r = 0; r < 9; r++) {
      if (this.board[r][col] === num) return false;
    }

    // Check the 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (this.board[r][c] === num) return false;
      }
    }

    return true; // Move is valid
  }

  revealGame() {
    this.isGameRevealed = true;
    // Loop through each tile and reveal the correct number
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const tile = this.boardTiles.find(t => t.id === `${r}-${c}`);
        if (tile) {
          tile.value = this.solution[r][c];  // Set the value from the solution
          tile.classes = tile.classes.replace('tile-error', '');  // Remove any error styling
        }
      }
    }
  }

  updateScore() {
    const penaltyPerError = 5; // Deduct 5 points per error
    this.score = 100 - this.errors * penaltyPerError;

    // Ensure the score doesn't go below 0
    if (this.score < 0) this.score = 0;
    console.log(this.score)
    if (this.errors > 5) {
      this.isErrorMovedExceeded = true;
      this.submitGame();
    }
  }

  checkGameCompletion() {
    // Check if the board is fully completed correctly
    let isCompleted = this.board.every((row, r) =>
      row.split('').every((cell, c) => cell === this.solution[r][c])
    );

    if (isCompleted) {
      this.isGameFinished = true;
      this.messageService.add({ severity: 'success', summary: 'Game Finished!' });
      this.submitGame();
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.gameInProgress) {
        this.seconds++;
        if (this.seconds === 60) {
          this.minutes++;
          this.seconds = 0;
        }
      }
    }, 1000);
  }

  resetTimer() {
    clearInterval(this.timer); // Clear any existing timer
    this.minutes = 0;
    this.seconds = 0;
  }

  submitGame() {
    var GameData = {
      user_id: 0,
      difficulty: "",
      score: 0,
      errors: 0,
      status: "",
      moves: 0,
      time:""
    }
    if (this.totalMoves > 0 || this.isGameRevealed || this.errors > 5) {
      console.log(this.score)
      console.log(this.totalMoves)
      console.log(this.errors)
      if (this.isErrorMovedExceeded) {
        this.gameStatus = "Error Moves Exceeded"
      }
      else if (this.isGameFinished) {
        this.gameStatus = "Completed";
      }
      else if (this.isGameRevealed) {
        this.gameStatus = "Revealed";
      }
      else if (!this.isGameRevealed && !this.isGameFinished) {
        this.gameStatus = "Abandoned";
        // make the score not available while submitting
      }
      console.log(this.gameStatus)
      GameData.user_id = this.userid;
      GameData.difficulty = this.difficulty == "" ? "medium" : this.difficulty;
      GameData.score = this.score;
      GameData.errors = this.errors;
      GameData.status = this.gameStatus;
      GameData.moves = this.totalMoves;
      GameData.time = String(this.minutes)+":"+String(this.seconds)
      this.globalService.saveGame(GameData).subscribe((response: any) => {
        console.log(response)
        if (this.errors > 5)
          this.messageService.add({ severity: 'error', summary: 'Game Finished. Errors exceeded' });
        this.gameInProgress = false;
        clearInterval(this.timer);
        this.isGameFinished = false;
        this.isGameRevealed = false;
        this.isErrorMovedExceeded = false;
        this.errors = 0;
        this.score = 100;
        this.totalMoves = 0;
        this.boardTiles = [];
        this.generateSudoku(this.difficulty);  // Pass the selected difficulty
        this.setGame();
        this.resetTimer();
        this.gameInProgress = true;
        this.startTimer();
      })
    }
  }

}
