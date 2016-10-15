var express = require('express');
var multer  = require('multer');
//var wwwhisper = require('connect-wwwhisper');
var upload = multer({ dest: 'uploads/' });
var bodyParser = require ('body-parser');
var app = express();
// app holds a reference to express or connect framework, it
// may be named differently in your source file.
//app.use(wwwhisper());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Required if we need to use HTTP query or post parameters

var jsonify = require('jsonify-excel');
app.set('port', (process.env.PORT || 5000));
app.use(express.static('website'));
app.get('/',function(request,response){
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_svd8m2vs:ri83c055vvj3615bv03dbjlvec@ds021000.mlab.com:21000/heroku_svd8m2vs';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
  if (error) {
    console.log(error);
  }
  db = databaseConnection;
});

/* the following is for menus */

/**********************************************************************/
app.get('/getMenus',function(request,response){
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  db.collection('menus', function(error, coll) {
    if (error){
      console.log(error)
    }
    coll.find().toArray(function(err, allMenus) {
        if (err){
          console.log(err)
        }
        response.send(allMenus)
    });      
  });
});

app.post('/newMenus', upload.single('excelFile'), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var insertReturn;
  const config = {
    automap: false,
    sheet: 0,
    start: 2,
    condition: function (cell) {
      return !!cell('A');
    },
  };
  const map = [{
    'Client/Organization': '*A',
    Date: '*B',
    'Daily Menu Description':'*C',
    Name:'*D',
    Qty : '*E',
    Type: '*F',
  }];
  const jsonFile = new jsonify(req.file.path).toJSON(config,map);
  db.collection('menus', function(error, coll) {
      if (error){
        console.log(error);
      }else{
        coll.insertMany(jsonFile);
        res.send(String(Object.keys(jsonFile).length));
      }
  });
});

app.get('/getMenuCount',function(request,response){
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  db.collection('menus', function(error, coll) {
    if (error){
      console.log(error);
    }
    coll.find().count(function(err, count) {
      err ? console.log(err) : response.send(String(count))
    });      
  });
});

/* the following is for comments */

/**********************************************************************/




app.get('/getComments',function(request,response){
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  db.collection('comments', function(error, coll) {
    if (error){
      console.log(error)
    }
    coll.find().toArray(function(err, allComments) {
        if (err){
          console.log(err)
        }
        response.send(allComments)
    });      
  });
});


app.post('/newComments', function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var newComment = request.body.comment;
  var hashCode = request.body.code;
  if (newComment == null || hashCode == null || hashCode == ""){
    response.send({"error":"Whoops, something is wrong with your data!"});
  }else{    
    db.collection('comments', function(error, coll) {
      if (newComment == ''){
        coll.remove({code:hashCode}, true )
      }else{
        coll.update({code:hashCode},{$set: {comment: newComment} },{upsert:true});
      }
      coll.find().toArray(function(err, allComments) {
        if (err){
          console.log(err)
        }
        response.send(allComments)
      }); 
    });
  }
});

/* the following is for favorites */

/**********************************************************************/

app.post('/newFavorite', function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var newFavorite = request.body.favorite;
  var hashCode = request.body.code;
  if (newFavorite == null || hashCode == null || hashCode == ""){
    response.send({"error":"Whoops, something is wrong with your data!"});
  }else{
    db.collection('favorites', function(error, coll) {
      if (newFavorite == 'false'){
        coll.remove({code:hashCode}, true )
      }else{
        coll.update({code:hashCode},{$set: {favorite: newFavorite} },{upsert:true});
      }
      coll.find().toArray(function(err, allFavorites) {
        if (err){
          console.log(err)
        }
        response.send(allFavorites)
      });
    });
  }
});
app.get('/getFavorites',function(request,response){
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  db.collection('favorites', function(error, coll) {
    if (error){
      console.log(error)
    }
    coll.find().toArray(function(err, allFavorites) {
        if (err){
          console.log(err)
        }
        response.send(allFavorites)
    });      
  });
});
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})