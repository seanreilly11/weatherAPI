$(document).ready(function(){
	var location;
	document.getElementById("location").focus();
	// show results
	$("#submit").click(function(){
		location = document.getElementById("location").value;
		if(location)print();
		// else if(!location)
	});

	// print function to display 
	function print(){
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/forecast?q=${location},NZ&units=metric&appid=79f0172b1b48d3921c1cb1e091dde288`,
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
			topArray = [];
			var obj = data.list[i];
			topArray.push(obj);
		}

		else if (score == best || Math.abs(score-best) <= 2){
			var obj = data.list[i];
			topArray.push(obj);
		}

		data.list[i].score = score;

		// console.log(best, index, score, toDateTime(data.list[i].dt));
	}
	theBest(topArray, best);
}

function makeDate(arr){
	for(var i = 0; i<arr.length; i++){
		var date = toDateTime(arr[i].dt)
		console.log(date);
	}
}

function compareDates(arr, index){
	document.getElementById("output").innerHTML = "<h3 class='sub-heading mb-3'>There are "+arr.length+" suitable times for a piss up this week in " + capitalise() 
	+ ". <a href='#top'>Change location</a></h3><div class='grid mb-5' id='weather'>";
	for(var i = 0; i<arr.length; i++){
		var card = "";
		var wind = (arr[i].wind.speed * 3.6).toFixed(1);
		if(i === index){card += '<div class="card best-card pb-3">';}
		else{card += '<div class="card p-3">';}
		card += '<img src="http://openweathermap.org/img/wn/' + arr[i].weather[0].icon + '@2x.png" class="card-img-top" alt="Weather icon">'
		+ '<div class="card-body"><h6 class="card-title">'+toDateTime(arr[i].dt)+'</h6>'
		+ '<p class="card-text">Temp: '+Math.round(arr[i].main.temp)+'°C</p>'
		+ '<p class="card-text">Weather: '+arr[i].weather[0].main+'</p>'
		+ '<p class="card-text">Score: '+arr[i].score+'</p>'
		+ '<p class="card-text">Wind: '+wind+'km/h</p>'
		+ '<button class="btn btn-primary" id="arr'+i+'">Make Piss Up Today</button></div></div>';
		document.getElementById("weather").innerHTML += card;
	}

	$(".container").show();
	window.location.href = "#output";
}

function theBest(arr, best){
	var bestArray = [];
	for(var i = 0; i<arr.length; i++){
		if (arr[i].score == best){
			var obj = arr[i];
			obj.index = i
			bestArray.push(obj);
		}
	}

	bestArray.sort(function(a,b){
		if(b.main.temp > a.main.temp) return 1;
		if(b.main.temp < a.main.temp) return -1;
	})

	var index = bestArray[0].index;
	console.log(index);

	console.log(bestArray)

	compareDates(arr, index);
}

function capitalise(){
	return location.charAt(0).toUpperCase() + location.slice(1);
}
});
















