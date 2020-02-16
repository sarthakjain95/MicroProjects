
const controlBar= document.getElementById("control-bar");
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
// 2 for obstacle cell

const colorMap= {"0":"#2a2b2d", "1":"#2ea8d9", "2":"#d8514e"};

let grid= [];
for(let i=0; i<gheight; i++){
	grid.push([]);
	for(let j=0; j<gwidth; j++) grid[i].push(0);
}

let step= 0;
const steps_map= {'1':[1,"ADD DROP CELLS"], '2':[2, "ADD OBSTACLE CELLS"], '3':[-1, "RUN!"]};

const timeDelay= 250;
let gridLock= false;

let objects= [];

let lastGrid= [];

// let timeDelay= 250;

// function setTimeDelay(n){
// 	timeDelay= n;
// }

function sleep(ms) {
	const start = new Date().getTime();
	while(new Date().getTime() < (start+ms));
}

function makeGrid(){

	ctx.fillStyle= "black";
	ctx.fillRect(0,0, width, height);

	for(let y=0; y<gheight; y++){
		for(let x=0; x<gwidth; x++){
			ctx.fillStyle= colorMap[ grid[y][x] ];
			ctx.fillRect(size*x+ox+1, size*y+oy+1, size-1, size-1);
		}
	}

}

function nextStep(){
	
	if(step==1){
		let blockPresent= false;
		for(let i=0; i<gheight; i++)
			for(let j=0; j<gwidth; j++)
				if(grid[i][j]==1) blockPresent= true;

		if(!blockPresent) return;
	}

	step++;
	if(step>2){
		gridLock= true;
		lastGrid= [];
		objects= [];
		collectObjects();
		dropGrid();
	}else{
		controlBar.innerHTML= steps_map[step][1];
	}
}

function isValid(cy, cx){
	if( cx<0 || cy<0 ) return false;
	if( cx>=gwidth || cy >=gheight ) return false;
	return true;
}

function baseIsClear(coords){

	const base= [];
	const x_coords= [];

	for(let coord of coords) 
		if( x_coords.indexOf(coord[1])==-1 ) x_coords.push(coord[1]);

	for(const x of x_coords){
		let lowest_y= 0;
		for(let coord of coords)
			if(coord[1]==x && coord[0]>lowest_y) lowest_y= coord[0];
		base.push( [lowest_y, x] );
	}

	for(const coord of coords){

		let clear= false;
		if( !isValid(coord[0]+1, coord[1]) ) return false;
		if( grid[coord[0]+1][coord[1]]==0 ){ clear= true; }
		else if( grid[coord[0]+1][coord[1]]==1 ){
			for(let pos of coords)
				if( pos[0]==(coord[0]+1) && pos[1]==coord[1] ) clear= true;
		}

		if(!clear) return false;
	}

	for(let coord of base)
		if(  !isValid(coord[0]+1, coord[1]) || grid[coord[0]+1][coord[1]] != 0 ) return false; 

	return true;

}

let surroundingCoordinates= [];
function collectCoords(y,x){ // Recursively Collects all the Objects

	for(let coord of surroundingCoordinates)
		if( coord[0]==y && coord[1]==x ) return;

	surroundingCoordinates.push([y,x]);

	if( isValid(y+1, x) && (grid[y+1][x]==1) ) collectCoords(y+1, x);
	if( isValid(y-1, x) && (grid[y-1][x]==1) ) collectCoords(y-1, x);
	if( isValid(y, x-1) && (grid[y][x-1]==1) ) collectCoords(y, x-1);
	if( isValid(y, x+1) && (grid[y][x+1]==1) ) collectCoords(y, x+1);

}

function checkCell(cy, cx){ // Checks a cell to see if there are valid cells attached to this one

	surroundingCoordinates= [];

	if( isValid(cy+1, cx) && (grid[cy+1][cx]==1) ){ collectCoords(cy, cx); }
	else if( isValid(cy-1, cx) && (grid[cy-1][cx]==1) ){ collectCoords(cy, cx); }
	else if( isValid(cy, cx-1) && (grid[cy][cx-1]==1) ){ collectCoords(cy, cx); }
	else if( isValid(cy, cx+1) && (grid[cy][cx+1]==1) ){ collectCoords(cy, cx); }
	else if( isValid(cy+1, cx) && grid[cy+1][cx]==0 ){ return [[cy, cx]]; }

	return surroundingCoordinates;
}

function collectObjects(){

	for(let y=gheight-2; y>=0; y--){
		for(let x=gwidth-1; x>=0; x--){
			if( grid[y][x]==1 ){

				let exists= false;
				for(const obj of objects){
					for(const coord of obj){
						if( coord[0]==y && coord[1]==x ) exists= true;
					}
				}

				if(exists) continue;

				let newObj= checkCell(y,x);
				objects.push(newObj);

			}
		}
	}

}

function dropGrid(){
	
	if(lastGrid.join(',')!=grid.join(',')){  // Repeats until there are not changes left

		controlBar.innerHTML= steps_map[3][1];
		controlBar.style.backgroundColor= "#30cb01";

		sleep(timeDelay);

		lastGrid= [];
		for(const level of grid) lastGrid.push(level.join(',').split(','));

		for(let i=0; i<objects.length; i++) { // Objects is an array of arrays.
			if( baseIsClear(objects[i]) ) { // Checks every object to see if it can be moved down by one cell
				let obj= objects[i];
				for(const crd of obj) grid[crd[0]][crd[1]]= 0;
				for(const crd of obj) grid[crd[0]+1][crd[1]]= 1;
				for(let i=0; i<obj.length; i++){ // Updates every coordinate of that object by 'one'
					let coord= obj.pop();
					coord[0]+=1;
					obj.unshift(coord);
				}
			}
		}
		
		requestAnimationFrame(makeGrid);
		requestAnimationFrame(dropGrid);
	}else{
		gridLock= false; // Enables Editing
		step= 1;
		controlBar.innerHTML= steps_map[step][1];
		controlBar.style.backgroundColor= "black";
	}

}

// function resetGrid(){

// 	for(let i=0; i<gheight; i++)
// 		for(let j=0; j<gwidth; j++) grid[i][j]= 0;

// 	requestAnimationFrame(makeGrid);

// }

let changeBlock= '';
function addBlock(ey, ex, set=false){ // Adds a new cell to the grid.
	
	const offy= (window.innerHeight-canvas.height);
	const offx= (window.innerWidth-size*gwidth)/2;

	if(ex>offx && ey>offy && ey<(window.innerHeight-oy*2)){
		
		const x= ex - offx;
		const y= ey - offy;

		const coordx= parseInt(x/size);
		const coordy= parseInt(y/size);

		if(set){
			if( grid[coordy][coordx]==0  ) changeBlock= steps_map[step][0];
			else if( grid[coordy][coordx]==steps_map[step][0] ) changeBlock= 0;
			else changeBlock= '';
		}

		if( changeBlock==0 ){
			if( grid[coordy][coordx]==steps_map[step][0] ) grid[coordy][coordx]= 0;
		}else if( grid[coordy][coordx]==0 ) grid[coordy][coordx]= changeBlock;

		requestAnimationFrame(makeGrid);
	}

}

makeGrid();
nextStep();

// Control Bar Hover System -------------------------------------
document.getElementById("control-bar").onmouseover = function(){
	this.style.backgroundColor= colorMap[step];
	this.style.borderBottom= "0px";
}
document.getElementById("control-bar").onmousedown = function(){
	this.style.backgroundColor= colorMap[step];
	this.style.borderBottom= "0px";
	nextStep();
}
document.getElementById("control-bar").onmouseout = function(){
	this.style.backgroundColor= "black";
	this.style.color= "white";
	this.style.borderBottom= "1px solid white";
}
// -------------------------------------------------------------

// Continuous Cell Capture System
// -------------------------------------------
let capture= false;
document.onmousemove = function(e){
    if(!capture || gridLock) return;
    const cursorX = e.clientX;
    const cursorY = e.clientY;
    addBlock(cursorY, cursorX);
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
