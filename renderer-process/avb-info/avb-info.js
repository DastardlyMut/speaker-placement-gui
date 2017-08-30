// Electron
const {ipcRenderer} = require('electron')

/* Helper function */

function getID(id){
	return document.getElementById(id);
}

// Main objects and Classes
/********************************/

// The speaker configuration object
var speakerConfig = {
amplifiers: []                  // configuration contains one or more amplifiers
}


//class for amplifier objects
function Amplifier (macadr, noSpkrs) {
this.speakers = [];             // Amplifier associated with mac address and speakers
this.macadr = macadr;
this.noSpkrs = noSpkrs;
//this.present = false;           // Is the amplifier present in configuration?
}

var noTracks = 8;                 // the number of tracks to be sent to each speaker
// Class for speaker objects
function Speaker(x,y,z,number) {
  this.x = x;                   // the position of the speaker
  this.y = y;
  this.z = z;
  this.number = number;
}

var noDAC = 0;
// Retrieve Info after click button
/**********************************/
// Retrieve amount of DACs
getID('enter-nodac').addEventListener('click', DisplayDACEntry)

function DisplayDACEntry(){
	// console.log('DisplayDACEntry')
	speakerConfig.amplifiers = [];
	getID('macs').innerHTML = "";
	noDAC = getID('dacs').value;
	var macs = getID("macs")
	// Create amp objects for number of DACs
	// var mac_div = document.createElement.("div");
	// mac_div.id = 'mac_ins';
	var t = document.createTextNode("Please enter MACs for each:") 
	macs.appendChild(t)
		macs.appendChild(document.createElement("br"))
	for (var i = 0; i < noDAC; i++){
		// console.log("hey
		var mac_in = document.createElement("INPUT");
	    mac_in.setAttribute("id","mac"+ (i))
		mac_in.setAttribute("type", "text");
		mac_in.setAttribute("value", "00:00:00:00:00:00");
		macs.appendChild(mac_in)
		macs.appendChild(document.createElement("br"))
		speakerConfig.amplifiers[i] = new Amplifier();
		// mac_ins.appendChild(mac_in);
	} 
	getID("nospkrs").innerHTML = ""
	var t = document.createTextNode("Amount of speakers per DAC:") 
	var spk_in = document.createElement("input")
	spk_in.id = 'no-speakers'
	getID("nospkrs").appendChild(t);
	getID("nospkrs").appendChild(spk_in)
	// getID("enter-amps").style.visibility = 'visible'
	console.log(speakerConfig.amplifiers.length)
}

getID('save-macadr').addEventListener('click', createAmpObjects)

function createAmpObjects(){
	for (var i = 0; i < speakerConfig.amplifiers.length; i++){
		var mac = getID("mac"+i).value
		var noSpkrs = getID("no-speakers").value
		console.log(mac)
		console.log(noSpkrs)
		speakerConfig.amplifiers[i].macadr = mac;
		speakerConfig.amplifiers[i].noSpkrs = noSpkrs;
	}

	console.log('sending macs')
	ipcRenderer.send('save-macadr', speakerConfig)

}
