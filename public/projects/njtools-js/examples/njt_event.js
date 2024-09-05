window.njt.event.queue['pageloaded'].push(function()
{
	//Console update
	document.outputToConsole("The natural 'pageloaded' queue has been triggered");
});

window.njt.event.queue['pageloaded'].push(function()
{
	//Create our synthentic queue
	window.njt.event.createQueue('ourtimerqueue', document, 'timertriggered');

	//Add a function to its queue
	window.njt.event.queue['ourtimerqueue'].push(function()
	{
		document.outputToConsole("Our synthetic queue 'ourtimerqueue' has been triggered");
	});

	//Add another function to its queue
	window.njt.event.queue['ourtimerqueue'].push(function(evt)
	{
		document.outputToConsole("The evt.detail.message property contains: " + evt.detail.message);
	});
});

window.njt.event.queue['pageloaded'].push(function()
{
	//Our function to be run when the timer is complete
	let timerComplete = function()
	{
		//Create some details for our event to share
		let eventDetails = {};
		eventDetails.message = "Just a string";

		//Trigger our synthetic event and add the details
		window.njt.event.triggerSyntheticEvent(document, 'timertriggered', eventDetails);
	};
	
	//Create our timer
	setTimeout(timerComplete, 3000);
	
	//Report where we are at
	document.outputToConsole("3 second timer created");
});

window.njt.event.addFunction("boop", function()
{
	//Console update
	document.outputToConsole("Boop");
});