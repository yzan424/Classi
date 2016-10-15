var oFileIn;
var oFile = null;
var isXLSX;
request = new XMLHttpRequest;
var commentArray = [];
var favoritesArray = [];
var allMenus;
$(function(){
/*    //autocomplete([], false)
    var uri = 'https://alchemista.herokuapp.com/getMenus'
    request.open("GET",uri, true);
    vex.open({
        //<style>.vex-custom-field-wrapper {margin: 50px 50px;}.vex-custom-field-wrapper > label {display: inline-block;margin-bottom: 10em;}</style>
      content:"  <h5>Loading...<h5><br><div class='loader'>",
      escapeButtonCloses: false,
      overlayClosesOnClick: false,
      showCloseButton: false

    });*/
    /*
    vex.dialog.open({
          input: "<style>.vex-custom-field-wrapper {margin: 1em 0;}.vex-custom-field-wrapper > label {display: inline-block;margin-bottom: .2em;}</style><div class='vex-custom-field-wrapper'><div class='vex-custom-input-wrapper'><div class='loader'></div></div></div>",
    });
    */
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            allMenus = JSON.parse(request.responseText);
            var value = String(Object.keys(allMenus).length);
            var clients = [];
            var vendors = [];
            //this creates an array of clients for the autocomplete.
            for (x in allMenus){
                if (clients.indexOf(allMenus[x]['Client/Organization']) == -1 && typeof allMenus[x]['Client/Organization'] === 'string'){
                    clients.push(allMenus[x]['Client/Organization']);
                }
                if (vendors.indexOf(allMenus[x]['Daily Menu Description']) == -1 && typeof allMenus[x]['Daily Menu Description'] === 'string'  ){
                    vendors.push(allMenus[x]['Daily Menu Description']);
                }
            }
            //console.log(clients);
            //console.log(vendors);
            $('#autocompleteClient').autocomplete({lookup: clients});
            $('#autocompleteVendor').autocomplete({lookup: vendors});
            console.log('allMenus',allMenus)
            loadMenus2();
            uri = 'https://alchemista.herokuapp.com/getComments'
            request.open("GET",uri, true);
            request.onreadystatechange = function() {
                if (request.readyState == 4 && request.status == 200) {
                    initialArray = JSON.parse(request.responseText)
                    //console.log(initialArray);
                    for (var x =0; x < initialArray.length; x++){
                        commentArray[initialArray[x].code] = initialArray[x].comment;
                    }
                    uri = 'https://alchemista.herokuapp.com/getFavorites'
                    request.open("GET",uri, true);
                    request.onreadystatechange = function() {
                        if (request.readyState == 4 && request.status == 200) {
                            initialArray = JSON.parse(request.responseText)
                            for (var x =0; x < initialArray.length; x++){
                                favoritesArray[initialArray[x].code] = initialArray[x].favorite;
                            }
                            
                        }
                    }
                    request.send(null);  
                }
            }
            request.send(null);  
            vex.close();
        };
        
    }
    request.send(null);
    
    /*
    var uri = 'https://stormy-ocean-48223.herokuapp.com/getMenuCount'
    request.open("GET",uri, true);
    console.log('here')
    request.onreadystatechange = function() {
        console.log('im inside the onreadystatechange')
        if (request.readyState == 4 && request.status == 200) {
            var currentCount = request.responseText;
            var storedCount = localStorage.getItem('count');
            if(currentCount != storedCount){
                 loadMenus();
            }
           // currentCount == storedCount ? autocomplete([], false);            
        }
    }

    request.send(null);
    */

    

});


function loadMenus(){
    var request = new XMLHttpRequest;
    var uri = 'https://alchemista.herokuapp.com/getMenus'
    request.open("GET",uri, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            allMenus = JSON.parse(request.responseText);
            var value = String(Object.keys(allMenus).length);
            var clients = [];
             var vendors = [];
            //this creates an array of clients for the autocomplete.
            for (x in allMenus){
                if (clients.indexOf(allMenus[x]['Client/Organization']) == -1){
                    clients.push(allMenus[x]['Client/Organization']);
                }
                if (vendors.indexOf(allMenus[x]['Daily Menu Description']) == -1){
                    vendors.push(allMenus[x]['Daily Menu Description']);
                }
            }
            $('#autocompleteClient').autocomplete({lookup: clients});
            $('#autocompleteVendor').autocomplete({lookup: vendors});
        };
    }
    request.send(null);
}
function loadMenus2(){
    var request = new XMLHttpRequest;
    var uri = 'https://alchemista.herokuapp.com/getMenus'
    request.open("GET",uri, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var testMenus = JSON.parse(request.responseText);
            console.log('testMenus',testMenus);
        };
    }
    request.send(null);
}

/*
function loadComments(){
    console.log('in loadComments()')
    var uri = 'https://stormy-ocean-48223.herokuapp.com/getComments'
    request.open("GET",uri, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            console.log(JSON.parse(request.responseText));
        }else{
            console.log('there was a problem.')
        }
    }
    request.send(null);  
}
*/

/*
function autocomplete(clients, isNew){
    if (isNew){
        console.log('from LoadMenus()')
        $('#autocomplete').autocomplete({lookup: clients});
    }else{
        console.log('ffrom localStorage')
        storage.get('autocomplete', function(error, data) {
            if (error) console.log(error);
            console.log(data.client)
            $('#autocomplete').autocomplete({lookup: data.clients});
        });
    }
}
*/

$(function() {
    oFileIn = document.getElementById('my_file_input');
    if(oFileIn.addEventListener) {
        oFileIn.addEventListener('change', filePicked, false);
    }
});

function filePicked(oEvent) {
    oFile = oEvent.target.files[0];
    isXLSX = properFormat(oFile.name)
}

function submitFile(){
    if (oFile == null) {
          $('div.warning_message').html('You must choose a file.');
          return;
    }
    if(isXLSX){
        $('div.warning_message').html('');
        var formData = new FormData();
        formData.append("excelFile", oFile);
        var request = new XMLHttpRequest();
        request.open("POST", "https://alchemista.herokuapp.com/newMenus");
        request.send(formData);
        $('div.warning_message').html('<div class="loader"></div>');
        request.onreadystatechange = function(){
            if (request.readyState == 4 && request.status == 200) {
              //  loadComments();
                loadMenus();
                $('div.warning_message').html('Done!');
            }else if (request.readyState == 4 && request.status == 503){
              // loadComments(); 
               loadMenus();
               $('div.warning_message').html('This is taking a while... but should be fine! Just reload.');
               console.log('readyState = ' + request.readyState)
               console.log('readyState = ' + request.status)
            }else{
                console.log('readyState = ' + request.readyState)
                console.log('readyState = ' + request.status)
                 $('div.warning_message').html('Done!');
                 loadMenus();
                //$('div.warning_message').html('There was a problem. Try again.'); 
            }
        };
    }else{ 
        $('div.warning_message').html('WARNING: the file has to be in .xlsx format');
    }
}

function properFormat(filename) {
    var parts = filename.split('.');
    var ext = parts[parts.length - 1];
    ext = ext.toLowerCase();
    return ext == 'xlsx' ? true : false;
}


function loader(text){
    vex.open({
        //<style>.vex-custom-field-wrapper {margin: 50px 50px;}.vex-custom-field-wrapper > label {display: inline-block;margin-bottom: 10em;}</style>
      content:"  <h5>"+text+"<h5><br><div class='loader'>",
      escapeButtonCloses: false,
      overlayClosesOnClick: false,
      showCloseButton: false

    });
}
/*
$(function(){
    
        var clients = [
        { value: 'Alchemista' },
        { value: 'Altitude, Inc.'},
        { value: 'Appneta'},
        { value: 'Atlas Ventures'},
        { value: 'Attivio'},
        { value: 'Ballentine Partners, LLC'},
        { value: 'Boston Bio Medical'},
        { value: 'BSA Foundation'},
        { value: 'C-Space'},
        { value: 'Circle Internet'},
        { value: 'Cognius LLC'},
        { value: 'CogoLabs'},
        { value: 'Crispr'},
        { value: "Curaspan"},
        { value: 'Data Xu'},
        { value: 'Datto'},
        { value: 'Dealer Rater'},
        { value: 'Dicerna Pharmaceuticals'},
        { value: "Draft Kings"},
        { value: "Edelstein"},
        { value: 'EJF Capital'},
        { value: "Equifax"},
        { value: "Fiksu"},
        { value: "Flywire"},
        { value: "Fuze"},
        { value: "Hello Wallet"},
        { value: "Intrepid Persuits"},
        { value: "Iora Health"},
        { value: "Krux"},
        { value: "Kyruus"},
        { value: "Maxwell Health"},
        { value: "MIT - Guillermo Alejandre"},
        { value: "MIT - Marvin Vilma"},
        { value: "MIT - Sophia Hasenfus"},
        { value: "Moderna Therapeutics"},
        { value: "Paradigm Properties"},
        { value: "Paratek Pharmaceuticals"},
        { value: "Partners + SIMONS"},
        { value: "Pixability"},
        { value: "PrecisionEffect"},
        { value: "Q Stream"},
        { value: "RainKing"},
        { value: "Raizlabs"},
        { value: "RBM Technologies"},
        { value: "Rally Point"},
        { value: "Red Star Ventures"},
        { value: "Sage Therapeutics"},
        { value: "Seven Bridges Genomics Inc"},
        { value: "Smartleaf Inc"},
        { value: "Sonos"},
        { value: "Splunk"},
        { value: "Teikametrics"},
        { value: "ThirdChannel"},
        { value: "Trip Advisor"},
        { value: "Verastem Inc"},
        { value: "Viral Gains"},
        { value: "VM Turbo"},
        { value: "Watermill Group"},
        { value: "Wayfair"},
        { value: "Winterline"},
        { value: "Wolf & Co"},
        { value: "ZappRX"},
        { value: "Zerto"},
    ];
    
    var vendors = [
        { value: 'Flame' },
        { value: 'Skewers' },

    ];
    $('#autocompleteClient').autocomplete({lookup: clients});
    $('#autocompleteVendor').autocomplete({lookup: vendors});
    /*
     var vendors = [
        { value: 'Alchemista' },
        { value: 'Ryan\' Chocolaterie'},
        { value: 'Brown'}
    ];
    
});
*/


