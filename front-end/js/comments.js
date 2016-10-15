var comments = [];
var stars = [];
var timestamp = [];

var header = "Comments";
var html = '<hr>'; 
var newhtml = "";
var newstars = "";
comments = ["hi", "yo", "classi", "test"];
stars = [1, 5, 3, 4];
timestamp = ["10/31/1995", "12/1/2006", "11/11/1999", "12/4/2015"];
grades = ["A", "B", "C", "D"];
var index;

function init(id) {
	var url = "https://classiapp.herokuapp.com/getclasses";
	request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
            raw = request.responseText;
            courses = JSON.parse(raw);

            for (i=0; i<cources.length; i++) {
            	if (id = cources[i][id]) {
            		index = i;
            		comments = cources[i][Comments];
            		//timestamp = cources[i][]
            		grades = cources[i][Grades];
            		stars = cources[i][Stars];
            	}
            }
        }
    }
    request.send(null)
}

function sendcomments() {
	var url = "https://classiapp.herokuapp.com/getclasses";
	request = new XMLHttpRequest();
    request.open("POST", url, true);

    /* finish! */
}

function postComments() {

	document.getElementById("cmtHeader").innerHTML = header;

	for (i=0; i < comments.length; i++) {

		for(j=0; j <stars[i]; j++) {
			html += '<span style="font-size:150%;color:#fdeb72;">&starf;</span>';
		}

		for(j=stars[i]; j<5; j++) {
			html += '<span style="font-size:150%;color:#c5c1c1;">&star;</span>';
		}

		html += "<br>" + '<div class="cmts">' + '"' + comments[i] + '"' + '</div>' + timestamp[i] + "<hr>";
	}
	document.getElementById("comments").innerHTML = html;
}

function displayStars() {
	newhtml = '<hr>';

	newhtml += '<div class="star"; onclick= redisplayStars(1)><span style="font-size:150%;color:#c5c1c1;">&star;</span></div>';
	newhtml += '<div class="star"; onclick= redisplayStars(2)><span style="font-size:150%;color:#c5c1c1;">&star;</span></div>';
	newhtml += '<div class="star"; onclick= "redisplayStars(3)"><span style="font-size:150%;color:#c5c1c1;">&star;</span></div>';
	newhtml += '<div class="star"; onclick= "redisplayStars(4)"><span style="font-size:150%;color:#c5c1c1;">&star;</span></div>';
	newhtml += '<div class="star"; onclick= "redisplayStars(5)"><span style="font-size:150%;color:#c5c1c1;">&star;</span></div>';

	document.getElementById("newcomments").innerHTML = newhtml;
}

function redisplayStars(count) {

	newstar = [];
	newstar[0] = count;
	stars = newstar.concat(stars);

	newhtml = "<hr>";
	for (i=0; i<count; i++) {
		newhtml += '<span style="font-size:150%;color:#fdeb72;">&starf;</span>';
	}

	for(i=count; i<5; i++) {
		newhtml += '<span style="font-size:150%;color:#c5c1c1;">&star;</span>';
	}

	newstars = newhtml;
	document.getElementById("newcomments").innerHTML = newhtml;
	displayGrade();
}

function getTimeStamp() {
	var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    var newtime = [];
    newtime[0] = month + "/" + day + "/" + year;

    timestamp = newtime.concat(timestamp);
}

function recordComment() {
	var commentText = [];
	commentText[0] = document.getElementById("comment").value;

	comments = commentText.concat(comments);

	getTimeStamp();
	document.getElementById("newcomments").innerHTML = "";
	html = '<hr>';
	postComments();
}

function displayCommentBox() {
	document.getElementById("newcomments").innerHTML += '<textarea rows="4" cols="50" id="comment" form="usrform" placeholder="Comments..."></textarea>';

	document.getElementById("newcomments").innerHTML += '<div class="form-actions padded"><button type="submit" onclick="recordComment()" class="btn btn-form btn-secondary">submit</button></div>';	
}

function recordGrade(grade) {
	var newgrade = []
	newgrade[0] = grade;

	grades = newgrade.concat(grades);

	document.getElementById("newcomments").innerHTML = newstars + "<br>" 
		+ "Grade: " + grade + "<br>";

	displayCommentBox();
}

function displayGrade() {
	 document.getElementById("newcomments").innerHTML += '<select class="form-control padded" onchange="recordGrade(value)"><option>grade</option><option value="A+">A+</option><option value="A">A</option><option value="A-">A-</option><option value="B+">B+</option><option value="B">B</option><option value="B-">B-</option><option value="C+">C+</option><option value="C">C</option><option value="C-">C-</option><option value="D+">D+</option><option value="D">D</option><option value="D-">D-</option><option value="F">F</option></select>';
}


function getComments() {
	displayStars(); 
}

