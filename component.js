(function(){

var TabController = function(){};

TabController.prototype = {

    options: {
        tabPool: [],
        name: '',
        tabId: '',
        currentSelect: 'NextDays',
        type: "xml",
        currentCurrentCity: 'London',
        currentNextDays: 7,
        radioText: '',
        radioVal: '',
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        poolCurrentCity: ["Taipei", "NewYork", "London"],
        poolCurrentCityText: ["Taipei", "New York", "London"],
        poolNextDays: ["5", "7", "16"],
        poolNextDaysText: ["5 days", "7 days", "16 days"]
    },

    addTab: function(name){
        this.options.tabPool.push(name);
        this.options.name = name;
        this.options.tabId = "tab"+name;
        $(".tabbar").append('<div id="tab'+name+'" class="tab">'+name+'</div>');
        this.addSelect(name);
        this.addClickEvents();
    },
    addRadioBtn: function(text, val){
        this.options.radioText = text;
        this.options.radioVal = val;
        $(".typeSelect > span").append('<input type="radio" name="typeSel" value="'+val+'"></input><span>'+text+'</span>');
        this.addChangeEvent();
    },
    addSelect: (function(name){
        var selectHTML = '';
        selectHTML += '<select id="change'+name+'">';
        for(var i=0;i<this.options["pool"+name].length;i++){
            selectHTML += '<option value="'+this.options["pool"+name][i]+'">'+this.options["pool"+name+"Text"][i]+'</option>'
        }
        selectHTML += '</select>';
        $("#content_tab"+name+" > .select > div").html(selectHTML);
        this.addSelectEvent(name);
    }),
    addClickEvents: (function(){
        $("#"+this.options.tabId).bind('click', {context: this}, this.onClick);
    }),
    onClick: (function(ev){
        var self = ev.data.context;
        self.handleCellClick(this.childNodes[0].nodeValue);
    }),
    addChangeEvent: (function(){
        $("input:radio[name='typeSel']").bind('change', {context: this}, this.onChange);
    }),
    onChange: (function(ev){
        var self = ev.data.context;
        self.handleCellChange(this.value);
    }),
    addSelectEvent: (function(name){
        $("#change"+name).bind('change', {context: this}, this.onChangeSelect);
    }),
    onChangeSelect: (function(ev){
        var self = ev.data.context;
        self.handleCellSelect(this.value);
    }),
    handleCellClick: (function(id){
        this.options.currentSelect = id;
        this.display();
    }),
    handleCellChange: (function(val){
        this.options.type = val;
        this.getNextDaysData();
        this.getCurrentCityData();
        this.display();
    }),
    handleCellSelect: (function(val){
        this.options["current"+this.options.currentSelect] = val;
        //console.log(this.options["current"+this.options.currentSelect]);
        this.getNextDaysData();
        this.getCurrentCityData();
        this.display();
    }),
    getNodeValue: (function(data, xpath){
        var nodes = data.evaluate(xpath, data, null, XPathResult.ANY_TYPE, null);
        return nodes.iterateNext().nodeValue;
    }),
    getNextDaysData: (function(){
        var apiURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+this.options.currentCurrentCity+"&mode="+this.options.type+"&units=metric&cnt="+this.options.currentNextDays+"&appid=8b5e25806eda1463bbfb1ce83b50c4e9";
        var request = new XMLHttpRequest();
        request.open("GET", apiURL, false);
        request.send();
        if(this.options.type=="xml"){
            var xml = request.responseXML;
            this.showNextDays(xml);
        }else{
            var json = JSON.parse(request.responseText);
            this.showNextDays(json);
        }
    }),
    showNextDays: (function(data){
        var html="";
        html += '<table class="table">';
        html += '<tbody>';
        for(var i=0;i<this.options.currentNextDays;i++){
            if(this.options.type=="xml"){
                var getDay = this.getNodeValue(data, "//forecast/time["+(i+1)+"]/@day");
                var mon = this.options.month[parseInt((getDay.split("-")[1]))-1];
                var day = getDay.split("-")[2];
                var icon = this.getNodeValue(data, "//forecast/time["+(i+1)+"]/symbol/@var");
                var temperatureMax = Math.round(this.getNodeValue(data, "//forecast/time["+(i+1)+"]/temperature/@max"));
                var temperatureMin = Math.round(this.getNodeValue(data, "//forecast/time["+(i+1)+"]/temperature/@min"));
                var weatherDes = this.getNodeValue(data, "//forecast/time["+(i+1)+"]/symbol/@name");
                var speed = this.getNodeValue(data, "//forecast/time["+(i+1)+"]/windSpeed/@mps");
                var cloudsAll = this.getNodeValue(data, "//forecast/time["+(i+1)+"]/clouds/@all");
                var pressure = this.getNodeValue(data, "//forecast/time["+(i+1)+"]/pressure/@value");
            }else{
                var monTmp = new Date((data.list[i].dt)*1000).getMonth();
                var mon = this.options.month[monTmp];
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
    }),
    getCurrentCityData: (function(){
        var apiURL = "http://api.openweathermap.org/data/2.5/weather?q="+this.options.currentCurrentCity+"&mode="+this.options.type+"&units=metric&appid=8b5e25806eda1463bbfb1ce83b50c4e9";
        var request = new XMLHttpRequest();
        request.open("GET", apiURL, false);
        request.send();
        if(this.options.type=="xml"){
            var xml = request.responseXML;
            this.showCurrentCity(xml);
        }else{
            var json = JSON.parse(request.responseText);
            this.showCurrentCity(json);
        }
    }),
    showCurrentCity: (function(data){
        var c = new Date();
        if(this.options.type == "xml"){
            var cityName = this.getNodeValue(data, "//city/@name");
            var country = this.getNodeValue(data, "//city/country/text()");
            var temperature = Math.round(this.getNodeValue(data, "//temperature/@value"));
            var icon = this.getNodeValue(data, "//weather/@icon");
            var getCityDes = this.getNodeValue(data, "//weather/@number");
            var cityDes;
            switch(getCityDes.slice(0,1)){
                case "2": cityDes = "Thunderstorm"; break;
                case "3": cityDes = "Drizzle"; break;
                case "5": cityDes = "Rain"; break;
                case "6": cityDes = "Snow"; break;
                case "8": 
                    getCityDes=="800" ? cityDes="Clear":cityDes="Clouds";
                    break;
                default:
                    var getCityDesVal = this.getNodeValue(data, "//weather/@value");
                    var strlen = getCityDesVal.length;
                    var firstChar = getCityDesVal.slice(0,1).toUpperCase();
                    cityDes = firstChar+getCityDesVal.slice(1,strlen);
                    break;
            }
            var speedName = this.getNodeValue(data, "//wind/speed/@name");
            var speedVal = this.getNodeValue(data, "//wind/speed/@value");
            var directionName = this.getNodeValue(data, "//wind/direction/@name");
            var directionVal = this.getNodeValue(data, "//wind/direction/@value");
            var cloudsName = this.getNodeValue(data, "//clouds/@name");
            var pressureVal = this.getNodeValue(data, "//pressure/@value");
            var humidityVal = this.getNodeValue(data, "//humidity/@value");
            var getSunrise = new Date(this.getNodeValue(data, "//city/sun/@rise"));
            var getSunset = new Date(this.getNodeValue(data, "//city/sun/@set"));
            var sunrise = getSunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
            var sunset = getSunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
            var coordlon = this.getNodeValue(data, "//city/coord/@lon");
            var coordlat = this.getNodeValue(data, "//city/coord/@lat");
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
    }),
    display: (function(){
        var i, poolLength = this.options.tabPool.length;
        $(".tabbar > div").removeClass("tab_selected");
        $("#tab"+this.options.currentSelect).addClass("tab_selected");
        $("input:radio[name='typeSel'][value='"+this.options.type+"']").prop('checked',true);
        for(i=0;i<poolLength;i++){
            $("#content_tab"+this.options.tabPool[i]).hide();
        }
        $("#content_tab"+this.options.currentSelect).show();
    }),
    init: (function(){
        $("#tab"+this.options.currentSelect).addClass("tab_selected");
        $("input:radio[name='typeSel'][value='"+this.options.type+"']").prop('checked',true);
        $("#changeNextDays").val(this.options.currentNextDays);
        $("#changeCurrentCity").val(this.options.currentCurrentCity);
        this.getNextDaysData();
        this.getCurrentCityData();
        this.display();
    })
};

window.TabController = TabController;

}());