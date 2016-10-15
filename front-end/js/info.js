var courses = [];

function displayCourseInfo(id) {
    console.log(courses);
    var myCourse;
    for(c in courses) {
        if(courses[c]._id == id) {
            myCourse = courses[c];
        }
    }
    if(myCourse.Code == null)
        $("#courseID").html("N/A");
    else
        $("#courseID").html(myCourse.Code);
    $("#courseName").html(myCourse.Name);
    $("#distReqs").html(myCourse.Distribution);
    if(myCourse.Average_Star == null) 
            displayStars(0);
    else
        displayStars(myCourse.Average_Star);
    $("#professor").html(myCourse.Professors);
    if(myCourse.Textbooks == null)
        $("#textbook").html("No textbook");
    else
        $("#textbook").html(myCourse.Textbooks);

}

function displayStars(rating) {
    var html = "";
    for(j=0; j <rating; j++) {
        html += '<span style="font-size:100%;color:#fdeb72;">&starf;</span>';
    }

    for(j=rating; j<5; j++) {
        html += '<span style="font-size:100%;color:#c5c1c1;">&star;</span>';
    }

    $("#Stars").html(html);

}

function displayShit(id){
    var url = "https://classiapp.herokuapp.com/getclasses"

    request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status == 200) {
                    raw = request.responseText;
                    courses = JSON.parse(raw);

                    displayCourseInfo(id);
            }
    }
    request.send(null);
}

var client;
var filteredData = [];
var endDate;
var firstDate;
var changeInForm;
var count = 0;

var request = new XMLHttpRequest();

function retrieveData(){
    distribution = $("#distribution").val();
    department = $("#department").val();
    keyword = $("#keyword").val();
    instructor = $("#instructor").val();
    //console.log(distribution)
    var uri = 'https://classiapp.herokuapp.com/getclasses';
    request.onreadystatechange = function() {
        var curr_class = "";
        if (request.readyState == 4 && request.status == 200) {
            var classes = JSON.parse(request.responseText)
            //console.log(initialArray);
            console.log(distribution + " " + department + " " + keyword + " " + instructor)
            for (var x =0; x < classes.length; x++){
                console.log("in while")
                if ((distribution == "--" || classes[x].Distribution == distribution) &&
                    (department == "--" || classes[x].Department == department) &&
                    (keyword == "" || classes[x].Name == keyword) &&
                    (instructor == "" || classes[x].Professors == instructor)) {
                    var curr_class = classes[x]._id;
                    console.log(classes)
                    init(classes, classes[x].Code);
                    displayShit(curr_class);
                    break;
                }
            }
        }
    }
    request.open("GET",uri, true);
    request.send(null); 

    return false;
}