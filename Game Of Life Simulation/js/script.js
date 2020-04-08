
const canvas= document.getElementById("canvas");
const ctx= canvas.getContext("2d");

canvas.height= canvas.clientHeight;
canvas.width= canvas.clientWidth;

const height= canvas.height;
const width= canvas.width;

// Size of Cell and X,Y Offsets
const size= 20;
const ox= width%size/2;
const oy= height%size/2;

// Actual Height and Width of the grid
const gheight= parseInt(height/size);
const gwidth= parseInt(width/size);

// 0 is for empty cell
// 1 is for block cell

const colorMap= {0:"#ece7d4", 1:"#ee4540"};

function generateNewGrid(){
	let grid= [];
	for(let i=0; i<gheight; i++){
		grid.push([]);
		for(let j=0; j<gwidth; j++) grid[i].push(0);
	}
	return grid;
}

let grid= generateNewGrid();

let timeDelay= 100;
let gridLock= false;

function sleep(ms) {
	const start = new Date().getTime();
	while(new Date().getTime() < (start+ms));
}

function makeGrid(){

	ctx.fillStyle= "#c92a42";
	ctx.fillRect(0,0, width, height);

	for(let y=0; y<gheight; y++){
		for(let x=0; x<gwidth; x++){
			ctx.fillStyle= colorMap[ grid[y][x] ];
			ctx.fillRect(size*x+ox+1, size*y+oy+1, size-1, size-1);
		}
	}

}

function setTimeDelay(){
	timeDelay= document.getElementById("delay").value;
	try{
		timeDelay= parseInt(timeDelay);
	}catch(err){
		console.log("Invalid Delay Value! Setting Time Delay to 100!");
		timeDelay= 100;
	}
	if(timeDelay<10){
		timeDelay= 40;
		document.getElementById("delay").value= 40;	
	}
}

function updateGeneration(){
	
	let sum= 0;
	let updatedGrid= generateNewGrid();

	for(let y=1; y<gheight-1; y++){
		for(let x=1; x<gwidth-1; x++){

			sum= 0;

			for(let i=-1; i<=1; i++){
				for(let j=-1; j<=1; j++){
					sum+= grid[ (y+i)%gheight ][ (x+j)%gwidth ];	
				}
			}

			sum-= grid[y][x];

			if(grid[y][x]==0 && sum==3){
				updatedGrid[y][x]= 1;
			}else if(grid[y][x]==1 && sum>3){
				updatedGrid[y][x]= 0;
			}else if(grid[y][x]==1 && sum<2){
				updatedGrid[y][x]= 0;
			}else if(sum==2 || sum==3){
				if(grid[y][x]==1) updatedGrid[y][x]= 1;
			}

		}
	}

	grid= updatedGrid;

}

let stop_signalled= true;
function simulateGameOfLife(){
	if(stop_signalled) return;
	sleep(timeDelay);
	updateGeneration();
	makeGrid();
	requestAnimationFrame(simulateGameOfLife);
}

// ===========================================================
// ===========================================================

let changeBlock= '';
function addBlock(ey, ex, set=false){ // Adds/Removes cells in the grid.
	
	const offy= (window.innerHeight-canvas.height);
	const offx= (window.innerWidth-size*gwidth)/2;

	if(ex>offx && ey>offy && ey<(window.innerHeight-oy*2)){
		
		const x= ex - offx;
		const y= ey - offy;

		const coordx= parseInt(x/size);
		const coordy= parseInt(y/size);

		if(set){
			if( grid[coordy][coordx]==0  ) changeBlock= 1;
			else changeBlock= 0;
		}

		grid[coordy][coordx]= changeBlock;

		requestAnimationFrame(makeGrid);
	}

}

makeGrid();

// Control Bar System -------------------------------------
document.getElementById("step").onmousedown = function(){
	updateGeneration();
	makeGrid();
}
document.getElementById("main-control").onmousedown = function(){
	if(stop_signalled){
		stop_signalled= false;
		setTimeDelay();
		simulateGameOfLife();
		gridLock= true;
		document.getElementById("main-control").innerHTML= "STOP";
		document.getElementById("main-control").style.backgroundColor= "#c22326";
	}else{
		stop_signalled= true;
		gridLock= false;
		document.getElementById("main-control").innerHTML= "START";
		document.getElementById("main-control").style.backgroundColor= "#ee4540";
	}
}
// -------------------------------------------------------------

// Continuous Cell Capture System
// -------------------------------------------
let capture= false;
document.onmousemove = function(e){
    if(!capture || gridLock) return;
    addBlock(e.clientY, e.clientX);
}

document.onmousedown= function(e){
	if(gridLock) return;
	capture= true;
	addBlock(e.clientY, e.clientX, true);
}

document.onmouseup= function(e){
	capture= false;
}
// -------------------------------------------
