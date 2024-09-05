window.njt.event.queue['pageloaded'].push(function()
{
	document.outputToConsole('Starting prepping snips');
	
	//Preps snips attributes for elements using classes to define snip group and Id
	window.njt.snip.initByClassIdPair('clocksnip');
	
	//Set clock then set timer
	document.updateClock();
	
	//Then set a timer to update clock every second
	window.setInterval(function()
	{
		document.updateClock();
	}, 1000);

	document.outputToConsole('Completed prepping snips');
});

document.updateClock = function()
{
	let time = new Date().toLocaleTimeString();

	window.njt.snip.valueMapPush('Time', time);
	
	window.njt.snip.processById('clocktarget');
}

document.readPath = function()
{
	//Read path input
	let path = window.njt.dom.getElementById('path-input').value;

	//Use place holders if required
	if (path == "") {path = window.njt.dom.getElementById('path-input').placeholder;}

	//If it is empty ensure not in value map
	if (path == "")
		{ window.njt.snip.valueMapDelete('Path'); }
	//Otherwise update value map
	else
		{ window.njt.snip.valueMapPush('Path', path); }
}

document.readMode = function()
{
	//Read mode input
	let mode = window.njt.dom.getElementById('mode-input').value;

	//Use place holders if required
	if (mode == "") {mode = window.njt.dom.getElementById('mode-input').placeholder;}

	//If it is empty ensure not in value map
	if (mode == "")
		{ window.njt.snip.valueMapDelete('Mode'); }
	//Otherwise update value map
	else
		{ window.njt.snip.valueMapPush('Mode', mode); }
}

document.readUserAndGroup = function()
{
	//Read username and usergroup inputs
	let username = window.njt.dom.getElementById('username-input').value;
	let usergroup = window.njt.dom.getElementById('usergroup-input').value;
	
	//Use place holders if required
	if (username == "") {username = window.njt.dom.getElementById('username-input').placeholder;}
	if (usergroup == "") {usergroup = window.njt.dom.getElementById('usergroup-input').placeholder;}

	//If username is empty ensure not in value map
	if (username == "")
		{ window.njt.snip.valueMapDelete('Username'); }
	//Otherwise update value map
	else
		{ window.njt.snip.valueMapPush('Username', username); }

	//If usergroup is empty ensure not in value map
	if (usergroup == "")
		{ window.njt.snip.valueMapDelete('Usergroup'); }
	//Otherwise update value map
	else
		{ window.njt.snip.valueMapPush('Usergroup', usergroup); }
}

window.njt.event.addFunction("updatechmod", function()
{
	document.outputToConsole("Updating chmod example");

	//Read inputs
	document.readPath();
	document.readMode();
	
	//Process by Id
	window.njt.snip.processById('chmodcommand');
});

window.njt.event.addFunction("updatechown", function()
{
	document.outputToConsole("Updating chown example");

	//Read inputs
	document.readPath();
	document.readUserAndGroup();
	
	//Process by Id
	window.njt.snip.processById('chowncommand');
});

window.njt.event.addFunction("updateboth", function()
{
	document.outputToConsole("Updating Linux Command examples");

	//Read inputs
	document.readPath();
	document.readMode();
	document.readUserAndGroup();
	
	//Process by group
	window.njt.snip.processByGroup('linuxcommands');
});

window.njt.event.addFunction("resetboth", function()
{
	document.outputToConsole("Resetting Linux Command examples");
	
	//Reset by group
	window.njt.snip.resetByGroup('linuxcommands');
});