var comments = [];
var html = "<hr>";
comments = ["hi", "yo", "classi", "test"];
stars = [1, 5, 3, 4];

function postComments() {

	for (i=0; i < comments.length; i++) {

		for(j=0; j <stars[i]; j++) {
			html += '<span style="font-size:100%;color:#fdeb72;">&starf;</span>';
		}

		for(j=stars[i]; j<5; j++) {
			html += '<span style="font-size:100%;color:#c5c1c1;">&star;</span>';
		}
		
		html+= "<br>";
		html += comments[i] + "<hr>";
	}
	document.getElementById("comments").innerHTML = html;
}
//fdeb72