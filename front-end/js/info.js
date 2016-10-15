var courses = [];

function displayCourseInfo(id) {
    console.log(courses);
    var myCourse;
    for(c in courses) {
        if(courses[c]._id == id) {
            myCourse = courses[c];
        }
    }

    $("#courseID").html(myCourse.Code);
    $("#courseName").html(myCourse.Name);
    $("#distReqs").html(myCourse.Distribution);
    displayStars(myCourse.Stars);
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

$(function(){
    var url = "https://classiapp.herokuapp.com/getclasses"

    request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status == 200) {
                    raw = request.responseText;
                    courses = JSON.parse(raw);

                    displayCourseInfo("5801f6f3dc9106000390336d");
            }
    }
    request.send(null);
})