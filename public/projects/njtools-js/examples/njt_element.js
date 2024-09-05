window.njt.event.queue['pageloaded'].push(function()
{
	document.outputToConsole("Building our string element");
	
	//Get out target
	let target = window.njt.dom.getElementById("elementsTarget");
	
	//Element definition as String
	let elementDefinition = '{"t":"p","w":{"t":"div","c":"wrapper-div","e":[{"t":"h3","c":"wrapper-heading","h":"Our string element"}]},"h":"This is an element built with NJT.Element which has:","e":[{"t":"ul","e":[{"t":"li","h":"Child elements"},{"t":"li","h":"Wrapper element which has child elements (because we can)"}]}]}';
	
	//Element definition converted to object
	let elementObject = JSON.parse(elementDefinition);
	
	//Element definition converted into element
	let element = window.njt.element.buildElementTree(elementObject);
	

	//Clear and update target
	target.innerHTML = "";
	target.appendChild(element);

	document.outputToConsole("Finished building string element");
});


window.njt.event.queue['pageloaded'].push(function()
{
	document.outputToConsole("Building our object element");
	
	//Lets start by figuring out how many calculations we want done for our table
	let calcCount = window.njt.js.getRandomInt(3, 5);
	
	//Get out target
	let target = window.njt.dom.getElementById("elementsTarget");
	
	//Create our base
	let elementBase = {};
	elementBase.t = 'div';
	elementBase.c = 'wrapper-div';
	elementBase.e = [];
	
	//Add our header
	elementBase.e.push({"t": "h3", "c": "wrapper-heading", "h": "Our object element"});
	
	//Add some info on how many calcs were going to do
	elementBase.e.push({"t": "p", "h": "This time let's do "+calcCount+" random-ish multiplications"});
	
	//Start creating our table
	let elementTable = {};
	elementTable.t = 'table';
	elementTable.c = 'data-table';
	elementTable.e = [];

	//Add our table heading
	elementTable.e.push({"t":"tr","e":[{"t":"th","h":"X"},{"t":"th","h":"Y"},{"t":"th","h":"X x Y ="}]});
	
	for (let i = 0; i < calcCount; i++)
	{
		let x = window.njt.js.getRandomInt(1, 20);
		let y = window.njt.js.getRandomInt(1, 20);
		elementTable.e.push({"t":"tr","e":[{"t":"td","h": x},{"t":"td","h": y},{"t":"td","h": (x*y)}]});
	}
	
	//Add our table to our wrapper DIV
	elementBase.e.push(elementTable);

	//Element definition converted into element
	let element = window.njt.element.buildElementTree(elementBase);
	

	//Just update target this time
	target.appendChild(element);

	document.outputToConsole("Finished building object element");
});