
console.log("%cGO!","background-color:black; color:white; padding:10px");

const grid= [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

let score= 0;
let lost= false;

function loseGame(){

	console.log("Your final score is ", document.getElementById("score-value").innerHTML);
	lost= true;
	document.getElementById("score-value").innerHTML+="<br>You Lost!";
	document.getElementById('reset-button').style.visibility= "visible";

}

const updateCoordinate= (coord, update=0)=> grid[coord.y][coord.x]= update;

function hasValidMove(){

	for(let i=0; i<4; i++){
		for(let j=0; j<4; j++){
			if(grid[i][j]==0) return true;
			const val= grid[i][j];
			// console.log(grid[i-1]);
			if((i+1)<4 && grid[i+1][j]===val) return true;
			if((i-1)>=0 && grid[i-1][j]===val) return true;
			if((j+1)<4 && grid[i][j+1]===val) return true;
			if((j-1)>=0 && grid[i][j-1]===val) return true;
		}
	}

	return false;
}

function addNumber(){

	let options= [];
	for(let i=0; i<4; i++){
		for(let j=0; j<4; j++)
			if(grid[i][j]===0) options.push({x:j, y:i});
	}

	if(options.length==0 && !hasValidMove()){
		loseGame();
		return;
	}

	let chosen= options[ Math.floor( Math.random()*options.length ) ];
	grid[ chosen.y ][ chosen.x ]= Math.random() < 0.5 ? 2 : 4;
}


function drawGrid(){

	for(let i=0; i<4; i++){
		for(let j=0; j<4; j++){
			const elem= document.getElementById(String(i)+j);
			if(grid[i][j]!=0){
				elem.className= "grid-cell b"+String(grid[i][j]);
				elem.innerHTML= grid[i][j];
			}else{
				elem.className= "grid-cell";
				elem.innerHTML= "";
			}
		}
	}

	if(!lost) document.getElementById("score-value").innerHTML= String(score);

}

function updateGrid( dir, loopParameters ){
	
	if(lost) return;

	if(hasValidMove()){

		const initialGrid= JSON.stringify(grid);
		let lastGrid= "";

		while( JSON.stringify(grid) != lastGrid ){

			const start= window.performance.now();
			lastGrid= JSON.stringify(grid);

			for(let y=loopParameters.y[0]; y!=loopParameters.y[1]; y+=loopParameters.y[2]){
				for(let x=loopParameters.x[0]; x!=loopParameters.x[1]; x+=loopParameters.x[2]){

					const oldBlock= grid[y][x];
					const newBlock= grid[y+dir[1]][x+dir[0]];

					if( newBlock === oldBlock ){
						updateCoordinate({x:x+dir[0],y:y+dir[1]}, 2*grid[y][x]);
						score+= 2*grid[y][x];
						updateCoordinate({x:x,y:y});
					}
					else if( oldBlock!=0 && newBlock==0  ){
						updateCoordinate({x:x+dir[0],y:y+dir[1]}, grid[y][x]);
						updateCoordinate({x:x,y:y});
					}				
				}
			}
		}

		if( initialGrid != JSON.stringify(grid) ) addNumber();

		drawGrid();

	}else{
		loseGame();
	}
}

function captureInput(event){

	if( [37, 38, 39, 40].indexOf(event.keyCode) == -1 ) return;

	if( event.keyCode == 37 ) updateGrid( [0, -1], { x:[0,4,1], y:[3,0,-1] } );
	else if( event.keyCode == 38 ) updateGrid( [-1, 0], { x:[1,4,1], y:[0,4,1] } );
	else if( event.keyCode == 39 ) updateGrid( [0, 1], { x:[0,4,1], y:[2,-1,-1] } );
	else updateGrid( [1, 0], { x:[0,3,1], y:[0,4,1] } );

}

function resetGame(){

	lost= false;
	score= 0;

	for(let i=0; i<4; i++){
		for(let j=0; j<4; j++){
			grid[i][j]= 0;
		}
	}

	addNumber();
	addNumber();

	drawGrid();

	document.getElementById("reset-button").style.visibility= "hidden";

}

addNumber();
addNumber();
drawGrid();

document.addEventListener("keyup", captureInput);
