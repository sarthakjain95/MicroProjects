
// Data is the puzzle
let data= [
	[5,3,0,0,7,0,0,0,0],
	[6,0,0,1,9,5,0,0,0],
	[0,9,8,0,0,0,0,6,0],
	[8,0,0,0,6,0,0,0,3],
	[4,0,0,8,0,3,0,0,1],
	[7,0,0,0,2,0,0,0,6],
	[0,6,0,0,0,0,2,8,0],
	[0,0,0,4,1,9,0,0,5],
	[0,0,0,0,8,0,0,7,9]
];

// Scans the puzzle verticall and horizontally (and the sector) to see if the element exists
function validPlacement(r, c, val) {
	for(let i=0; i<9; i++) {
		// Checks all 9 positions in the respective sector
		const m= 3*Math.floor(r/3) + Math.floor(i/3);
		const n= 3*Math.floor(c/3) + i%3;
		// Simultaneously checks sector, horizontal-row and vertical-row
		if( data[r][i] == val || data[i][c] == val || data[m][n] == val ) return false;
	}
	return true;
}

// Solves the global puzzle 'data' using backtracking.
function solveSudoku(){
	// Iterates through all the elements in the array
	for(let y=0; y<9; y++)
		for(let x=0; x<9; x++)
			// Only check for empty spaces
			if(data[y][x]==0) {
				// Tries every single value at the empty place
				for(let n=1; n<=9; n++) {
					// Tests to see if the value is valid at that position
					if(validPlacement(y, x, n)) {
						data[y][x]= n;
						// Sovles the sudoku further with the manipulated data
						if( solveSudoku() ) return data;
						else data[y][x]= 0;
					}
				}
				// If the sudoku is invalid with all the values for 'n', something 
				// is wrong in the puzzle.
				return false;
			}
	return data;
}

let res= solveSudoku();

if(res) console.log("Solved the puzzle successfully!","\n",data);
else console.log("Could not solve the puzzle");
