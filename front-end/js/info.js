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

function drawGraph(class) {
        var margin = {top: 40, right: 20, bottom: 30, left: 40},
            width = 420 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
          })

        var svg = d3.select("#placeholder").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);



        var dict = {};
        dict["A+"] = 0;
        dict["A"] = 0;
        dict["A-"] = 0;
        dict["B+"] = 0;
        dict["B"] = 0;
        dict["B-"] = 0;
        dict["C+"] = 0;
        dict["C"] = 0;
        dict["C-"] = 0;
        dict["D+"] = 0;
        dict["D"] = 0;
        dict["D-"] = 0;
        dict["F"] = 0;

        var sum = 0.0

        var request = new XMLHttpRequest;
        var uri = 'https://classiapp.herokuapp.com/getclasses'
        request.open("GET",uri, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var testGrades = JSON.parse(request.responseText);
                for (var i = 0; i < testGrades.length; i++) {
                    if (testGrades[i]._id == classthing) {
                        for (var j = 0; j < testGrades[i].Grades.length; j++) {
                            dict[testGrades[i].Grades[j]] += 1;
                            sum += 1.0
                        }
                    }
                }
                var count_JSON = []

                console.log('test', dict);

                for (key in dict) {
                    count_JSON.push({"letter": key, "frequency": dict[key] / sum})
                }


                console.log('test', count_JSON)

                x.domain(["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"]);
                y.domain([0, .3]);
                // d3.max(data, function(d) { return d.frequency; })

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                  .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("% of students");

                svg.selectAll(".bar")
                    .data(count_JSON)
                  .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.letter); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.frequency); })
                    .attr("height", function(d) { return height - y(d.frequency); })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
            };
        }
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
    var uri = 'https://classiapp.herokuapp.com/getclasses'
    request.open("GET",uri, true);
    request.onreadystatechange = function() {
        var curr_class = "";
        if (request.readyState == 4 && request.status == 200) {
            var classes = JSON.parse(request.responseText)
            //console.log(initialArray);
            console.log(distribution + " " + department + " " + keyword + " " + instructor)
            for (var x =0; x < classes.length; x++){
                if ((distribution == "--" || classes[x].Distribution == distribution) &&
                    (department == "--" || classes[x].Department == department) &&
                    (keyword == "" || classes[x].Name == keyword) &&
                    (instructor == "" || classes[x].Professors == instructor)) {
                    var curr_class = classes[x]._id;
                    displayShit(curr_class);
                    drawGraph(curr_class);
                    request.send(null);
                    break;
                }
            }
        }
    }
    request.send(null); 
    return false;
}