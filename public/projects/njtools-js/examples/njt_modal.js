/* Lorem Ipsum Modal */

window.njt.event.addFunction("openloremipsum", function()
{
	//Console update
	document.outputToConsole("Opening Lorem Ipsum");
	
	//Do the thing
	window.njt.modal.openNow('Lorem-modal');
});

window.njt.event.addFunction("closeloremipsum", function()
{
	//Console update
	document.outputToConsole("Closing Lorem Ipsum via button");
	
	//Do the thing
	window.njt.modal.closeNow();
});

/* Customised Modal */

window.njt.event.addFunction("opencustomised", function(event)
{
	//Console update
	document.outputToConsole("Opening Customised Modal");

	//Do the thing
	window.njt.modal.open('Customised-modal', event);
});

window.njt.event.addFunction("tryclosecustomised", function(event)
{
	//Console update
	document.outputToConsole("Trying to close Customised Modal via button");
	
	//Do the thing
	window.njt.modal.close(event);
});

window.njt.modal.openFunctions["customopen"] = function(event)
{
	//Console update
	document.outputToConsole("In custom open function for Customised Modal");
	
	//Do the thing
	window.njt.modal.openNow('Customised-modal');
};

window.njt.modal.closeFunctions["customclose"] = function(event)
{
	//Console update
	document.outputToConsole("In custom close function for Customised Modal triggered by element with id: " + event.target.id);
	
	let tickbox = document.getElementById("checkbox-input");
	
	if (tickbox.checked)
	{
		document.outputToConsole("Tickbox is ticked, closing modal");
		//Do the thing
		window.njt.modal.closeNow();
	}
	else
	{
		document.outputToConsole("Tickbox not ticked");
	}
};
