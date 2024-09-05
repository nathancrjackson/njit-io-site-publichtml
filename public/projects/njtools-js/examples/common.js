document.outputToConsole = function(message, clear)
{
	let jsconsole = document.getElementById('jsconsole');
	if (clear === true)
		{ jsconsole.innerHTML = message; }
	else
		{ jsconsole.innerHTML = jsconsole.innerHTML + "\n" + message; }
};

window.njt.event.queue['pageloaded'].push(function()
{
	//Console update
	document.outputToConsole("Page is loaded", true);
});
