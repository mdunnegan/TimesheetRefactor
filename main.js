var weekCodes = weekISOcodes();
var weeks = [];
var currentWeekIndex = 0;

function p(arg){
	console.log(arg)
}

Week.prototype = {
	constructor: Week
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

function main(){
	
	weekCodes.forEach(function(code){
		weeks.push(new Week(code));
	});

	var weekRange = ISORangeToDate(weekCodes[0]);
	document.getElementById('weekRange').innerHTML = weekRange;

	var nextWeekButton = document.getElementById("nextWeekButton");
	var previousWeekButton = document.getElementById("previousWeekButton");
	var saveWeekButton = document.getElementById("saveWeek");

	nextWeekButton.addEventListener("click", function(){
		loadNextWeek();
	}, false);
	previousWeekButton.addEventListener("click", function(){
		loadPreviousWeek();
	}, false);
	saveWeekButton.addEventListener("click", function(){
		saveWeek();
	}, false);

	document.getElementById("previousWeekButton").disabled = true;
	displayHours();
}

main();

function Week(isoCode){
	this.sunday = new Day("sunday",0,0,0); // somehow these days are not getting the right prototype
	this.monday = new Day("monday",0,0,0);
	this.tuesday = new Day("tuesday",0,0,0);
	this.wednesday = new Day("wednesday",0,0,0);
	this.thursday = new Day("thursday",0,0,0);
	this.friday = new Day("friday",0,0,0);
	this.saturday = new Day("saturday",0,0,0);
	this.days = [this.sunday, this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday]
	this.isoCode = isoCode;
}

function Day(name, beginDay, finishDay, breakTime){
	this.name = name;
	this.beginDay = beginDay;
	this.finishDay = finishDay;
	this.breakTime = breakTime;
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

function loadNextWeek(){
	if (currentWeekIndex == 0){
		document.getElementById("previousWeekButton").disabled = false;
	}
	currentWeekIndex++;
	if (currentWeekIndex == 51){
		document.getElementById("nextWeekButton").disabled = true;
	}

	updateWeekHeader(weekCodes[currentWeekIndex]);
	displayHours();
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
	displayHours();
}

function updateWeekHeader(range){
	var weekHeader = ISORangeToDate(range);
	document.getElementById('weekRange').innerHTML = weekHeader;
}

function ISORangeToDate(iso_range){
	var firstDate = ISOToDate(iso_range[0])
	var secondDate = ISOToDate(iso_range[1])
	return firstDate + " - " + secondDate;
}

function ISOToDate(iso){
	var year = iso.slice(0,4);
	var month = iso.slice(4,6);
	var day = iso.slice(6);
	return month + "/" + day + "/" + year;
}

function displayHours(){
	var thisWeek = weeks[currentWeekIndex];

	thisWeek.days.forEach(function(day){
		document.getElementById(day.name + "_in").value = thisWeek[day.name].beginDay,
		document.getElementById(day.name + "_out").value = thisWeek[day.name].finishDay,
		document.getElementById(day.name + "_break").value = thisWeek[day.name].breakTime
	});

	displayWeekTotal();
}

function saveWeek(){
	if (currentWeekIndex < 0 || currentWeekIndex > 51){
		alert("You are out of range!");
		return;
	}

	var thisWeek = weeks[currentWeekIndex];
	var dayIn, dayOut, dayBreak;

	thisWeek.days.forEach(function(day){
		dayIn = document.getElementById(day.name + "_in").value;
		dayOut = document.getElementById(day.name + "_out").value;
		dayBreak = document.getElementById(day.name + "_break").value;

		if (!isNaN(dayIn) && !isNaN(dayOut) && !isNaN(dayBreak)){
			day.updateHours(Number(dayIn), Number(dayOut), Number(dayBreak));
		}
	});
	displayWeekTotal();
}

function displayWeekTotal(){
	var weekTotal = 0;
	var thisWeek = weeks[currentWeekIndex];

	thisWeek.days.forEach(function(day){
		var dayIn = document.getElementById(day.name + "_in").value;
		var dayOut = document.getElementById(day.name + "_out").value;
		var dayBreak = document.getElementById(day.name + "_break").value;

		if (!isNaN(dayIn) && !isNaN(dayOut) && !isNaN(dayBreak)){
			weekTotal += day.totalHours();	
		}
	});
	document.getElementById('weekTotal').innerHTML = "Week total is: " + weekTotal + " hours";
}
