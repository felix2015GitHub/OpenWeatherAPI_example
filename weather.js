(function(){

var tmp={
	defpage:"days",
	type:"xml",
	currentCity:"London",
	currentDays:7,
	month:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

$(document).ready(function(){
	$(".tabbar").TabController("CurrentCity", "tab", "Current City");
	$(".tabbar").TabController("NextDays", "tab", "Next Days");
	$("input:radio[name='typeSel'][value='"+tmp.type+"']").prop('checked',true);
	$("#NextDays").addClass("tab_selected");
	$("#changeDays").val(tmp.currentDays);
	getNextDaysData(tmp.currentDays, tmp.type);
	$("#content_next").show();
	$("#CurrentCity").click(function(){
		$("#NextDays").removeClass("tab_selected");
		$("#CurrentCity").addClass("tab_selected");
		tmp.defpage="city";
		getCurrentCityData(tmp.currentCity, tmp.type);
		$("#content_next").hide();
	});
	$("#NextDays").click(function(){
		$("#CurrentCity").removeClass("tab_selected");
		$("#NextDays").addClass("tab_selected");
		$("#content_city").hide();
		tmp.defpage="days";
		getNextDaysData(tmp.currentDays, tmp.type);
	});
	$("#changeCity").val(tmp.currentCity);
	$("#changeDays").change(function(){
		$(this).attr("disabled", true);
		tmp.currentDays=$(this).val();
		getNextDaysData($(this).val(), tmp.type);
	});
	$("#changeCity").change(function(){
		$(this).attr("disabled", true);
		tmp.currentCity=$(this).val();
		getCurrentCityData($(this).val(), tmp.type);
	});
	$("input:radio[name='typeSel']").change(function(){
		if($(this).val() == "xml"){
			tmp.type="xml";
			if(tmp.defpage=="days"){
				getNextDaysData(tmp.currentDays, "xml");
			}else{
				getCurrentCityData(tmp.currentCity, "xml");
			}
		}else{
			tmp.type="json";
			if(tmp.defpage=="days"){
				getNextDaysData(tmp.currentDays, "json");
			}else{
				getCurrentCityData(tmp.currentCity, "json");
			}
		}
	});
});

function getNodeValue(data, xpath){
	var nodes = data.evaluate(xpath, data, null, XPathResult.ANY_TYPE, null);
	return nodes.iterateNext();
}

function getNextDaysData(days, type){
	var apiURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+tmp.currentCity+"&mode="+type+"&units=metric&cnt="+days+"&appid=8b5e25806eda1463bbfb1ce83b50c4e9";
	$.get(apiURL,function(data){
		showNextDays(data, days);
	});
}

function showNextDays(data, days){

	var html="";
	html += '<table class="table">';
	html += '<tbody>';
	for(var i=0;i<days;i++){
		if(tmp.type=="xml"){
			var getDay = getNodeValue(data, "//forecast/time["+(i+1)+"]/@day").nodeValue;
			var mon = tmp.month[parseInt((getDay.split("-")[1]))-1];
			var day = getDay.split("-")[2];
			var icon = getNodeValue(data, "//forecast/time["+(i+1)+"]/symbol/@var").nodeValue;
			var temperatureMax = Math.round(getNodeValue(data, "//forecast/time["+(i+1)+"]/temperature/@max").nodeValue);
			var temperatureMin = Math.round(getNodeValue(data, "//forecast/time["+(i+1)+"]/temperature/@min").nodeValue);
			var weatherDes = getNodeValue(data, "//forecast/time["+(i+1)+"]/symbol/@name").nodeValue;
			var speed = getNodeValue(data, "//forecast/time["+(i+1)+"]/windSpeed/@mps").nodeValue;
			var cloudsAll = getNodeValue(data, "//forecast/time["+(i+1)+"]/clouds/@all").nodeValue;
			var pressure = getNodeValue(data, "//forecast/time["+(i+1)+"]/pressure/@value").nodeValue;
		}else{
			var monTmp = new Date((data.list[i].dt)*1000).getMonth();
			var mon = tmp.month[monTmp];
			var day = new Date((data.list[i].dt)*1000).getDate();
			var icon = data.list[i].weather[0].icon
			var temperatureMax = Math.round(data.list[i].temp.max);
			var temperatureMin = Math.round(data.list[i].temp.min);
			var weatherDes = data.list[i].weather[0].description;
			var speed = data.list[i].speed;
			var cloudsAll = data.list[i].clouds;
			var pressure = data.list[i].pressure;
		}
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

function getCurrentCityData(city, type){
	var apiURL = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&mode="+type+"&units=metric&appid=8b5e25806eda1463bbfb1ce83b50c4e9";
	$.get(apiURL,function(data){
		showCurrentCity(data);
	});
}

function showCurrentCity(data){
	
	var c = new Date();

	if(tmp.type=="xml"){
		var cityName = getNodeValue(data, "//city/@name").nodeValue;
		var country = getNodeValue(data, "//city/country/text()").nodeValue;
		var temperature = Math.round(getNodeValue(data, "//temperature/@value").nodeValue);
		var icon = getNodeValue(data, "//weather/@icon").nodeValue;
		var getCityDes = getNodeValue(data, "//weather/@number").nodeValue;
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
				var getCityDesVal=getNodeValue(data, "//weather/@value").nodeValue;
				var strlen=getCityDesVal.length;
				var firstChar=getCityDesVal.slice(0,1).toUpperCase();
				cityDes=firstChar+getCityDesVal.slice(1,strlen);
				break;
		}
		var speedName = getNodeValue(data, "//wind/speed/@name").nodeValue;
		var speedVal = getNodeValue(data, "//wind/speed/@value").nodeValue
		var directionName = getNodeValue(data, "//wind/direction/@name").nodeValue;
		var directionVal = getNodeValue(data, "//wind/direction/@value").nodeValue;
		var cloudsName = getNodeValue(data, "//clouds/@name").nodeValue;
		var pressureVal = getNodeValue(data, "//pressure/@value").nodeValue;
		var humidityVal = getNodeValue(data, "//humidity/@value").nodeValue;
		var getSunrise = new Date(getNodeValue(data, "//city/sun/@rise").nodeValue);
		var getSunset = new Date(getNodeValue(data, "//city/sun/@set").nodeValue);
		var sunrise = getSunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
		var sunset = getSunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
		var coordlon = getNodeValue(data, "//city/coord/@lon").nodeValue;
		var coordlat = getNodeValue(data, "//city/coord/@lat").nodeValue;
	}else{
		var cityName = data.name;
		var country = data.sys.country;
		var temperature = Math.round(data.main.temp);
		var icon = data.weather[0].icon;
		var getCityDes = data.weather[0].id;
		var cityDes;
		switch(getCityDes.toString().slice(0,1)){
			case "2": cityDes="Thunderstorm"; break;
			case "3": cityDes="Drizzle"; break;
			case "5": cityDes="Rain"; break;
			case "6": cityDes="Snow"; break;
			case "8": 
				getCityDes=="800" ? cityDes="Clear":cityDes="Clouds";
				break;
			default:
				var getCityDesVal=data.weather[0].description;
				var strlen=getCityDesVal.length;
				var firstChar=getCityDesVal.slice(0,1).toUpperCase();
				cityDes=firstChar+getCityDesVal.slice(1,strlen);
				break;
		}
		var speedName = "---";
		var speedVal = data.wind.speed;
		var directionName = "---";
		var directionVal = data.wind.deg;
		var cloudsName = "---";
		var pressureVal = data.main.pressure;
		var humidityVal = data.main.humidity;
		var getSunrise = new Date((data.sys.sunrise)*1000);
		var getSunset = new Date((data.sys.sunset)*1000);
		var sunrise = getSunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
		var sunset = getSunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
		var coordlon = data.coord.lon;
		var coordlat = data.coord.lat;
	}

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

}());