(function(){

$(document).ready(function(){
	var newTab = new TabController();
	newTab.addTab("CurrentCity");
	newTab.addTab("NextDays");
	newTab.addRadioBtn("xml");
	newTab.addRadioBtn("json");
	newTab.init();	
});

}());