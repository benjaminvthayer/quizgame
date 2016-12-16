var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');


app.set('view engine','ejs');
app.set('views', __dirname +'/views');
app.use(express.static(__dirname+'/public'));

//create connectrion
var con = mysql.createConnection({
	host:"localhost",
	user:"Ben",
	password:"",
	database:"finalproject"	
})

//connect
con.connect(function(err) {
	if(err) throw err;
}); 

//serve index
app.get('/', function (req, res) {
  res.render('index')
})

//Project Variables
var ques = ["What is the name of the Gun-Gun leader?","What is Boba Fett's ship called?","What Creatures sell R2-D2 to Luke?","Who is Leia's foster dad?","On what planet does Anakin lose his legs?","Who's DNA is used for the clones?","How many lightsaber duels in 'Revenge of the Sith'?","Who is Jaba's top advisor?"]
var corrans = ["Boss Nass","Slave I","Jawas","Bail Organa","Mustafar","Jango Fett","5","Bib Fortuna"]
var userans = []
var username;
var hs = []

//play round of quiz
app.get('/play',function(req,res){
	username = req.query.name;
	res.render('play',{"questions":ques,"correctanswers":corrans});
})

//recieve answers submitted from client
app.get('/submit',function(req,res){
	userans = [];
	var numCorrAns=0;
	userans.push(req.query.answer0);
	userans.push(req.query.answer1);
	userans.push(req.query.answer2);
	userans.push(req.query.answer3);
	userans.push(req.query.answer4);
	userans.push(req.query.answer5);
	userans.push(req.query.answer6);
	userans.push(req.query.answer7);
	for(var i =0;i<userans.length;i++){
		if(userans[i]==corrans[i]){
			numCorrAns++;
		}
	}
	addScore(req,res,numCorrAns);
	res.render('showAnswers',{"questions":ques,"correctanswers":corrans,'answers':userans});
})

//adds the user's submitted score to the database
function addScore(req,res,numCorrAns){
	var queryText = "insert into scores values ('"+ username +"','"+ numCorrAns +"');"
	con.query(queryText,function(err, rows, fields) {
		if (err) throw err;
    })
}

//send highscores from database to client
function sendHighScores(req,res){

}

//Produce highscore Page
app.get('/highscores',function(req,res){
	con.query('Select * from scores order by score desc limit 10',function(err, rows, fields) {
		if (err) throw err;
		hs =[];
		for(var i = 0; i < rows.length ; i++){
			hs.push({"name":rows[i].name,"score":rows[i].score});
		}
		res.render('highscores',{highscores:hs});
    })
})


app.listen(8081);
console.log('Server running at http://127.0.0.1:8081/');
