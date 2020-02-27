$(document).ready(function(){
	var location, index;
	// show results
	$("#submit").click(function(){
		location = document.getElementById("location").value;
		if(location)print();
		// else if(!location)
	});

	// print function to display 
	function print(){
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=79f0172b1b48d3921c1cb1e091dde288`,
			type: 'GET',
			data: 'json',
			success: function(data){
				console.log(data.list);
				// document.getElementById("output").innerHTML = "";
				successAjax(data);
			},
			error: function(){console.log("error");}
		}); //end of ajax
	}


function toDateTime(secs) {
	secs = secs + 46800;
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

function successAjax(data){
	var best = -1000;
	var topArray = [];
	for(var i = 0; i < data.list.length; i++){
		var score = 0;
		// make better scores
		// if ((data.list[i].main.feels_like >= 16 ||
		// 	data.list[i].main.feels_like <= 19) || 
		// 	data.list[i].weather[0].main == "Clear" ||
		// 	data.list[i].wind.speed < 4)score++;

		// if (data.list[i].main.feels_like > 19 && 
		// 	data.list[i].weather[0].main == "Clear" &&
		// 	data.list[i].wind.speed < 2)score += 4;

		// if (data.list[i].main.feels_like > 19 && 
		// 	data.list[i].weather[0].main == "Clear" &&
		// 	data.list[i].wind.speed < 4 &&
		// 	data.list[i].wind.speed >= 2)score += 3;

		// if (data.list[i].main.feels_like > 19 || 
		// 	data.list[i].wind.speed < 2)score += 2;
			
		// if (data.list[i].main.feels_like < 16 || 
		// 	data.list[i].weather[0].main == "Clouds" ||
		// 	(data.list[i].wind.speed >= 4 || 
		// 	data.list[i].wind.speed <= 8))score--;

		// if (data.list[i].main.feels_like < 16 || 
		// 	data.list[i].weather[0].main == "Rain" ||
		// 	(data.list[i].wind.speed >= 4 || 
		// 	data.list[i].wind.speed <= 8))score -= 2;

		// if (data.list[i].main.feels_like < 10 || 
		// 	data.list[i].weather[0].main == "Extreme" ||
		// 	data.list[i].wind.speed > 8)score -= 5;

		// temperature
		if (data.list[i].main.feels_like >= 25)score += 5;

		if (data.list[i].main.feels_like >= 22 &&
			data.list[i].main.feels_like < 25)score += 4;

		if (data.list[i].main.feels_like >= 19 &&
			data.list[i].main.feels_like < 22)score += 3;

		if (data.list[i].main.feels_like >= 16 &&
		 	data.list[i].main.feels_like < 19)score++;

		if (data.list[i].main.feels_like <= 14 &&
		 	data.list[i].main.feels_like > 10)score--;

		if (data.list[i].main.feels_like <= 10)score -= 3;

		// weather
		if (data.list[i].weather[0].main == "Clear")score += 2;

		if (data.list[i].weather[0].main == "Drizzle")score--;

		if (data.list[i].weather[0].main == "Rain")score -= 2;

		if (data.list[i].weather[0].main == "Thunderstorm")score -= 5;

		if (data.list[i].weather[0].main == "Snow")score -= 5;

		// wind
		if (data.list[i].wind.speed < 2)score += 3;

		if (data.list[i].wind.speed >= 2 &&
			data.list[i].wind.speed < 4)score++;

		if (data.list[i].wind.speed >= 7 &&
			data.list[i].wind.speed < 9)score--;

		if (data.list[i].wind.speed >= 9)score -= 3;

		if (data.list[i].wind.speed >= 11)score -= 5;

		// time
		if (toDateTime(data.list[i].dt).getHours() >= 10 &&
			toDateTime(data.list[i].dt).getHours() <= 12)score++;

		if (toDateTime(data.list[i].dt).getHours() > 12 &&
			toDateTime(data.list[i].dt).getHours() <= 16)score += 3;

		if (toDateTime(data.list[i].dt).getHours() > 16 &&
			toDateTime(data.list[i].dt).getHours() <= 19)score += 2;

		// day
		if (toDateTime(data.list[i].dt).getDay() == 5)score +=2;

		if (toDateTime(data.list[i].dt).getDay() == 4 ||
			toDateTime(data.list[i].dt).getDay() == 6)score++;

		if (score > best){
			best = score;
			index = i;
			topArray = [];
			// var time = toDateTime(data.list[i].dt).getHours();
			var obj = data.list[i];
			topArray.push(obj);
		}

		else if (score == best){
			var obj = data.list[i];
			topArray.push(obj);
		}

		console.log(best, index, score, toDateTime(data.list[i].dt));
	}
	console.log(topArray);
	compareDates(topArray);
}

function compareDates(arr){
	document.getElementById("output").innerHTML = "<h3>There are "+arr.length+" suitable times for a piss up this week.</h3>";
	for(var i = 0; i<arr.length; i++){
		document.getElementById("output").innerHTML += "<p>"+toDateTime(arr[i].dt)+"</p>";
	}
	window.location.href = "#output";
}

});