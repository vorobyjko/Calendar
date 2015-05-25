var FUNCTIONS_COLLECTION = [];

/* Initialize all functions
	@param {Array} funcsArr - global functions array
 */

var initAll = function (funcsArr) {
	if(funcsArr instanceof Array) {
		for (var i = funcsArr.length - 1; i >= 0; i--) {
			if (typeof funcsArr[i] === "function") {
				funcsArr[i]();
			};
		};
	};
};


/* Function to support cross-browser events listeners */

var crossBrowserEventListener = function () {
	if (typeof Element.prototype.addEventListener === 'undefined') {
    	Element.prototype.addEventListener = function (e, callback) {
      	e = 'on' + e;
      	return this.attachEvent(e, callback);
    };
  }
}


/* Toggle search input text	 */

var inputSearchValue = function () {
	var tempPlaceholderVal,
		searchElem;

	searchElem = document.getElementById("search");
	searchElem.addEventListener("focus", function(e) {
		tempPlaceholderVal = this.placeholder;
			this.placeholder = "";
		});

	searchElem.addEventListener("blur", function(e) {
		if (this.placeholder.length === 0) {
			this.placeholder = tempPlaceholderVal;
		}
	});

};



var calendar = new Calendar({
	renderTo : 'calendarWrapper',
	setEvents : [
					{	
						date : "9.5.2015", 
						eventTitle : "Напиться", 
						eventDescription : "Витя Костин, Петр Михайлов" 
					},
				
					{
						date : "22.5.2015", 
						eventTitle : "ДР!", 
						eventDescription : "Дима Молодцов"
					},

					{
						date : "15.6.2015", 
						eventTitle : "Summer Party", 
						eventDescription : "Fucking awesome party"
					}
				]
});





FUNCTIONS_COLLECTION.push(inputSearchValue, crossBrowserEventListener);

initAll(FUNCTIONS_COLLECTION);
