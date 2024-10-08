
//NJTools lazy Id helpers
window.njt.id = new (function()
{
	this.lazyUniqueId = Date.now();

	this.getLazyUniqueId = function ()
	{
		result = this.lazyUniqueId;
		this.lazyUniqueId++;
		return result;
	}
})();

//NJTools element building helpers
window.njt.element = new (function()
{
	this.createElement = function ( typeString, idString, classString, attrMap, innerHTMLString )
	{
		let element = null;

		if (window.njt.js.typeOf(typeString) === window.njt.types.STRING)
		{
			if (typeString === "")
			{
				return document.createTextNode(innerHTMLString);
			}

			element = document.createElement(typeString);

			if (window.njt.js.typeOf(attrMap) === window.njt.types.OBJECT)
			{
				let keys = Object.keys(attrMap);
				for (let i = 0, l = keys.length; i < l; ++i)
				{
					var key = keys[i];
					element.setAttribute(key, attrMap[key]);
				}
			}

			if (window.njt.js.typeOf(idString) === window.njt.types.STRING)
			{
				element.setAttribute('id', idString);
			}

			if (window.njt.js.typeOf(classString) === window.njt.types.STRING)
			{
				element.className = classString;
			}

			if ((window.njt.js.typeOf(innerHTMLString) === window.njt.types.STRING) || (window.njt.js.typeOf(innerHTMLString) === window.njt.types.NUMBER) || (window.njt.js.typeOf(innerHTMLString) === window.njt.types.BIGINT))
			{
				element.innerHTML = innerHTMLString;
			}
		}

		return element;
	}

	this.wrapElement = function ( wrapperDefinition, elementObject)
	{

		let wrapper = window.njt.element.buildElementTree(wrapperDefinition);
		wrapper.appendChild(elementObject);

		return wrapper;
	}

	this.buildElementTree = function ( elementDefinition )
	{
		let element = null;

		if (window.njt.js.typeOf(elementDefinition) === window.njt.types.OBJECT)
		{
			element = this.createElement(elementDefinition.t, elementDefinition.i, elementDefinition.c, elementDefinition.a, elementDefinition.h);

			if (element !== null)
			{
				if (window.njt.js.typeOf(elementDefinition.e) === window.njt.types.ARRAY)
				{
					for (let i = 0; i < elementDefinition.e.length; i++)
					{
						let subElement = this.buildElementTree(elementDefinition.e[i]);

						if (subElement !== null) { element.appendChild(subElement); }
					}
				}

				if (window.njt.js.typeOf(elementDefinition.w) === window.njt.types.OBJECT)
				{
					element = this.wrapElement(elementDefinition.w, element);
				}
			}
		}

		return element;
	}

})();

//NJTools "snip" helpers
window.njt.snip = new (function()
{
	//Are we case-sensitive
	this.caseSensitive = false;

	//Our Regex
	this.regex = new RegExp("\{:([a-zA-Z0-9=\.\-_]*):\}", 'gi');

	//Our key/value map
	this.valueMap = new Object();

	//Our id/snip map
	this.snipMap = new Object();

	//All variables detected
	this.vars = new Array();
	
	this.setCaseSensitive = function(isSensitive)
	{
		if (isSensitive == true)
		{
			window.njt.snip.caseSensitive = true;
			window.njt.snip.regex = new RegExp("\{:([a-zA-Z0-9=\.\-_]*):\}", 'g');
		}
		else
		{
			window.njt.snip.caseSensitive = false;
			window.njt.snip.regex = new RegExp("\{:([a-zA-Z0-9=\.\-_]*):\}", 'gi');
		}
	};

	//How we add to that map
	this.valueMapPush = function(key, value)
	{
		if (!this.caseSensitive) { key = key.toLowerCase(); }

		this.valueMap[key] = value;
	};

	//How we reset the map
	this.valueMapDelete = function(key)
	{
		if (!this.caseSensitive) { key = key.toLowerCase(); }

		if (typeof this.valueMap[key] !== 'undefined') { delete this.valueMap[key]; }
	};

	//How we reset the map
	this.valueMapClear = function()
	{
		this.valueMap = new Object();
	};

	//Examine a string with snips
	this.examineString = function(snipString)
	{
		let result = new Array();
		
		let match = null;
		
		let matchString = null;
		
		while ((match = this.regex.exec(snipString)) !== null) {
			if (this.caseSensitive) { matchString = match[1]; }
				else { matchString = match[1].toLowerCase(); }
			if (result.indexOf(matchString) === -1) { result.push(matchString); }
			if (this.vars.indexOf(matchString) === -1) { this.vars.push(matchString); }
		}

		return result;
	};

	this.examineById = function(snipId)
	{
		let result = new Array();

		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-id', snipId);

		if (nodeList.length === 1)
		{
			result = this.examineString(nodeList[0].innerHTML);
		}

		return result;
	};

	this.examineByGroup = function(snipGroup)
	{
		let result = new Array();

		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-group', snipGroup);

		if (nodeList.length > 0)
		{
			for (let i = 0; i < nodeList.length; i++)
			{
				let currentSnip = this.examineString(nodeList[i].innerHTML);

				//result = [...new Set([...result, ...currentSnip])];

				//For IE Compatibility
				for (let j = 0; j < currentSnip.length; j++)
				{
				  if (result.indexOf(currentSnip[j]) == -1) result.push(currentSnip[j]);
				}
			}
		}

		return result;
	};

	//Process a string with snips
	this.processString = function(snipString)
	{
		//End result
		let result = "";
		
		//Variable markers
		let markers = new Array();
		
		//Find each variable and store a marker with it's location and length
		let match = null;
		while ((match = this.regex.exec(snipString)) !== null) {
			let marker = {};
			marker['i'] = match.index;
			marker['l'] = match[0].length;
			markers.push(marker);
		}

		//Starting at the start of the string
		index = 0;

		//For each marker we do have
		for (let i = 0; i < markers.length; i++) {
			let marker = markers[i];

			//Store anything between index and start of marker in result
			if (marker.i !== index)
			{
				result += snipString.substring(index, marker.i);
			}

			//Update our index
			index = marker.i + marker.l;

			//Grab the variable key
			let key = snipString.substring((marker.i + 2), (index - 2));	
			
			//Make it lowercase 
			if (!this.caseSensitive) { key = key.toLowerCase(); }

			//Check it against our map
			if(typeof this.valueMap[key] === 'undefined')
			{
				//Reinsert variable if no matching key found	
				result += "{:" + key + ":}";
			}
			else
			{
				//Insert our value if key found
				result += this.valueMap[key];
			}
		}

		//If there is anything left at the end add to our result
		if (index < snipString.length)
		{
			result += snipString.substring(index, snipString.length);
		}

		//Done
		return result;
	};

	this.processById = function(snipId)
	{
		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-id', snipId);

		if (nodeList.length === 1)
		{
			//Check it against our map
			if(typeof this.snipMap[snipId] === 'undefined')
			{
				//Store our original text in our snip map
				this.snipMap[snipId] = nodeList[0].innerHTML
			}

			nodeList[0].innerHTML = this.processString(this.snipMap[snipId]);
		}
	}

	this.processByGroup = function(snipGroup)
	{
		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-group', snipGroup);

		if (nodeList.length > 0)
		{
			for (let i = 0; i < nodeList.length; i++)
			{
				let snipId = nodeList[i].getAttribute('snip-id');

				//Check if attribute even set
				if (snipId === null)
				{
					//Maybe redo this later, for now this is how I'll do unique Id generation
					snipId = snipGroup + window.njt.id.getLazyUniqueId();
					nodeList[i].setAttribute("snip-id", snipId);
				}

				//Check it against our map
				if(typeof this.snipMap[snipId] === 'undefined')
				{
					//Store our original text in our snip map
					this.snipMap[snipId] = nodeList[i].innerHTML
				}

				nodeList[i].innerHTML = this.processString(this.snipMap[snipId]);
			}
		}
	}

	this.resetById = function(snipId)
	{
		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-id', snipId);

		if (nodeList.length === 1)
		{
			//Check it against our map
			if(typeof this.snipMap[snipId] !== 'undefined')
			{
				//Restore our original text in our snip map
				nodeList[0].innerHTML = this.snipMap[snipId];
			}
		}
	}

	this.resetByGroup = function(snipGroup)
	{
		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-group', snipGroup);

		if (nodeList.length > 0)
		{
			for (let i = 0; i < nodeList.length; i++)
			{
				let snipId = nodeList[i].getAttribute('snip-id');

				//Check if attribute even set
				if (snipId !== null)
				{
					//Check attribute against our map
					if(typeof this.snipMap[snipId] !== 'undefined')
					{
						//Restore our original text in our snip map
						nodeList[i].innerHTML = this.snipMap[snipId];
					}
				}
			}
		}
	}

	//Initialise snip group by class and makeup an Id
	this.initByClass = function(className)
	{
		let count = 0;
		let nodeList = window.njt.dom.getElementsByClass(className);

		for (let i = 0; i < nodeList.length; i++)
		{
			if (nodeList[i].getAttribute('snip-group') === null && nodeList[i].getAttribute('snip-id') === null)
			{
				nodeList[i].setAttribute("snip-group", className);

				//Maybe redo this later, for now this is how I'll do unique Id generation
				snipId = className + window.njt.id.getLazyUniqueId();
				nodeList[i].setAttribute("snip-id", snipId);

				count++;
			}
		}

		return count;
	};

	//Initialise snip group and id by class
	//Format class as "snipGroup-snapId" with the snip group being the class prefix
	this.initByClassIdPair = function(classPrefix)
	{
		let count = 0;
		let nodeList = window.njt.dom.getElementsWhereClassBegins(classPrefix+'-');
		let minLength = classPrefix.length + 2;

		for (let i = 0; i < nodeList.length; i++)
		{
			for (let j = 0; j < nodeList[i].classList.length; j++)
			//for (let elementClass of nodeList[i].classList)
			{
				let elementClass = nodeList[i].classList[j];
				if (elementClass.length > minLength && elementClass.substring(0,classPrefix.length) === classPrefix)
				{
					if (nodeList[i].getAttribute('snip-group') === null && nodeList[i].getAttribute('snip-id') === null)
					{
						nodeList[i].setAttribute("snip-group", classPrefix);
						nodeList[i].setAttribute("snip-id", elementClass.substring(classPrefix.length + 1));

						count++;
					}
				}
			}
		}

		return count;
	};

})();

//NJTools Modal
window.njt.modal = new (function()
{
	this.initModal = function()
	{
		this.modalShell = document.createDocumentFragment();

		//Create the modal "background"
		let background = document.createElement('div');
		background.setAttribute('id', this.modalBackgroundId);
		background.setAttribute('modal-element', 'background');
		background.className = this.modalBackgroundClass;

		//Create the frame for the model
		let frame = document.createElement('div');
		frame.setAttribute("id", this.modalFrameId);
		frame.className = this.modalFrameClass;


		//Create the wrapper for the close span
		let spanwrap = document.createElement('div');
		spanwrap.setAttribute("id", this.modalCloseWrapperId);

		//Create a span to close
		let span = document.createElement('span');
		span.innerHTML = '&times;';
		span.className = this.modalCloseClass;
		span.setAttribute('id', this.modalCloseId);
		span.setAttribute('modal-element', 'close-button');

		//Create what holds the content
		let content = document.createElement('div');
		content.setAttribute('id', this.modalContentId);
		content.className = this.modalContentClass;

		//Link it all up
		spanwrap.appendChild(span);
		frame.appendChild(spanwrap);
		frame.appendChild(content);
		background.appendChild(frame);
		this.modalShell.appendChild(background);

		//Handle our click events nicely
		document.addEventListener('mousedown', function(event)
		{
			let modalElement = event.target.getAttribute('modal-element');

			if (modalElement !== null)
			{
				//Detect if horizontal scroll bars are in play
				//Might not work with Right to Left text
				if (event.offsetX < event.target.clientWidth) // || event.offsetY > event.target.clientHeight) 
				{
					window.njt.modal.lastClick = modalElement;
				}
			}
			else { window.njt.modal.lastClick = null; }
		});

		document.addEventListener('mouseup', function(event)
		{
			if (window.njt.modal.lastClick !== null)
			{
				let modalElement = event.target.getAttribute('modal-element');

				if (modalElement === window.njt.modal.lastClick)
				{
					if (modalElement === 'background' || modalElement === 'close-button')
					{
						//Detect if horizontal scroll bars are in play
						//Might not work with Right to Left text
						if (event.offsetX < event.target.clientWidth) 
						{
							window.njt.modal.close(event);
						}
					}
				}

				window.njt.modal.lastClick = null;
			}
		});
	}
	
	this.loadModals = function()
	{
		let modalArray = document.querySelectorAll('[modal-wrapper]');
		let currentId = null;
		let currentOpen = null;
		let currentClose = null;
		let numModals = modalArray.length;
		for (let i = 0; i < modalArray.length; i++)
		{
			currentId = modalArray[i].getAttribute("modal-wrapper");
			currentOpen = modalArray[i].getAttribute("modal-open");
			currentClose = modalArray[i].getAttribute("modal-close");
			currentChildren = modalArray[i].children;

			this.contentArray[currentId] = {};
			this.contentArray[currentId].modal = document.createDocumentFragment();
			while (currentChildren.length > 0)
			{
				this.contentArray[currentId].modal.appendChild(currentChildren[0]);
			}

			if (typeof currentOpen == "string")
				{ this.contentArray[currentId].open = currentOpen; }
			else
				{ this.contentArray[currentId].open = null; }

			if (typeof currentClose == "string")
				{ this.contentArray[currentId].close = currentClose; }
			else
				{ this.contentArray[currentId].close = null; }
			
			modalArray[i].parentNode.removeChild(modalArray[i]);
		}
	}

	this.open = function(contentId, event)
	{
		window.njt.log('Trying To Open Modal');

		if (this.contentArray[contentId].open != null)
		{
			window.njt.log('Running Custom Open Modal Function');
			window.njt.modal.openFunctions[this.contentArray[contentId].open](contentId, event);
		}
		else
		{
			this.openNow(contentId);
		}
	}

	this.openNow = function(contentId)
	{
		window.njt.log('Modal Open Started');

		if
		(
			this.currentContentId === null &&
			typeof contentId === "string" &&
			typeof this.contentArray[contentId] !== "undefined"
		)
		{
			//IE Didn't like this: window.njt.modal.modalShell.getElementById(this.modalContentId).appendChild(this.contentArray[contentId]);
			window.njt.modal.modalShell.querySelector('#'+this.modalContentId).appendChild(this.contentArray[contentId].modal);
			document.body.appendChild(this.modalShell);
			this.currentContentId = contentId;
		}
		window.njt.log('Modal Open Ended');
	}

	this.close = function(event)
	{
		window.njt.log('Trying To Close Modal');

		if (this.contentArray[this.currentContentId].close != null)
		{
			window.njt.log('Running Custom Close Modal Function');
			window.njt.modal.closeFunctions[this.contentArray[this.currentContentId].close](event);
		}
		else
		{
			this.closeNow();
		}

	}

	this.closeNow = function()
	{
		window.njt.log('Modal Close Started');
		if (this.currentContentId !== null)
		{
			//Load the modal content back into its array
			let content = document.getElementById(this.modalContentId);
			while (content.childNodes.length > 0)
			{
				this.contentArray[this.currentContentId].modal.appendChild(content.childNodes[0]);
			}
			//Grab the background and put it back into the modal shell fragment
			this.modalShell.appendChild(document.getElementById(this.modalBackgroundId));

			this.currentContentId = null;
		}
		window.njt.log('Modal Close Ended');
	}

	this.modalShell = null;
	this.currentContentId = null;
	this.contentArray = [];
	this.modalBackgroundId = 'modal-background';
	this.modalBackgroundClass = 'modal-background';
	this.modalFrameId = 'modal-frame';
	this.modalFrameClass = 'modal-frame';
	this.modalCloseWrapperId = 'modal-close-wrapper';
	this.modalCloseId = 'modal-close-button';
	this.modalCloseClass = 'modal-close';
	this.modalContentId = 'modal-content';
	this.modalContentClass = 'modal-content';

	this.lastClick = null;
	this.contentArray = [];
	this.openFunctions = {};
	this.closeFunctions = {};

	window.njt.event.queue['htmlloaded'].push(function()
	{
		window.njt.log('Starting to initialise Modals');
		window.njt.modal.initModal();
		window.njt.modal.loadModals();
		window.njt.log('Finished initialising Modals');
	});

})();

//NJTools Form Builder
window.njt.formbuilder = new (function()
{
	this.generate = function ( input )
	{
		let form = null;

		if (window.njt.js.typeOf(input) === window.njt.types.STRING)
		{
			input = JSON.parse( input );
		}

		if (input.t === "njt/form")
		{
			form = window.njt.element.createElement('form', input.i, input.c, input.a);

			if (window.njt.js.typeOf(input.e) === window.njt.types.ARRAY)
			{
				for (let i = 0; i < input.e.length; i++)
				{
					let element = null;
					let currentItem = input.e[i];
					let typePath = input.e[i].t.split('/');

					if (typePath.length === 3)
					{
						if (typePath[0] === 'njt' && typePath[1] === 'form')
						{
							if (window.njt.js.typeOf(this.typeBuilders[typePath[2]]) === window.njt.types.FUNCTION)
							{
								element = this.typeBuilders[typePath[2]](input.e[i]);
							}
						}
					}
					else if (typePath.length === 1)
					{
						element = window.njt.element.buildElementTree(input.e[i]);
					}

					if (element !== null) { form.appendChild(element); }
				}
			}

			if (window.njt.js.typeOf(input.w) === window.njt.types.OBJECT)
			{
				let wrapper = window.njt.element.createElement(input.w.t, input.w.i, input.w.c, input.w.a);
				wrapper.appendChild(form);
				form = wrapper;
			}

		}

		return form;
	}

	this.typeBuilders = {};

	/*

	input.i = input Id and name
	input.l = input label
	input.p = input placeholder
	input.c = wrapper div class
	input.v = option values
	input.s = selected value

	*/

	this.typeBuilders['lineinput'] = function( input )
	{
		let result = null;

		if (window.njt.js.typeOf(input.i) === window.njt.types.STRING)
		{
			let label = input.l;
			let baseId = input.i;
			let fieldAttr = {
				'type': 'text',
				'class': 'njt-form-lineinput',
				'name' : baseId
			};

			if (window.njt.js.typeOf(input.p) === window.njt.types.STRING)
			{
				fieldAttr['placeholder'] = input.p;
			}

			result = window.njt.element.createElement('div', baseId+'-wrapper', input.c);

			let field = window.njt.element.createElement('input', baseId+'-input', null, fieldAttr);

			if (window.njt.js.typeOf(input.l) === window.njt.types.STRING)
			{
				let label = window.njt.element.createElement('label', baseId+'-label', null, {"for":baseId+'-input'}, input.l + field.outerHTML);
				result.appendChild(label);
			}
			else
			{
				result.appendChild(field);
			}
		}

		return result;
	}

	this.typeBuilders['multilineinput'] = function( input )
	{
		let result = null;

		if (window.njt.js.typeOf(input.i) === window.njt.types.STRING)
		{
			let label = input.l;
			let baseId = input.i;
			let fieldAttr = {
				'class': 'njt-form-multilineinput',
				'name' : baseId
			};

			if (window.njt.js.typeOf(input.p) === window.njt.types.STRING)
			{
				fieldAttr['placeholder'] = input.p;
			}

			result = window.njt.element.createElement('div', baseId+'-wrapper', input.c);

			let field = window.njt.element.createElement('textarea', baseId+'-input', null, fieldAttr);

			if (window.njt.js.typeOf(input.l) === window.njt.types.STRING)
			{
				let label = window.njt.element.createElement('label', baseId+'-label', null, {"for":baseId+'-input'}, input.l + field.outerHTML);
				result.appendChild(label);
			}
			else
			{
				result.appendChild(field);
			}
		}

		return result;
	}

	this.typeBuilders['dropdown'] = function( input )
	{
		let result = null;

		if (window.njt.js.typeOf(input.i) === window.njt.types.STRING)
		{
			let label = input.l;
			let baseId = input.i;
			let fieldAttr = {
				'class': 'njt-form-dropdown',
				'name' : baseId
			};

			let selected = null;
			if (window.njt.js.typeOf(input.s) === window.njt.types.STRING)
			{
				selected = input.s;
			}

			result = window.njt.element.createElement('div', baseId+'-wrapper', input.c);

			let field = window.njt.element.createElement('select', baseId+'-input', null, fieldAttr);

			if (window.njt.js.typeOf(input.v) === window.njt.types.ARRAY)
			{
				for (let i = 0; i < input.v.length; i++)
				{
					if (input.v[i].v === selected)
					{
						field.appendChild(window.njt.element.createElement('option', null, null, {"value":input.v[i].v, "selected": 1}, input.v[i].h));
					}
					else
					{
						field.appendChild(window.njt.element.createElement('option', null, null, {"value":input.v[i].v}, input.v[i].h));
					}
				}
			}

			if (window.njt.js.typeOf(input.l) === window.njt.types.STRING)
			{
				let label = window.njt.element.createElement('label', baseId+'-label', null, {"for":baseId+'-input'}, input.l + field.outerHTML);
				result.appendChild(label);
			}
			else
			{
				result.appendChild(field);
			}
		}

		return result;
	}

})();
