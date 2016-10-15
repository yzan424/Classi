console.log("omg we opened the file at least")
var comments = [];
var stars = [];
var timestamp = [];
var newgrade = "";
var header = "Comments";
var html = '<hr>'; 
var newhtml = "";
var newstars = "";
var courses = "";
var index;
var end;
var add_comments_default = '<button id="addcommentsbutton" type="submit" onclick="return getComments()" class="btn btn-form btn-secondary">add comment</button>';

function init(courses, code) {
	//console.log("in init");
	//var url = "https://classiapp.herokuapp.com/getclasses";
	//var request = new XMLHttpRequest();
	//console.log(request);
    //request.onreadystatechange = function() {
    	//console.log(request.status)
        //if(request.readyState == 4 && request.status == 200) {
           // raw = request.responseText;
            //courses = JSON.parse(raw);
            //console.log(raw);
            for (i=0; i<courses.length; i++) {
	            if (code == courses[i].Code) {
	            	console.log(courses[i].Comments[0][0]);
	            	index = i;
	            	for (j=0; j<courses[i].Comments.length; j++) {
		            	comments[j] = courses[i].Comments[j][0];
		            	stars[j] = courses[i].Comments[j][1];
		            	timestamp[j] = courses[i].Comments[j][2];
	            	}
	            }
            }
            end = courses[index].Comments.length;
            postComments();
        //}
        	//request.open("GET", url);
    		//request.send(null)
    //}
    
}

function sendcomments() {

	var url = "https://classiapp.herokuapp.com/newClassInfo";
	request = new XMLHttpRequest();

	request.open("POST", url);
    request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    
	request.onreadystatechange = function() {
    	if (request.readyState == 4 && request.status == 200) {
    		console.log("success");
    	}
	}

    request.send("comment=" + comments[end] + "&star=" + stars[end] +"&time=" + timestamp[end] + "&grade=" + newgrade + "&code=" + courses[index].Code); 
    end = end + 1;
}

function postComments() {

	document.getElementById("cmtHeader").innerHTML = header;

	for (i=0; i < comments.length; i++) {

		for(j=0; j < stars[i]; j++) {
			html += '<span style="font-size:150%;color:#fdeb72;">&starf;</span>';
		}

		for(j=stars[i]; j<5; j++) {
			html += '<span style="font-size:150%;color:#c5c1c1;">&star;</span>';
		}

		html += "<br>" + '<div class="cmts">' + '"' + comments[i] + '"' + '</div>' + timestamp[i] + "<hr>";
	}
	document.getElementById("comments").innerHTML = html;
	document.getElementById("addcomments").innerHTML = add_comments_default;
}

function displayStars() {
	document.getElementById("addcomments").innerHTML = "";
	newhtml = '';

	newhtml += '<div class="star"; onclick= redisplayStars(1)><span style="font-size:150%;color:#c5c1c1;">&star;</span></div>';
	newhtml += '<div class="star"; onclick= redisplayStars(2)><span style="font-size:150%;color:#c5c1c1;">&star;</span></div>';
	newhtml += '<div class="star"; onclick= "redisplayStars(3)"><span style="font-size:150%;color:#c5c1c1;">&star;</span></div>';
	newhtml += '<div class="star"; onclick= "redisplayStars(4)"><span style="font-size:150%;color:#c5c1c1;">&star;</span></div>';
	newhtml += '<div class="star"; onclick= "redisplayStars(5)"><span style="font-size:150%;color:#c5c1c1;">&star;</span></div><hr>';

	document.getElementById("newcomments").innerHTML = newhtml;
}

function redisplayStars(count) {

	newstar = [];
	newstar[0] = count;
	stars = stars.concat(newstar);

	newhtml = "";
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

    timestamp = timestamp.concat(newtime);
}

function recordComment() {
	var commentText = [];
	commentText[0] = document.getElementById("comment").value;

	comments = comments.concat(commentText);

	getTimeStamp();
	document.getElementById("newcomments").innerHTML = "";
	html = '<hr>';
	sendcomments();
	postComments();
}

function displayCommentBox() {
	document.getElementById("newcomments").innerHTML += '<textarea rows="4" cols="50" id="comment" form="usrform" placeholder="Comments..."></textarea><hr>';

	document.getElementById("newcomments").innerHTML += '<div class="form-actions padded"><button type="submit" onclick="recordComment()" class="btn btn-form btn-secondary">submit</button></div>';	
}

function recordGrade(grade) {
	var newgrade = grade;

	document.getElementById("newcomments").innerHTML = newstars + "<br>" 
		+ "Grade: " + grade + "<br>";

	displayCommentBox();
}

function displayGrade() {
	 document.getElementById("newcomments").innerHTML += '<select class="form-control padded" onchange="recordGrade(value)"><option>grade</option><option value="A+">A+</option><option value="A">A</option><option value="A-">A-</option><option value="B+">B+</option><option value="B">B</option><option value="B-">B-</option><option value="C+">C+</option><option value="C">C</option><option value="C-">C-</option><option value="D+">D+</option><option value="D">D</option><option value="D-">D-</option><option value="F">F</option></select><hr>';
}

function getComments() {
	displayStars(); 
}
