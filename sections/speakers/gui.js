//require("./p5.js")
// require("./p5.dom.js")
//var smalltalk = require('smalltalk')
/*** Electon menus ***/


/**** p5 function ****/
var canvas;

var canvas_size =[]
var origin;
var send_spkrVals;
// The statements in the setup() function 
// execute once when the program begins

function openConfig(){

}

// Function to clear all speakers from canvas
function clearConfig(){
	speakers.splice(0,speakers.length)
	speakerCount = 0;
	console.log(speakers)
}

function setup() {
	// createCanvas must be the first statement
	canvas_size = [[(windowWidth-20),(windowHeight-20)],
					[(windowWidth-20),(windowHeight-20)]]
	canvas =  createCanvas(canvas_size[0][0], canvas_size[0][1]); 
	canvas.parent('config-canvas'); 
	origin = [(windowWidth-20)/2,(windowHeight-20)/2] 
	stroke(255);     // Set line drawing color to white
	frameRate(30);
	// var c = color('hsl(269, 100%, 95%)')
	background(color('hsl(269, 100%, 95%)'))
	// resolution = prompt('How many quare meters is your grid?')
	createGrid();
	//drawGrid();
	// Save Button
	send_spkrVals = createButton('save');
  	send_spkrVals.position(19, 19);
 	send_spkrVals.mousePressed(saveConfig);
 	// Open Button
	open_config = createButton('open');
  	open_config.position(19, 19+25);
 	open_config.mousePressed(openConfig);
 	// Clear Button
	clear_config = createButton('clear');
  	clear_config.position(19, 19+50);
 	clear_config.mousePressed(clearConfig);

 	show_coords = createButton('showCoords');
 	show_coords.position(19,19+75)
 	show_coords.mousePressed(showCoords)

 	wfs_array = createButton('wfs');
 	wfs_array.position(19, 19+100);
 	wfs_array.mousePressed(wfsConfig);
}
// The statements in draw() are executed until the 
// program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first 
// line is executed again.
function draw() { 
	background(color('hsl(269, 100%, 95%)'))
	showGrid()
	//drawGrid()
	for (var i = 0; i < speakers.length;i++){
		speakers[i].display();
		// WFS_module[i].display()
	}


}

function windowResized() {
	canvas_size[1] = canvas_size[0];
	canvas_size[0] = [(windowWidth-20),(windowHeight-20)]

	origin = [(windowWidth-20)/2,(windowHeight-20)/2] 
	console.log(origin);
	resizeCanvas(windowWidth-20, windowHeight-20);
	resizeGrid()
	resizeSpkrs()
	background(color('hsl(269, 100%, 95%)'))
}

var sel_spk = -1;

function mousePressed(){
		//console.log('pressed')
		if (mouseButton == RIGHT){
			// Check mouse is speaker is not already being dragged
			// check if mouse position on speaker
			var onSpkr = checkMouse();
			if (!onSpkr.flag){
				// If mouse not on speaker add new speaker object to the array
				speakerCount++
				console.log('speaker ' + speakerCount)
				console.log('pos   ' + mouseX + '   ' + mouseY )
				// Offset speaker position so centre is origin
				var x = mouseX - (windowWidth-20)/2
				var y = -(mouseY - (windowHeight-20)/2)

				console.log('x   ' + x)
				console.log('y   ' + y)

				speakers.push(new Speaker(mouseX,mouseY,0,speakerCount))
				speakers[speakerCount-1].display();
			} else {
				// If mouse on speaker delete speaker object from array and update remaining speakers	
				speakerCount--
				speakers.splice(onSpkr.idx,1)
				console.log("removed speaker " + onSpkr.idx)
				for (var i = 0; i < speakers.length; i++){
					if (i >= onSpkr.idx){
						speakers[i].number--;
					}
				}
				console.log('updated speaker numbers');
			}
			// Variable for drawing speakers
			// drawSpeakers = speakers;
		} else if (mouseButton == LEFT){
			for (var i = 0; i < speakerCount; i++){
				speakers[i].clicked()
				if(dist(mouseX,mouseY,speakers[i].cx,speakers[i].cy) < speakerDiameter)
					sel_spk = i;
			}
			dragged = true;
		}	
		// console.log(dragged)
		// console.log(sel_spk)
}


function mouseReleased(){
	if (mouseButton == LEFT){
		dragged = false;
	}	
	// console.log(dragged)
}

function mouseDragged(){
	if(mouseButton == LEFT){
		speakers[sel_spk].dragged()
		// sel_spk = -1;
		// if(dragged){

		// }
		// Check mouse isn't on speaker already
		// for (var i = 0; i <speakerCount; i++){
		// 	// speakers[i].dragged()
		// 	speakers[i].dragged()
		// }
	}
	else if (mouseButton == RIGHT){
		// create new speakers
		// if (Math.pow(speakers[speakerCount].x-mouseX) >= 20 || Math.pow(speakers[speakerCount].y-mouseY,2) >= 20 ){
		// 	speakerCount++
		// 	console.log('speaker ' + speakerCount)
		// 	speakers.push(new Speaker(mouseX,mouseY,0,speakerCount))
		// 	speakers[speakerCount-1].display();
		// }
	}
}

// function mouseClicked(){
// 	console.log('clicked')
// }

// function checkPressed(){
// 	for (var i = 0; i < speakers.length; i++){
// 		if (speakers[i].pressed == true){

// 		}
// 	}
// }

// Function to check if mouse on speaker
function checkMouse(){
	var res = {
		flag : false,
		idx : -1
	}
	for (var i = 0; i < speakers.length; i++){
		var d = dist(mouseX,mouseY,speakers[i].cx,speakers[i].cy)
		if (d<speakerDiameter/2){
			res.flag = true;
			res.idx = i;
			console.log("mouse check result  " + res)
			return res;
		}
	}
	return res;
}


/* Variable for speakerConfig room dimensions */

/* Draw Grid */

// var resolutionx = 6;
// var resolutiony = 6;
var resolution = 25

var grid = [];
var rows = 0;
var nextRow = 0;

// A grid block
function Block() {
	this.height = (windowHeight-20) / resolution;
	this.width = (windowWidth-20) / resolution;
	this.color = 255;

	// console.log('height   ' + this.height)
	// console.log('width    ' + this.width)

	this.x = nextRow * this.width;
	this.y = rows * this.height;

	grid.push(this);

	if(grid.length % resolution == 0) rows++;

	nextRow++;
	if(nextRow == resolution) nextRow = 0;

	this.show = function() {
		stroke(0);
		strokeWeight(0.5);
		fill(color('hsl(269, 100%, 95%)'));
		rect(this.x, this.y, this.width, this.height);
	}

	this.trigger = function() {
		console.log('A pixel was triggered');
	}
}

function showGrid() {
	for(var i = 0; i < grid.length; i++)
	{
		grid[i].show();
	}
	fill(color('hsl(0, 100%, 95%)'))
	ellipse(Math.floor(origin[0]),Math.round(origin[1]),10)
}

function deleteGrid(){
	grid.splice(0,grid.length)
}

function resizeGrid(){
	deleteGrid();
	createGrid()
}

function createGrid() {
	nextRow = 0;
	rows = 0;
 	 
	for(var i = 0; i < resolution * resolution; i++)
	{
		new Block();
	}
}

function showCoords(){
	showCoord = ((showCoord == false) ? 1 : 0);
}

var showText = true;
var showCoord = true;
// The speaker configuration object
var speakerConfig = {
	amplifiers: []                  // configuration contains one or more amplifiers
}


var speakers = []
var WFS_module = [];
// var drawSpeakers = [];
var speakerCount = 0;
//class for amplifier objects
function Amplifier (macadr) {
	this.speakers = [];             // Amplifier associated with mac address and speakers
	this.macadr = macadr;
}

var dragged = false;

var speakerDiameter = 10;
// Class for single speaker objects
function Speaker(x,y,z,number) {

	this.cx = x;                   // the position of the speaker on canvas
	this.cy = y;
	this.cz = z;

	this.x = Math.round((x - (windowWidth-20)/2)/25);                   // the position of speaker in real life
	this.y = -Math.round((y - (windowHeight-20)/2)/25);
	this.z = z;

	console.log("speaker pos: " + this.x + "  " + this.y)

	this.number = number;
	this.col = color(204,101,192)
	this.diameter = speakerDiameter;

	// Canvas positions of speakers
	// if(canvas_size[0] !== canvas_size[1]){
	// 	console.log('here')
	// 	console.log(canvas_size)
	// 	this.cx = (((this.x) * (canvas_size[0][0])) / (canvas_size[1][0]))
	// 	this.cy = (((this.y) * (canvas_size[0][1])) / (canvas_size[1][1]))
	// 	this.cz = z;
	// } else {
	// 	this.cx = cx;                   // the position of the speaker on canvas
	// 	this.cy = cy;
	// 	this.cz = cz;
	// }

	this.display = function(){
		  // Set colors
		fill(this.col);
		stroke(127, 63, 120);
		ellipse(this.cx,this.cy,this.diameter,this.diameter)
		fill(0)
		if(showText){
			// if (this.number > 9) text(this.number,this.x-6,this.y+4)
			// else text(this.number,this.x-3,this.y+4)
			// Display number
			if (this.number > 9) text(this.number,this.cx-6,this.cy+4)
			else text(this.number,this.cx-3,this.cy+4)
			// Display Coord
			if (showCoord){
				textSize(10)
				text("(" + Math.round(this.x) + ", " + Math.round(this.y) + ")",this.cx-15,this.cy+20)
			}
		}
	}

	this.move = function(){
	    this.cx *= canvas_size[0][0]/canvas_size[1][0];
		this.cy *= canvas_size[0][1]/canvas_size[1][1];
		this.diameter = speakerDiameter;
		console.log("x:  " + this.x)
		console.log("y:  " + this.y)
		console.log("cx:  " + this.cx)
		console.log("cy:  " + this.cy)
	}

	this.clicked = function(){
		var d = dist(mouseX,mouseY,this.cx,this.cy);
		if (d<speakerDiameter){
			this.col = color(255,255,255)
		}
		// console.log('this object has been pressed')
	}

	this.dragged = function(){
		var d = dist(mouseX,mouseY,this.cx,this.cy)
		if(d<speakerDiameter*2) {

			this.x = Math.round((mouseX - (windowWidth-20)/2)/25)
			this.y = -Math.round((mouseY - (windowHeight-20)/2)/25)

			this.cx = mouseX;
			this.cy = mouseY;
			console.log("speaker " + this.number)
		}
	}
}
	
// Class for WFS speaker array
function WFSarray(x,y,z,noSpk,spc){
	this.ox = x; 
	this.oy = y;
	this.oz = z;
	this.noSpk = noSpk
	this.spacing = spc

	this.display = function(){
	  // Set colors
		fill(0);
		stroke(127, 63, 120);
		line(this.ox-20,this.oy,this,ox+20,this.oy)
		// ellipse(this.ox,this.oy,this.diameter,this.diameter)
		fill(0)
		if(showText){
			// if (this.number > 9) text(this.number,this.x-6,this.y+4)
			// else text(this.number,this.x-3,this.y+4)
			text(this.noSpk,this.ox-3,this.oy+4)
		}
	}

	// this.speakers = [];
}

// function deleteSpkrs(){
// 	drawSpeakers.splice(0,drawSpeakers.length);
// }

// function createSpkrs(){
// 	for (var i = 0; i < speakers.length; i++){
// 		drawSpeakers.push(speakers[i]);
// 	}
// }

function wfsConfig(){
	// render linear array of 8 speakers
	// WFS_module.push(new WFSarray((windowWidth-20)/2, (windowHeight-20)/2,8,0.2))



}


function resizeSpkrs(){
	speakerDiameter *= (canvas_size[0][0]/canvas_size[1][0]);
	console.log(speakerDiameter)
	for (var i = 0; i < speakers.length; i++){
		speakers[i].move()
	}
	// deleteSpkrs()
	// createSpkrs()
}

/* IPC handler for sending speaker positions to main process for xml rendering */
const {ipcRenderer} = require('electron');


function saveConfig(){
	// Send speaker objects to main process
	// for (var i = 0; i < speakerConfig.amplifiers.length; i++){
	// 	var mac = getID("mac"+i).value
	// 	console.log(mac)
	// 	speakerConfig.amplifiers[i].macadr = mac;
	// 	speakerConfig.amplifiers[i].speakers = getID("no-speakers").value
	// }
	
	var payload = [];
	for (var i = 0; i < speakers.length; i++){
		var spk = new Object();
		spk.x = speakers[i].x;
		spk.y = speakers[i].y;
		spk.z = speakers[i].z;
		spk.no = speakers[i].number;

		// offset speaker positions according to canvas dimensions


		payload.push(spk);
	}

	console.log('sending speakers')
	ipcRenderer.send('save-spkrs', payload)

}
