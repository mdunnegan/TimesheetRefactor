Array.prototype.include = function(element){
	for (var i = 0; i < this.length; i++){
		if (this[i] == element){
			return true;
		}
	}
	return false;
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
		if (monthsWith31Days.include(i)){
			numDays = 31;
		} else if (monthsWith30Days.include(i)){
			numDays = 30;
		} else if (monthsWith29Days.include(i)){
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


var weekCodes = weekISOcodes();
var weeks = [];
var currentWeekIndex = 0;
weekCodes.forEach(function(code){
	weeks.push(new Week(code));
});
var weekRange = ISORangetoDate(weekCodes[0]);
document.getElementById('weekRange').innerHTML = weekRange;
disableButton("previousWeekButton");
var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
populateTable();


function Week(){}



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

// Gets called when the user presses next week
function loadNextWeek(){
	currentWeekIndex++;
	displayWeek(weekCodes[currentWeekIndex]);
	populateTable();
	if (currentWeekIndex == 51){
		disableButton("nextWeekButton");
	}
	enableButton("previousWeekButton");
}

// Gets called when the user presses previous week
function loadPreviousWeek(){
	currentWeekIndex--;
	displayWeek(weekCodes[currentWeekIndex]);
	populateTable();
	if (currentWeekIndex == 0){
		disableButton("previousWeekButton");
	}
	enableButton("nextWeekButton");
}

function displayWeek(range){
	var isoRange = ISORangetoDate(range);
	document.getElementById('weekRange').innerHTML = isoRange;
}

function disableButton(buttonId){
	document.getElementById(buttonId).disabled = true;
}

function enableButton(buttonId){
	document.getElementById(buttonId).disabled = false;
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

function ISORangetoDate(iso){
	// Eventually going to make the dates look nicer. Not a priority. Give it to the intern. 
	return iso;
}



