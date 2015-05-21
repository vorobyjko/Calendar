(function(){
 
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


/* Extends Date object
   return array with length === days in month
   @param {Number} month 
*/

Date.prototype.daysInMonth = function(month) {
	var days = 33 - new Date(this.getFullYear(), month || this.getMonth(), 33).getDate(),
		daysArr = [];

	for (var i = 1; i <= days; i++) {
		daysArr.push(i);
	}
	return daysArr;
};


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


/* Calendar maker */

var calendar = function () {
	var DATE,
		DAYS,
		MONTHS,
		YEAR,
		today,
		currentMonth;


	/* DOM elements variables */
	var tableEl,
		contentEl,
		calendarWrapperEl,
		eventTemplate;
		
	contentEl = document.querySelector(".content");
	tableEl = document.getElementById("calendarTable");
	calendarWrapperEl = document.getElementById("calendarWrapper");
	
	DATE = new Date();
	DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
	MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
	YEAR = DATE.getFullYear();
	
	currentMonth = DATE.getMonth();
	
	contentEl.querySelector("#year").innerHTML =  MONTHS[currentMonth]; + " " + YEAR;


	function renderCal() {
		var weeksInMonth = 5,
			counter = 0,
			tr,
			td;
	
		for (var i = 1; i <= weeksInMonth; i++) {
			tr = document.createElement("tr");
			tableEl.appendChild(tr);
				
				for (var j = 1; j <= DAYS.length; j++) {
					counter++;
					td = document.createElement("td");
					td.setAttribute("id", counter);
					td.width = parseInt(calendarWrapperEl.clientWidth / DAYS.length);
					td.height = td.width;
				    tableEl.lastChild.appendChild(td);
				}
		
		}
		setNumbers(currentMonth);
	}

	function setNumbers(month, refresh) {
		/* Constants */
		var MAX_DAYS = 31;

		var counter = 0,
			tdArr = tableEl.querySelectorAll("td"),
			daysArr = DATE.daysInMonth(month),
			prevDaysArr = DATE.daysInMonth(month-1);
			
		for (var i = 0; i < tdArr.length; i++) {

			//clear styles and content of the table cells
			if (refresh) {
				tdArr[i].innerHTML = "";
				tdArr[i].className = "";
				DATE.setMonth(month);
			}

			//draw days of the week
			if (i < DAYS.length){
				tdArr[i].innerHTML = DAYS[i] + ", ";
			}

			//draw numbers 
			if (i >= 4) {
				tdArr[i].innerHTML += daysArr[counter++] || 1;
				if ((daysArr[counter] === DATE.getDate())) {
					tdArr[i+1].className = DATE.getMonth() === currentMonth ? "todayHighlidth" : "";
				} 

			} else {
				prevDaysArr = prevDaysArr.slice(-tdArr.length + MAX_DAYS);
				tdArr[i].innerHTML += prevDaysArr[i];
			} 
		};

		//set events
		if(DATE.getMonth() === currentMonth) {
			setEvents( { num : 9, eventTitle : "Напиться", eventDescription : "Витя Костин, Петр Михайлов" }, 
					   { num : 22, eventTitle : "ДР!", eventDescription : "Дима Молодцов" });
		}
	};


	function initBtnListeners() {
		var prevBtn = document.getElementById("prevBtn"),
			nextBtn = document.getElementById("nextBtn");
		
		var prevNextBtnHandler = function (e) {
			var id = this.id || e.srcElement.id;
			var month = (id === "prevBtn" ? DATE.getMonth() - 1 : DATE.getMonth() + 1);
			setNumbers(month, true);
			document.getElementById("year").innerHTML = MONTHS[DATE.getMonth()] + " " + YEAR;
		};
		
		prevBtn.addEventListener("click", prevNextBtnHandler);

		nextBtn.addEventListener("click", prevNextBtnHandler);

	}


	function setEvents(){
		var eventTemplate = "<p id='eventTitle'></p><p id='eventDescription'></p>";

		for (var i = 0; i < arguments.length; i++) {
			var td = document.getElementById(arguments[i].num);
			 	td.className += "addedEvent";
			 	td.innerHTML += eventTemplate;
			 	td.querySelector("#eventTitle").innerHTML += arguments[i].eventTitle;
			 	td.lastChild.innerHTML += arguments[i].eventDescription;
		}	
	}

	renderCal();
	initBtnListeners();
	
	window.addEventListener('resize', function(event){
  		var td = tableEl.querySelectorAll("td");
  		for (var i = 0; i < td.length; i++) {
  			td[i].width = parseInt(calendarWrapperEl.clientWidth / DAYS.length);
			td[i].height = td[i].width;
  		};
  	});

};



FUNCTIONS_COLLECTION.push(inputSearchValue, calendar, crossBrowserEventListener);

initAll(FUNCTIONS_COLLECTION);


})();

