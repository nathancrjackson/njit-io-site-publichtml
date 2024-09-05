document.validateResponseText = function(responseText)
{
	//Define our base
	let basemap = {
		userid: window.njt.types.NUMBER,
		listname: window.njt.types.STRING,
		valuepairs: window.njt.types.ARRAY
	};

	//Define our value pair
	let valuepairmap = {
		id: window.njt.types.NUMBER,
		name: window.njt.types.STRING
	};

	//Parse our JSON
	let responseObject = null;	
	try
		{ responseObject = JSON.parse(responseText); }
	catch (e)
		{ return false; }

	//Validate our base
	if (!window.njt.js.validate(responseObject, basemap))
		{ return false; }

	//Loop over our value pair values and validate those too
	for (let i = 0; i < responseObject.valuepairs.length; i++)
	{
		if (!window.njt.js.validate(responseObject.valuepairs[i], valuepairmap))
			{ return false;}
	}
	
	return true;
};

document.updateDOM = function(responseObject)
{
	let targets = window.njt.dom.getElementsByAttributeWithValue("outputtarget", "This Element");
	
	document.outputToConsole("Targets found: "+targets.length);
	
	let innerHTML = "<h3>List of " + responseObject.listname  + "</h3>";
	
	innerHTML += "<ul>";
	for (let i = 0; i < responseObject.valuepairs.length; i++)
	{
		innerHTML += "<li id=\"listitem" + responseObject.valuepairs[i].id + "\">" + responseObject.valuepairs[i].name + "</li>";
	}
	innerHTML += "</ul>";
	
	for (let i = 0; i < targets.length; i++)
	{
		targets[i].innerHTML = innerHTML;
	}

	document.outputToConsole("Finished updating DOM");
};

window.njt.event.queue['pageloaded'].push(function()
{
	let path = "njt_js-dom-req.json";
	
	let onloadFunction = function()
	{
		document.outputToConsole("Loaded GET request");

		if (this.status === 200)
		{
			let valid = document.validateResponseText(this.responseText);
			
			if (valid)
			{
				document.outputToConsole("Response passed validation");
				
				document.updateDOM(JSON.parse(this.responseText));
			}
			else
			{
				document.outputToConsole("Response failed validation");
			}
		}
		else
		{
			document.outputToConsole("HTTP status not: 200 OK");
		}
	}

	if (location.protocol == 'file:')
	{
		document.outputToConsole("Sorry this demo does not support the FILE protocol");
		document.outputToConsole("Please view via HTTP or HTTPS");
	}
	else
	{
		document.outputToConsole("Making GET request");

		window.njt.req.get(path, onloadFunction);
	}

});