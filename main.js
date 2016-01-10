// I want to make this more like a main method! Not global stuff

var weekCodes = weekISOcodes();
var weeks = [];
var currentWeekIndex = 0;
weekCodes.forEach(function(code){
	weeks.push(new Week(code));
});

var weekRange = ISORangetoDate(weekCodes[0]);
document.getElementById('weekRange').innerHTML = weekRange;

var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

var nextWeekButton = document.getElementById("nextWeekButton");
var previousWeekButton = document.getElementById("previousWeekButton");
var saveWeekButton = document.getElementById("saveWeek");

setOnClickHandler(nextWeekButton, "nextWeekButton", loadNextWeek)
setOnClickHandler(previousWeekButton, "previousWeekButton", loadPreviousWeek)
setOnClickHandler(saveWeekButton, "saveWeekButton", saveWeek)

document.getElementById("previousWeekButton").disabled = true;
populateTable();

function setOnClickHandler(button, id, f){
	button.onclick = function(){f();};
}

function weekISOcodes(){
	var weekStartCodes = [];
	var startDate = "20160103"; // First sunday of 2016
	var currentDate = startDate;

	var monthsWith30Days = [4, 6, 9, 11];
	var monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
	var monthsWith28Days = [];
	var monthsWith29Days = [];

	if (startDate.slice(0, 4) % 4 == 0){
		monthsWith29Days.push(2);
	} else {
		monthsWith28Days.push(2);
	}

	var carryover = Number(startDate.slice(-1))
	for (var i = 1; i <= 12; i++){
		var numDays = 0;
		if (monthsWith31Days.indexOf(i) > -1){
			numDays = 31;
		} else if (monthsWith30Days.indexOf(i) > -1){
			numDays = 30;
		} else if (monthsWith29Days.indexOf(i) > -1){
			numDays = 29;
		} else {
			numDays = 28;
		}

		for (var j = carryover; j <= numDays; j += 7){
			weekStartCodes.push([currentDate, String(Number(currentDate)+6)]);
			currentDate = String(Number(currentDate) + 7);
		}
		
		j-=7;
		carryover = 7 - (numDays - j);
		currentDate = String(Number(currentDate.slice(0, -2) + 0 + carryover) + 100);
	}
	return weekStartCodes;
}

function Week(isoCode){
	this.isoCode = isoCode;
}


function Day(beginDay, finishDay, breakTime){
	this.beginDay = Number(beginDay);
	this.finishDay = Number(finishDay);
	this.breakTime = Number(breakTime);
}

Day.prototype = {
	constructor: Day,
	totalHours: function(){
		return this.finishDay - this.beginDay - this.breakTime;
	},

	updateHours: function(beginDay, finishDay, breakTime){
		this.beginDay = beginDay;
		this.finishDay = finishDay;
		this.breakTime = breakTime;
	}
};

function loadNextWeek(){
	if (currentWeekIndex == 0){
		document.getElementById("previousWeekButton").disabled = false;
	}
	currentWeekIndex++;
	if (currentWeekIndex == 51){
		document.getElementById("nextWeekButton").disabled = true;
	}

	updateWeekHeader(weekCodes[currentWeekIndex]);
	populateTable();
}

function loadPreviousWeek(){
	if (currentWeekIndex == 51){
		document.getElementById("nextWeekButton").disabled = false;
	}
	currentWeekIndex--;
	if (currentWeekIndex == 0){
		document.getElementById("previousWeekButton").disabled = true;
	}
	
	updateWeekHeader(weekCodes[currentWeekIndex]);
	populateTable();
}

function updateWeekHeader(range){
	var isoRange = ISORangetoDate(range);
	document.getElementById('weekRange').innerHTML = isoRange;
}

function ISORangetoDate(iso){
	// Eventually going to make the dates look nicer. Not a priority. Give it to the intern. 
	return iso;
}

function populateTable(){
	// display hours for current week 
	var thisWeek = weeks[currentWeekIndex];
	days.forEach(function(day, index){
		day = day.toLowerCase();

		if (thisWeek[days[index]] == undefined){
			thisWeek[days[index]] = new Day(0,0,0);
		}

		document.getElementById(day + "_in").value = thisWeek[days[index]].beginDay,
		document.getElementById(day + "_out").value = thisWeek[days[index]].finishDay,
		document.getElementById(day + "_break").value = thisWeek[days[index]].breakTime
	});
	displayWeekTotal();
}

function saveWeek(){
	if (currentWeekIndex < 0 || currentWeekIndex > 51){
		// Should never get here because of the button disabling
		alert("You are out of range!");
		return;
	}

	var weekToUpdate = weeks[currentWeekIndex];

	days.forEach(function(day, index){
		day = day.toLowerCase();

		var dayIn = document.getElementById(day + "_in").value;
		var dayOut = document.getElementById(day + "_out").value;
		var dayBreak = document.getElementById(day + "_break").value;

		if (!isNaN(dayIn) && !isNaN(dayOut) && !isNaN(dayBreak)){
			weekToUpdate[days[index]] = new Day(
				Number(dayIn),
				Number(dayOut),
				Number(dayBreak)
			);
		}
	});

	displayWeekTotal();

}

function displayWeekTotal(){
	var weekTotal = 0;
	days.forEach(function(day, index){
		var dayIn = document.getElementById(day + "_in").value;
		var dayOut = document.getElementById(day + "_out").value;
		var dayBreak = document.getElementById(day + "_break").value;
		if (!isNaN(dayIn) && !isNaN(dayOut) && !isNaN(dayBreak)){
			weekTotal += (dayOut - dayIn - dayBreak);	
		}
	});
	document.getElementById('weekTotal').innerHTML = "Week total is: " + weekTotal + " hours";

}


