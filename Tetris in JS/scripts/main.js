
// const freq= 3000;
function changeThemeColor(color){
	// let r= Math.floor( Math.random() * 256 );
	// let g= Math.floor( Math.random() * 256 );
	// let b= Math.floor( Math.random() * 256 );
	// const color= "rgb("+r+","+g+","+b+")";
	document.getElementById("title-holder").style.color = color;
	document.getElementById("footer-container").style.backgroundColor= color;
}


// setInterval( ()=>changeTitleColor() , freq );
// update(); 
// document.addEventListener('keydown', (event)=>{
// 	changeTitleColor();
// });	


// function isMobileDevice(){  
// 	try{  
// 		document.createEvent("TouchEvent");  
// 		console.log("Mobile Device Detected!");
// 		enableMobileControls();
// 		return true;  
// 	}catch(err){  
// 		return false;  
// 	}  
// }


