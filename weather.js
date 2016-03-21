var tmp={
	currentCity:"London",
	currentDays:7,
	month:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

$(document).ready(function(){
	$("#NextDays").addClass("tab_selected");
	$("#changeDays").val(tmp.currentDays);
	getNextDaysData(tmp.currentDays);
	$("#content_next").show();
	$("#CurrentCity").click(function(){
		$("#NextDays").removeClass("tab_selected");
		$("#CurrentCity").addClass("tab_selected");
		getCurrentCityData(tmp.currentCity);
		$("#content_next").hide();
	});
	$("#NextDays").click(function(){
		$("#CurrentCity").removeClass("tab_selected");
		$("#NextDays").addClass("tab_selected");
		$("#content_city").hide();
		getNextDaysData(tmp.currentDays);
	});
	$("#changeCity").val(tmp.currentCity);
	$("#changeDays").change(function(){
		$(this).attr("disabled", true);
		tmp.currentDays=$(this).val();
		getNextDaysData($(this).val());
	});
	$("#changeCity").change(function(){
		$(this).attr("disabled", true);
		tmp.currentCity=$(this).val();
		getCurrentCityData($(this).val());
	})
});

function getNextDaysData(days){
	var apiURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+tmp.currentCity+"&mode=xml&units=metric&cnt="+days+"&appid=5df396cf7b4d7b339bc250ebfd041f2e";
	$.get(apiURL,function(data){
		showNextDays(data, days);
	});
}

function showNextDays(data, days){
	var html="";
	html += '<table class="table">';
	html += '<tbody>';
	for(var i=0;i<days;i++){
		var getDay = $(data).find("time").eq(i).attr("day");
		var mon = tmp.month[parseInt((getDay.split("-")[1]))-1];
		var day = getDay.split("-")[2];
		var icon = $(data).find("symbol").eq(i).attr("var");
		var temperatureMax = Math.round($(data).find("temperature").eq(i).attr("max"));
		var temperatureMin = Math.round($(data).find("temperature").eq(i).attr("min"));
		var weatherDes = $(data).find("symbol").eq(i).attr("name");
		var speed = $(data).find("windSpeed").eq(i).attr("mps");
		var cloudsAll = $(data).find("clouds").eq(i).attr("all");
		var pressure = $(data).find("pressure").eq(i).attr("value");
		html += '<tr>';
		html += '<td>'+day+' '+mon+' <img src="images/'+icon+'.png"></td>';
		html += '<td><span class="label label-warning">'+temperatureMax+'°C </span>&nbsp;';
		html += '<span class="label label-default">'+temperatureMin+'°C </span> &nbsp;&nbsp;';
		html += '<i>'+weatherDes+'</i> <p> '+speed+'m/s <br>clouds: '+cloudsAll+'%, '+pressure+' hpa</p></td>';
		html += '</tr>';
	}
	html += '</tbody></table>';
	$("#daily_list").html(html);
	$("#content_next").show();
	$("#changeDays").attr("disabled", false);
}

function getCurrentCityData(city){
	var apiURL = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&mode=xml&units=metric&appid=b1b15e88fa797225412429c1c50c122a";
	$.get(apiURL,function(data){
		showCurrentCity(data);
	});
}

function showCurrentCity(data){
	var c = new Date();
	var cityName = $(data).find("city").attr("name");
	var country = $(data).find("country").text();
	var temperature = Math.round($(data).find("temperature").attr("value"));
	var icon = $(data).find("weather").attr("icon");
	var getCityDes = $(data).find("weather").attr("number");
	var cityDes;
	switch(getCityDes.slice(0,1)){
		case "2": cityDes="Thunderstorm"; break;
		case "3": cityDes="Drizzle"; break;
		case "5": cityDes="Rain"; break;
		case "6": cityDes="Snow"; break;
		case "8": 
			getCityDes=="800" ? cityDes="Clear":cityDes="Clouds";
			break;
		default:
			var getCityDesVal=$(data).find("weather").attr("value");
			var strlen=getCityDesVal.length;
			var firstChar=getCityDesVal.slice(0,1).toUpperCase();
			cityDes=firstChar+getCityDesVal.slice(1,strlen);
			break;
	}
	var speedName = $(data).find("speed").attr("name");
	var speedVal = $(data).find("speed").attr("value");
	var directionName =  $(data).find("direction").attr("name");
	var directionVal =  $(data).find("direction").attr("value");
	var cloudsName = $(data).find("clouds").attr("name");
	var pressureVal = $(data).find("pressure").attr("value");
	var humidityVal = $(data).find("humidity").attr("value");
	var getSunrise = new Date($(data).find("sun").attr("rise"));
	var getSunset = new Date($(data).find("sun").attr("set"));
	var sunrise = getSunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
	var sunset = getSunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
	var coordlon = $(data).find("coord").attr("lon");
	var coordlat = $(data).find("coord").attr("lat");

	var html;
	html =  '<h3>'+cityName+', '+country+'</h3>'+
			'<h2> <img src="images/'+icon+'.png"> '+temperature+' °C</h2>'+
			cityDes+
			'<p>'+
			'<span id="date_m">get at '+
			c.getFullYear()+'.'+
			(((c.getMonth()+1)<10)?("0"+(c.getMonth()+1)):(c.getMonth()+1))+'.'+
			((c.getDate()<10)?("0"+c.getDate()):c.getDate())+' '+
			((c.getHours()<10)?("0"+c.getHours()):c.getHours())+":"+
			((c.getMinutes()<10)?("0"+c.getMinutes()):c.getMinutes())+'</span>'+
  			'(<a type="button" style="color: #D26C22;" href="#">Wrong data?</a>)'+
			'</p>'+
			'<table class="table table-striped table-bordered table-condensed">'+
			'<tbody>'+
			'<tr>'+
			'<td>Wind</td>'+
			'<td>'+speedName+' '+speedVal+' m/s <br>'+
        	directionName+' ('+directionVal+' )</td>'+
        	'</tr>'+
			'<tr>'+
			'<td>Cloudiness</td>'+
			'<td>'+cloudsName+'</td>'+
			'</tr>'+
			'<tr>'+
			'<td>Pressure<br></td>'+
			'<td>'+pressureVal+' hpa</td>'+
			'</tr>'+
			'<tr>'+
			'<td>Humidity</td>'+
			'<td>'+humidityVal+' %</td>'+
			'</tr>'+
			'<tr>'+
			'<td>Sunrise</td>'+
			'<td id="sunrise">'+sunrise+'</td>'+
			'</tr>'+
			'<tr>'+
			'<td>Sunset</td>'+
			'<td id="sunset">'+sunset+'</td>'+
			'</tr>'+
			'<tr>'+
			'<td>Geo coords</td>'+
			'<td id="coord"><a href="http://openweathermap.org/Maps?zoom=12&amp;lat='+coordlat+'&amp;lon='+coordlon+'&amp;layers=B0FTTFF">[ '+coordlon+', '+coordlat+' ]</a></td>'+
			'</tr>'+
			'</tbody>'+
			'</table>';
	$(".city_info").html(html);
	$("#content_city").show();
	$("#changeCity").attr("disabled", false);
}