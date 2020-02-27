$(document).ready(function(){
	var location, index;
	// show results
	$("#submit").click(function(){
		location = document.getElementById("location").value;
		print();
	});

	// print function to display 
	function print(){
		$.ajax({
			url: "https://api.openweathermap.org/data/2.5/forecast?q=wellington&units=metric&appid=79f0172b1b48d3921c1cb1e091dde288",
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
	console.log(location);
	var topArray = [];
	for(var i = 0; i < data.list.length; i++){
		var score = 0;
		// make better scores
		if ((data.list[i].main.feels_like >= 16 ||
			data.list[i].main.feels_like <= 19) || 
			data.list[i].weather[0].main == "Clear" ||
			data.list[i].wind.speed < 4)score++;

		if (data.list[i].main.feels_like > 19 && 
			data.list[i].weather[0].main == "Clear" &&
			data.list[i].wind.speed < 2)score += 4;

		if (data.list[i].main.feels_like > 19 && 
			data.list[i].weather[0].main == "Clear" &&
			data.list[i].wind.speed < 4 &&
			data.list[i].wind.speed >= 2)score += 3;

		if (data.list[i].main.feels_like > 19 || 
			data.list[i].wind.speed < 2)score += 2;
			
		if (data.list[i].main.feels_like < 16 || 
			data.list[i].weather[0].main == "Clouds" ||
			(data.list[i].wind.speed >= 4 || 
			data.list[i].wind.speed <= 8))score--;

		if (data.list[i].main.feels_like < 16 || 
			data.list[i].weather[0].main == "Rain" ||
			(data.list[i].wind.speed >= 4 || 
			data.list[i].wind.speed <= 8))score -= 2;

		if (data.list[i].main.feels_like < 10 || 
			data.list[i].weather[0].main == "Extreme" ||
			data.list[i].wind.speed > 8)score -= 5;

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
	for(var i = 0; i<arr.length; i++){
		// console.log(toDateTime(arr[i].dt).getHours())
	}
}

});