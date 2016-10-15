var client;
var filteredData = [];
var endDate;
var firstDate;
var changeInForm;
var count = 0;

function retrieveData(){ 
    var finalMenus = [];
    $('message').html(''); 
	client = $("#autocompleteClient").val();
    vendor = $("#autocompleteVendor").val();
     $("#menuForm :input").change(function() {
        changeInForm = $(this).attr('id')
    });
    if (count == 0){
        timeFrame  = $('#timeFrame').val(); 
        oneDate = $('#oneDate').val();
        firstDate = $("#firstDate").val();
        endDate = $("#secondDate").val(); 
        if (timeFrame != '--') changeInForm = 'timeFrame'
        else if (firstDate != '' || endDate != '') changeInForm = 'firstDate'
        else if (oneDate != '')changeInForm = 'oneDate'
    }
    count ++;
    switch(changeInForm){
        case 'timeFrame':
            timeFrame  = $('#timeFrame').val();
            endDate = new Date();
            firstDate = new Date();
            switch(timeFrame){
                case 'in the last month':
                    firstDate.setFullYear(endDate.getFullYear(), endDate.getMonth()-1);
                    break;
                case 'in the last 3 months':
                    firstDate.setFullYear(endDate.getFullYear(), endDate.getMonth()-3);
                    break;
                case 'in the last 6 months':
                    firstDate.setFullYear(endDate.getFullYear(), endDate.getMonth()-6);
                    break;
                case 'in the last year':
                    firstDate.setFullYear(endDate.getFullYear()-1, endDate.getMonth());
                    break;
            }
            break;
        case 'firstDate':
        case 'secondDate':
            firstDate = $("#firstDate").val();
            endDate = $("#secondDate").val(); 
            firstDate = new Date(firstDate);
            endDate = new Date(endDate);
            firstDate.setDate(firstDate.getDate() + 1);
            endDate.setDate(endDate.getDate() + 1);
            break;
        case 'oneDate':
            oneDate = $('#oneDate').val();
            firstDate = new Date(oneDate);
            endDate = new Date(oneDate);
            firstDate.setDate(firstDate.getDate() + 1);
            endDate.setDate(endDate.getDate() + 1);      
            break;
    }
    if (changeInForm == null){
        $('message').html('You need to select a time period.'); 
        return false;
    }  
    $("#menuForm").closest('form').find("input[type=date]").val(""); 
    $("#menuForm").closest('form').find("select").val("--");    
    firstDate.setHours(0)
    firstDate.setMinutes(0)
    endDate.setHours(0);
    endDate.setMinutes(0);

    
    if (allMenus == '') {
        document.getElementById("message").innerHTML = 'The database is empty.';
    }
    /*
    console.log(allMenus)
    filteredData = allMenus.filter(filterByClientAndDate); 
    console.log(filteredData)
    finalMenus = organize(filteredData);
    outputMenus(finalMenus);
    */
    //console.log(favoritesArray)
    //console.log(allMenus);
    if (vendor != '') {
        console.log('there is a vendor')
        filteredData = allMenus.filter(filterByClientAndDateAndVendor); 
    }else{
         console.log('there is no vendor')
        filteredData = allMenus.filter(filterByClientAndDate); 
    }
    finalMenus = organize(filteredData);
    outputMenus(finalMenus);


    
   

   
    
    /*
	$.getJSON('past_menus.json', function(menu_history){
        //console.log(menu_history);
        if (vendor != '') {
            filteredData = menu_history.filter(filterByClientAndDateAndVendor); 
        }else{
            filteredData = menu_history.filter(filterByClientAndDate); 
        }
        allMenus = organize(filteredData);
        outputMenus(allMenus);
    });
    */
    
    return false;
}


function filterByClientAndDate(obj){
    if ('Date' in obj && firstDate != "Invalid Date" && endDate != "Invalid Date"){
        var currDate = new Date (obj.Date)
        var tempEndDate = new Date(endDate.getTime());   // clone the date to not muck the original value
        //lets check into the adding a day and doing a half open interval? maybes?
        var inDateRange = currDate >= firstDate && currDate <= tempEndDate; // use a half-open interval
        if ('Client/Organization' in obj && obj['Client/Organization'] == client && inDateRange && (obj[""] == 'Food' || obj[""] == 'Beverage') && obj.Name != "") {
            return true;
        }else {
            return false;
        }
    } 
}
function filterByClientAndDateAndVendor(obj){
    if ('Date' in obj && firstDate != "Invalid Date" && endDate != "Invalid Date"){
        var currDate = new Date (obj.Date)
        var tempEndDate = new Date(endDate.getTime());   // clone the date to not muck the original value
        //lets check into the adding a day and doing a half open interval? maybes?
        var inDateRange = currDate >= firstDate && currDate <= tempEndDate; // use a half-open interval
         //special case with Flame
        if (vendor == 'Flame ' || vendor == 'Flame Cafe') {
            if ('Client/Organization' in obj && obj['Client/Organization'] == client && inDateRange && (obj[""] == 'Food' || obj[""] == 'Beverage') && obj.Name != "" && 'Daily Menu Description' in obj && (obj['Daily Menu Description'] == 'Flame' || obj['Daily Menu Description'] == 'Flame Cafe' )) {
                return true;
             } else return false;
        }
        if ('Client/Organization' in obj && obj['Client/Organization'] == client && inDateRange && (obj[""] == 'Food' || obj[""] == 'Beverage') && obj.Name != "" && 'Daily Menu Description' in obj && obj['Daily Menu Description'] == vendor) {
            return true;
        }else return false;
    } 
}
function organize(filteredData){
    var start = 0;
    var allMenus = [];
    var sortedByDateArray = {};
    var finalMenus = {};
    var currDate;
    var tempArray = {};
    var currentMenu;
    for (var x = 0; x < filteredData.length; x++){
        if (x + 1 < filteredData.length){
             if (filteredData[x]['Date'] != filteredData[x+1]['Date']){
                currentMenu = filteredData.slice(start, x+1);
                //console.log(currentMenu)
                allMenus.push(currentMenu);
                start = x + 1;
            }if(x + 1 == filteredData.length - 1){
                currentMenu = filteredData.slice(start, x + 2);
                allMenus.push(currentMenu);
                start = x + 1;
            }
        }   
    }

    for (x in allMenus){
        currDate = allMenus[x][0].Date
        if (!(currDate in sortedByDateArray)){
            tempArray = allMenus[x];
            tempArray.sort(sort);
            sortedByDateArray[currDate] = tempArray;
        }else{
            tempArray = sortedByDateArray [currDate] 
            tempArray = tempArray.concat(allMenus[x]);
            tempArray.sort(sort);
            sortedByDateArray[currDate] = tempArray;
        }
    }
    /*
    //this if statement removes all duplicates for Moderna.
    if(sortedByDateArray[Object.keys(sortedByDateArray)[0]][0]['Client/Organization'] == 'Moderna Therapeutics'){
        for (x in sortedByDateArray){
            //console.log(sortedByDateArray[x])
            var uniqueItems = [];
            $.each(sortedByDateArray[x],function(i,el){
                console.log(el['Name']);
                if($.inArray(el['Name'],uniqueItems) === -1) {
                    uniqueItems.push(el);
                }else{
                    console.log('POOOOOOp')
                }
             });
           sortedByDateArray[x] = uniqueItems;
        }
    }
    */
    return sortedByDateArray;

}

function sort(a,b) {
    return a['Daily Menu Description'] < b['Daily Menu Description'] ? -1 : a['Daily Menu Description'] > b['Daily Menu Description'] ? 1 : 0;
 


 /*
  if (a['Daily Menu Description'] < b['Daily Menu Description'] ) return -1;
  if (a['Daily Menu Description'] > b['Daily Menu Description'] ) return 1;
  else if (a['Daily Menu Description'] == b['Daily Menu Description']){

    return 0;
  }else return 0;
  */

  //return a['Name'] < b ['Name'] ? -1 : a['Name'] > b ['Name'] ? 1 : 0
  
/*

   var val = a['Name'] < b ['Name'] ? -1 : a['Name'] > b ['Name'] ? 1 : 0
  switch (val){
        case 1:
        case -1:
            return a['Daily Menu Description'] < b['Daily Menu Description'] ? -1 : a['Daily Menu Description'] > b['Daily Menu Description'] ? 1 : 0;
            break;
        case 0:
           console.log('there is a duplicate');
            //b['Name'] = b['Name'] + ' --> this is a duplicate';
            a['Name'] = a['Name'] + ' --> this is a duplicate';
            return a['Daily Menu Description'] < b['Daily Menu Description'] ? -1 : a['Daily Menu Description'] > b['Daily Menu Description'] ? 1 : 0;
            break;
    }
    */
}

function outputMenus(finalMenus){
    var request = new XMLHttpRequest;
    var output = "";
    var dateArray = [];
    for (var key in finalMenus){
        dateArray.push(key)
    }
    dateArray.sort(function (date1, date2){return new Date (date1) - new Date (date2)});

    for ( key in dateArray){
        var code = String(dateArray[key]) + finalMenus[dateArray[key]][0]['Client/Organization'];
        var hashCode = String(code.hashCode());
        var currComment = commentArray[hashCode];
        var currFavorite = favoritesArray[hashCode];


        //if there is a comment and there is a star
        if (currComment != undefined && currComment != '' && currFavorite != undefined && currFavorite != 'false'){
            output += "<div class = fullMenu><h3 id = 'dates'>"+ dateArray[key] +"<input type='image' src='/img/speech-bubble.png' id = \'" + key +"\'class ='padded commentButton'/><input type='image' src='/img/full-star.png' id = \'" + key +"\'class ='padded fullStarButton'/></h3><h4>" + finalMenus[dateArray[key]][0]['Daily Menu Description'] + "</h4><ul>";
        
        //if there is a comment and there is no star
        }else if (currComment != undefined && currComment != '' && (currFavorite == undefined || currFavorite == 'false')){
            output += "<div class = fullMenu><h3 id = 'dates'>"+ dateArray[key] +"<input type='image' src='/img/speech-bubble.png' id = \'" + key +"\'class ='padded commentButton'/><input type='image' src='/img/empty-star.png' id = \'" + key +"\'class ='padded emptyStarButton'/></h3><h4>" + finalMenus[dateArray[key]][0]['Daily Menu Description'] + "</h4><ul>";
        
        //if there is no comment but there is a star
        }else if ((currComment == undefined || currComment != '') && currFavorite != undefined && currFavorite != 'false'){
            output += "<div class = fullMenu><h3 id = 'dates'>"+ dateArray[key] +"<input type='image' src='/img/add.png' id = \'" + key +"\'class ='padded addButton'/><input type='image' src='/img/full-star.png' id = \'" + key +"\'class ='padded fullStarButton'/></h3><h4>" + finalMenus[dateArray[key]][0]['Daily Menu Description'] + "</h4><ul>";
        
        //if there is no comment and there is no star
        }else if((currComment == undefined || currComment != '') && (currFavorite == undefined || currFavorite == 'false')){
            output += "<div class = fullMenu><h3 id = 'dates'>"+ dateArray[key] +"<input type='image' src='/img/add.png' id = \'" + key +"\'class ='padded addButton'/><input type='image' src='/img/empty-star.png' id = \'" + key +"\'class ='padded emptyStarButton'/></h3><h4>" + finalMenus[dateArray[key]][0]['Daily Menu Description'] + "</h4><ul>";
        }else{
            console.log('there was a problem.')
        }

        for (y in finalMenus[dateArray[key]]){
            if (y != 0 && finalMenus[dateArray[key]][y]["Daily Menu Description"] != finalMenus[dateArray[key]][y - 1]["Daily Menu Description"]){
                    output += "</ul><h4>" + finalMenus[dateArray[key]][y]['Daily Menu Description'] + "</h4><ul >";
            }
            output += "<li>" + finalMenus[dateArray[key]][y].Name + ' : <span class = "quantity" >' + finalMenus[dateArray[key]][y].Qty + "</span></li>"
            
        }
        output += "</ul></div>";
        document.getElementById("menus").innerHTML= output;
    } 


    $('.commentButton').click(function(){
        console.log('in comment button')
        var date = String(dateArray[this.id]);
        //console.log('this is the date:',date);
        var client = finalMenus[dateArray[this.id]][0]['Client/Organization'];
        //console.log('this is the client:',client);
        var date = date + client;
        //console.log('this is after concat:',date);
        var hashCode = String(date.hashCode());
        //console.log('this is the hashCode after concat', hashCode)
        var currentComment = commentArray[hashCode];
        vex.dialog.open({
          message: "Menu Comments",
          input: "<style>.vex-custom-field-wrapper {margin: 1em 0;}.vex-custom-field-wrapper > label {display: inline-block;margin-bottom: .2em;}</style><div class='vex-custom-field-wrapper'><div class='vex-custom-input-wrapper'><textarea name = 'input' rows = '10'>"+ currentComment +"</textarea></div></div>",
          buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Done'
            })
          ],
          callback: function(data) {
            if (data === false) {
              return console.log('Cancelled');
              //make sure data.input doesnt == null, if it does, delete it from database.
            }if (data.input != currentComment){
                var commentInfo = 'comment=' + data.input +'&code=' + hashCode;
                console.log('sending the goodies');
                request.open("POST", "https://alchemista.herokuapp.com/newComments", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(commentInfo); 
                request.onreadystatechange = function(){console.log('readystate',request.readyState);console.log('status',request.status)};
                //return $('.demo-result-custom-vex-dialog').show().html("<h4>Result</h4>\n<p>\n    Date: <b>" + data.date + "</b><br/>\n    Color: <input type=\"color\" value=\"" + data.color + "\" readonly />\n</p>");
            } 
          }
        });
    });
    $('.addButton').click(function(){
        var date = String(dateArray[this.id]);
        //console.log('this is the date:',date);
        var client = finalMenus[dateArray[this.id]][0]['Client/Organization'];
        //console.log('this is the client:',client);
        var date = date + client;
        //console.log('this is after concat:',date);
        var hashCode = String(date.hashCode());
        //console.log('this is the hashCode after concat', hashCode)
        //$('.addButton').data('button',this)
        vex.dialog.open({
          message: "Menu Comments",
          input: "<style>.vex-custom-field-wrapper {margin: 1em 0;}.vex-custom-field-wrapper > label {display: inline-block;margin-bottom: .2em;}</style><div class='vex-custom-field-wrapper'><div class='vex-custom-input-wrapper'><textarea name = 'input' rows = '10'>"+ '' +"</textarea></div></div>",
          buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Done'
            })
          ],
          callback: function(data) {
            if (data === false) {
              return console.log('Cancelled');
            }
            if (data.input != ''){
                /*
                var button = $('.addButton').data('button')
                button.src = '/img/speech-bubble.png'
                button.class = 'padded newButton'
                */
                var commentInfo = 'comment=' + data.input+'&code=' + hashCode;
                console.log('sending the goodies');
                request.open("POST", "https://alchemista.herokuapp.com/newComments", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(commentInfo); 
                /*
                request.onreadystatechange = function(){
                    if (request.readyState == 4 && request.status == 200) {
                        initialArray = JSON.parse(request.responseText)
                        for (var x =0; x < initialArray.length; x++){
                            commentArray[initialArray[x].code] = initialArray[x].comment;
                        }
                        console.log(commentArray);
                    }
                  
                };
                  */
            //return $('.demo-result-custom-vex-dialog').show().html("<h4>Result</h4>\n<p>\n    Date: <b>" + data.date + "</b><br/>\n    Color: <input type=\"color\" value=\"" + data.color + "\" readonly />\n</p>");
            }
          }
        });
    }); 


    $('.emptyStarButton').click(function(){
        console.log('adding the fav')
        this.src = '/img/full-star.png'
        //this.class = 'padded fullStarButton';
      
        $(this).addClass('fullStarButton').removeClass('emptyStarButton');
        console.log(this)
        var date = String(dateArray[this.id]);
        //console.log('this is the date:',date);
        var client = finalMenus[dateArray[this.id]][0]['Client/Organization'];
        //console.log('this is the client:',client);
        var date = date + client;
        //console.log('this is after concat:',date);
        var hashCode = String(date.hashCode());
        //console.log('this is the hashCode after concat', hashCode)
        favoritesArray[hashCode] = 'true';
        var favoriteInfo = 'favorite=true&code=' + hashCode;
        request.open("POST", "https://alchemista.herokuapp.com/newFavorite", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(favoriteInfo); 
        //request.onreadystatechange = function(){console.log('readystate',request.readyState);console.log('status',request.status)};
    });
    $('.fullStarButton').click(function(){
        console.log('deleting the fav')
        this.src = '/img/empty-star.png'
        //this.class = 'padded emptyStarButton';
        $(this).addClass('emptyStarButton').removeClass('fullClassButton');
        console.log(this)
        var date = String(dateArray[this.id]);
        //console.log('this is the date:',date);
        var client = finalMenus[dateArray[this.id]][0]['Client/Organization'];
        //console.log('this is the client:',client);
        var date = date + client;
        //console.log('this is after concat:',date);
        var hashCode = String(date.hashCode());
        favoritesArray[hashCode] = 'false';
        //console.log('this is the hashCode after concat', hashCode)
        //$('.addButton').data('button',this)
        var commentInfo = 'favorite=false&code=' + hashCode;
        request.open("POST", "https://alchemista.herokuapp.com/newFavorite", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(commentInfo); 
        //request.onreadystatechange = function(){console.log('readystate',request.readyState);console.log('status',request.status)};
    });
/*
    $("ul").shorten({
        moreText:'<h4>more?</h4>',
        showChars: 50
    });
    */
    /*
    $('ul').collapseList({
        'collapseNum' : 5,
        'moreLinkText' : 'SHOW MORE',
        'lessLinkText' : 'SHOW LESS'
    });
    */



    /*  for (var key in keyArray){
        output += "<div class = fullMenu><input type='checkbox' class='read-more-state' id='post-2' /><h3 id = 'dates'>"+ keyArray[key] +"</h3><h4>" + finalMenus[keyArray[key]][0]['Daily Menu Description'] + "</h4><ul class = 'read-more-wrap'>";
        for (y in finalMenus[keyArray[key]]){
            if (y != 0 && finalMenus[keyArray[key]][y]["Daily Menu Description"] != finalMenus[keyArray[key]][y - 1]["Daily Menu Description"]){
                    output += "</ul><h4>" + finalMenus[keyArray[key]][y]['Daily Menu Description'] + "</h4><ul class = 'read-more-wrap'>";
            }
            if (y <= 3){
                output += "<li>" + finalMenus[keyArray[key]][y].Name + ' - ' + finalMenus[keyArray[key]][y].Qty + "</li>"
            }else{
                output += "<li class='read-more-target'>" + finalMenus[keyArray[key]][y].Name + ' - ' + finalMenus[keyArray[key]][y].Qty + "</li>"
            }
        }
        output += "</ul><label for='post-2' class='read-more-trigger'></label></div>"
        
    }
    */   
}

/*
var inputElement = document.createElement('input');
inputElement.type = "input"
inputElement.addEventListener('click', function(){
    console.log('asdas')
});
document.body.appendChild(inputElement);​

*/

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/*

function outputMenus(finalMenus){
    var request = new XMLHttpRequest;
    var output = "";
    var dateArray = [];
    for (var key in finalMenus){
        dateArray.push(key)
    }
    dateArray.sort(function (date1, date2){return new Date (date1) - new Date (date2)});

    for ( key in dateArray){
        var code = String(dateArray[key]) + finalMenus[dateArray[key]][0]['Client/Organization'];
        var hashCode = String(code.hashCode());
        if (commentArray[hashCode] != undefined && commentArray[hashCode] != ''){
            output += "<div class = fullMenu><h3 id = 'dates'>"+ dateArray[key] +"<input type='image' src='/img/speech-bubble.png' id = \'" + key +"\'class ='padded commentButton'/></h3><h4>" + finalMenus[dateArray[key]][0]['Daily Menu Description'] + "</h4><ul>";
        }else{
            output += "<div class = fullMenu><h3 id = 'dates'>"+ dateArray[key] +"<input type='image' src='/img/add.png' id = \'" + key +"\'class ='padded addButton'/></h3><h4>" + finalMenus[dateArray[key]][0]['Daily Menu Description'] + "</h4><ul>";
        }
        for (y in finalMenus[dateArray[key]]){
            if (y != 0 && finalMenus[dateArray[key]][y]["Daily Menu Description"] != finalMenus[dateArray[key]][y - 1]["Daily Menu Description"]){
                    output += "</ul><h4>" + finalMenus[dateArray[key]][y]['Daily Menu Description'] + "</h4><ul >";
            }
        
            output += "<li>" + finalMenus[dateArray[key]][y].Name + ' : <span class = "quantity" >' + finalMenus[dateArray[key]][y].Qty + "</span></li>"
            
        }
        output += "</ul></div>"
    
        document.getElementById("menus").innerHTML= output;
    } 
    $('.commentButton').click(function(){
        console.log('in comment button')
        var date = String(dateArray[this.id]);
        //console.log('this is the date:',date);
        var client = finalMenus[dateArray[this.id]][0]['Client/Organization'];
        //console.log('this is the client:',client);
        var date = date + client;
        //console.log('this is after concat:',date);
        var hashCode = String(date.hashCode());
        //console.log('this is the hashCode after concat', hashCode)
        var currentComment = commentArray[hashCode];
        vex.dialog.open({
          message: "Menu Comments",
          input: "<style>.vex-custom-field-wrapper {margin: 1em 0;}.vex-custom-field-wrapper > label {display: inline-block;margin-bottom: .2em;}</style><div class='vex-custom-field-wrapper'><div class='vex-custom-input-wrapper'><textarea name = 'input' rows = '10'>"+ currentComment +"</textarea></div></div>",
          buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Done'
            })
          ],
          callback: function(data) {
            if (data === false) {
              return console.log('Cancelled');
            }if (data.input != currentComment){
                var commentInfo = 'comment=' + data.input +'&code=' + hashCode;
                console.log('sending the goodies');
                request.open("POST", "https://stormy-ocean-48223.herokuapp.com/newComments", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(commentInfo); 
                request.onreadystatechange = function(){console.log('readystate',request.readyState);console.log('status',request.status)};
                //return $('.demo-result-custom-vex-dialog').show().html("<h4>Result</h4>\n<p>\n    Date: <b>" + data.date + "</b><br/>\n    Color: <input type=\"color\" value=\"" + data.color + "\" readonly />\n</p>");
            }
          }
        });
    });
    $('.addButton').click(function(){
        var date = String(dateArray[this.id]);
        //console.log('this is the date:',date);
        var client = finalMenus[dateArray[this.id]][0]['Client/Organization'];
        //console.log('this is the client:',client);
        var date = date + client;
        //console.log('this is after concat:',date);
        var hashCode = String(date.hashCode());
        //console.log('this is the hashCode after concat', hashCode)
        //$('.addButton').data('button',this)
        vex.dialog.open({
          message: "Menu Comments",
          input: "<style>.vex-custom-field-wrapper {margin: 1em 0;}.vex-custom-field-wrapper > label {display: inline-block;margin-bottom: .2em;}</style><div class='vex-custom-field-wrapper'><div class='vex-custom-input-wrapper'><textarea name = 'input' rows = '10'>"+ '' +"</textarea></div></div>",
          buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Done'
            })
          ],
          callback: function(data) {
            if (data === false) {
              return console.log('Cancelled');
            }
            if (data.input != ''){
                
                var button = $('.addButton').data('button')
                button.src = '/img/speech-bubble.png'
                button.class = 'padded newButton'
                
                var commentInfo = 'comment=' + data.input+'&code=' + hashCode;
                console.log('sending the goodies');
                request.open("POST", "https://stormy-ocean-48223.herokuapp.com/newComments", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(commentInfo); 
                
                request.onreadystatechange = function(){
                    if (request.readyState == 4 && request.status == 200) {
                        initialArray = JSON.parse(request.responseText)
                        for (var x =0; x < initialArray.length; x++){
                            commentArray[initialArray[x].code] = initialArray[x].comment;
                        }
                        console.log(commentArray);
                    }
                  
                };
                  
            //return $('.demo-result-custom-vex-dialog').show().html("<h4>Result</h4>\n<p>\n    Date: <b>" + data.date + "</b><br/>\n    Color: <input type=\"color\" value=\"" + data.color + "\" readonly />\n</p>");
            }
          }
        });
    }); 
/*
    $("ul").shorten({
        moreText:'<h4>more?</h4>',
        showChars: 50
    });
    */
    /*
    $('ul').collapseList({
        'collapseNum' : 5,
        'moreLinkText' : 'SHOW MORE',
        'lessLinkText' : 'SHOW LESS'
    });
    */



    /*  for (var key in keyArray){
        output += "<div class = fullMenu><input type='checkbox' class='read-more-state' id='post-2' /><h3 id = 'dates'>"+ keyArray[key] +"</h3><h4>" + finalMenus[keyArray[key]][0]['Daily Menu Description'] + "</h4><ul class = 'read-more-wrap'>";
        for (y in finalMenus[keyArray[key]]){
            if (y != 0 && finalMenus[keyArray[key]][y]["Daily Menu Description"] != finalMenus[keyArray[key]][y - 1]["Daily Menu Description"]){
                    output += "</ul><h4>" + finalMenus[keyArray[key]][y]['Daily Menu Description'] + "</h4><ul class = 'read-more-wrap'>";
            }
            if (y <= 3){
                output += "<li>" + finalMenus[keyArray[key]][y].Name + ' - ' + finalMenus[keyArray[key]][y].Qty + "</li>"
            }else{
                output += "<li class='read-more-target'>" + finalMenus[keyArray[key]][y].Name + ' - ' + finalMenus[keyArray[key]][y].Qty + "</li>"
            }
        }
        output += "</ul><label for='post-2' class='read-more-trigger'></label></div>"
        
    }
    
}

*/




