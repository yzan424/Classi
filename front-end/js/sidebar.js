var distributions = [];
var departments = [];

$(function(){
	var url = "http://classiapp.herokuapp.com/getdistributions" 

	request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			raw = request.responseText;
			distributions = JSON.parse(raw);
			populate_distributions();
		}
	}
	request.send(null);
})

$(function(){
	var url = "http://classiapp.herokuapp.com/getdepartments" 

	request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			raw = request.responseText;
			departments = JSON.parse(raw);
			populate_departments();
		}
	}
	request.send(null);
})

function populate_distributions() {
	for (d in distributions) {
		var str = "<option>" + distributions[d].Distributions + "</option>";
		$("#distribution").append(str);
	}
}



function populate_departments() {
	
}