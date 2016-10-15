function graph_math(currid){
    console.log(currid)
        var margin = {top: 40, right: 20, bottom: 30, left: 40},
            width = 360 - margin.left - margin.right,
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
            return "<strong>" + Math.round(d.frequency * 10000) / 100 + "%</strong> of students received " + d.letter + "'s";
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
                    if (testGrades[i]._id == currid) {
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
        request.send(null);
        return false;
}
