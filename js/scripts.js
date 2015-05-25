
/* Calendar maker */

var Calendar = function (config) {
	
	/* Constants  */
	var DATE = new Date(),
		DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
		MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		YEAR = DATE.getFullYear();

	

	/* Extends Date object
   		return array with length === days in month
   		@param {Number} month 
	*/

	if (!Date.hasOwnProperty("daysInMonth")) {
		Date.prototype.daysInMonth = function(month) {
			var days = 33 - new Date(this.getFullYear(), month || this.getMonth(), 33).getDate(),
				daysArr = [];

			for (var i = 1; i <= days; i++) {
				daysArr.push(i);
			}
			return daysArr;
		};	
	}
	
		
	
	/* Params  */
	
	var renderTo = config.renderTo || {},
		events = config.setEvents || [];

	

	/* DOM Elements */
	
	var tableEl;


	
	/* Private variables */
	
	var currentMonth = DATE.getMonth(),
		self = this;

	
	
	/* Private functions */

	function render() {
		var weeksInMonth = 5,
			counter = 0,
			renderToEl,
			tr,
			td;
	
		
		var renderToEl = document.getElementById(renderTo);

		if (!renderToEl) {
			throw new Error("Element with given id " + renderTo + " does not exist!")
		} else {
			tableEl = document.createElement("table");
			tableEl.id = "calendarTable";
			renderToEl.appendChild(tableEl);
		
			for (var i = 1; i <= weeksInMonth; i++) {
				tr = document.createElement("tr");
				tableEl.appendChild(tr);
					
					for (var j = 1; j <= DAYS.length; j++) {
						counter++;
						td = document.createElement("td");
						td.width = parseInt(renderToEl.clientWidth / DAYS.length);
						td.height = td.width;
					    tableEl.lastChild.appendChild(td);
					}
			}
		}

	};


	
	function drawMonth() {
		document.getElementById("year").innerHTML =  MONTHS[currentMonth]; + " " + YEAR;
	};



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
				tdArr[i].setAttribute("id",  counter + "-" + month);
			
				if ((daysArr[counter] === DATE.getDate())) {
					tdArr[i+1].className = DATE.getMonth() === currentMonth ? "todayHighlidth" : "";
				} 

			} else {
				prevDaysArr = prevDaysArr.slice(-tdArr.length + MAX_DAYS);
				tdArr[i].innerHTML += prevDaysArr[i];
				tdArr[i].setAttribute("id",  prevDaysArr[i] + "-" + Number(month-1));
			} 
		};
		setEvents(events);
	};



	function initBtnListeners(destroy) {
		var prevBtn = document.getElementById("prevBtn"),
			nextBtn = document.getElementById("nextBtn");
		
		var prevNextBtnHandler = function (e) {
			var id = this.id || e.srcElement.id;
			var month = (id === "prevBtn" ? DATE.getMonth() - 1 : DATE.getMonth() + 1);
			setNumbers(month, true);
			document.getElementById("year").innerHTML = MONTHS[DATE.getMonth()] + " " + YEAR;
		};
		
		if (destroy) {
			prevBtn.removeEventListener("click", prevNextBtnHandler);
			nextBtn.removeEventListener("click", prevNextBtnHandler);
		} else {
			prevBtn.addEventListener("click", prevNextBtnHandler);
			nextBtn.addEventListener("click", prevNextBtnHandler);
		}
	};



	function setEvents(events){
		var eventTemplate = "<p id='eventTitle'></p><p id='eventDescription'></p>";
		
		if(!(events instanceof Array)) {
			events[0] = [events[0]];
		}

		for (var i = 0; i < events.length; i++) {
			var day = events[i].date.split(".")[0] ;
			var month = events[i].date.split(".")[1] - 1;
			var num =  day + "-" + month;
			
			var td = document.getElementById(num);
			 	if (td !== null) {
			 		td.className = "addedEvent";
			 		td.innerHTML += eventTemplate;
			 		td.querySelector("#eventTitle").innerHTML += events[i].eventTitle;
			 		td.lastChild.innerHTML += events[i].eventDescription;
			 	}
		}	
	};



	function onResize() {
		var handler = function(event){
	  		var td = tableEl.querySelectorAll("td");
	  		for (var i = 0; i < td.length; i++) {
	  			td[i].width = parseInt(self.getCalendarEl().parentNode.clientWidth / DAYS.length);
				td[i].height = td[i].width;
	  		};
	  	};
		
		window.addEventListener ? window.addEventListener('resize', handler) : window.onresize = handler;	
	};


	
	/* Public API  */

	Calendar.prototype.addEvent = function () {
		if (events && (events instanceof Array)) {
			for (var i = 0; i < arguments.length; i++) {
				events.push(arguments[i]);
			};
		}
		setEvents(events);
	};


	Calendar.prototype.getEvents = function () {
		return events;
	};

	Calendar.prototype.getCalendarEl = function () {
		return tableEl;
	};

	Calendar.prototype.destroy = function () {
		tableEl.parentNode.removeChild(tableEl);
		initBtnListeners(true);
	};



	/* Init All */

	render();
	drawMonth();
	setNumbers(DATE.getMonth());
	initBtnListeners();
	onResize();
};