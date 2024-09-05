document.generateForm = function()
{
	document.outputToConsole("Generating form");

	let notificationTypes = ['Info', 'Alert', 'Error'];
	
	/*
	Now you could just add this manually to the below dropdown's v (values) array
		{"v":"opt1", "h":"Option 1"},
		{"v":"opt2", "h":"Option 2"},
		{"v":"opt3", "h":"Option 3"}
	But you may not know your options in advance and wanna generate them in JS so you can do this
	*/
	let dropdownValues = [];
	for (let i = 0; i < notificationTypes.length; i++)
	{
		dropdownValues.push({v: notificationTypes[i].toLowerCase() + 'notification', h: notificationTypes[i]});
	}

	//Function to create form (note how you can use with event module to save having to attach events seperately)
	let formStructure = {
		"t": "njt/form", "e": [
			{ "t": "p", "h": "Use this form to change or update the notification." },
			{ "t":"njt/form/lineinput", "i":"notificationheading", "c":"gd-s12", "l":"Notification heading", "p":"Hello" },
			{ "t":"njt/form/multilineinput", "i":"notificationtext", "c":"gd-s12", "l":"Notification contents", "p":"You can edit the contents of this notification using the form below." },
			{ "t":"njt/form/dropdown", "i":"notificationdivclass", "c":"gd-s12", "l":"Some options", "s":"opt2", "v": dropdownValues },
			{ "t":"div", "c":"gd-s12", "e": [
				{ "t": "a", "i": "updatebutton", "c": "button", "a": {
					"href":"#",
					"njteventclick": "updateNotification",
					"onclick": "window.njt.event.eventHandler(event)"
				}, "h": "Update"},
				{ "t": "", "h": " " },
				{ "t": "a", "i": "resetbutton", "c": "button", "a":{
					"href":"#",
					"njteventclick": "resetForm",
					"onclick": "window.njt.event.eventHandler(event)"
				}, "h": "Reset" }
			] }
		] };

	let testForm = window.njt.formbuilder.generate(formStructure);
	document.getElementById('formdiv').appendChild(testForm);
}

document.updateNotification = function()
{
	window.njt.event.funct.updateNotification();
}

window.njt.event.addFunction("updateNotification", function()
{
	document.outputToConsole("Updating notification");
	
	//Targets
	let ndiv = window.njt.dom.getElementById('notificationdiv');
	let nh4 = window.njt.dom.getElementById('notificationheading');
	let np = window.njt.dom.getElementById('notificationtext');
	
	//Inputs
	let cinput = window.njt.dom.getElementById('notificationdivclass-input');
	let hinput = window.njt.dom.getElementById('notificationheading-input');
	let tinput = window.njt.dom.getElementById('notificationtext-input');
	
	//Values
	let cvalue = cinput.value;
	let hvalue = hinput.value;
	if (hvalue == "") {hvalue = hinput.placeholder;}
	let tvalue = tinput.value;
	if (tvalue == "") {tvalue = tinput.placeholder;}

	//Update
	ndiv.setAttribute("class", cvalue);
	nh4.textContent = hvalue;
	np.textContent = tvalue;
});

window.njt.event.addFunction("resetForm", function()
{
	document.outputToConsole("Resetting form");

	//Inputs
	let cinput = window.njt.dom.getElementById('notificationdivclass-input');
	let hinput = window.njt.dom.getElementById('notificationheading-input');
	let tinput = window.njt.dom.getElementById('notificationtext-input');

	//Values
	cinput[0].selected = true;
	hinput.value = "";
	tinput.value = "";

	//Update
	document.updateNotification();
});

window.njt.event.queue['pageloaded'].push(function()
{
	document.generateForm();
	document.updateNotification();
});