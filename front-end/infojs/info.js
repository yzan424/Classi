var html = "";
stars = [1, 5, 3, 4];

function displayStars(rating) {


    for(j=0; j <rating; j++) {
        html += '<span style="font-size:100%;color:#fdeb72;">&starf;</span>';
    }

    for(j=rating; j<5; j++) {
        html += '<span style="font-size:100%;color:#c5c1c1;">&star;</span>';
    }

    document.getElementById("avgRating").innerHTML = html;
}