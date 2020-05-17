var express = require('express')
var bodyParser = require('body-parser')

var app = express()

var http = require('http').Server(app)   //Doing For Socket.io idk Y
var io = require('socket.io')(http)     //setting up our socket io in backend   

var mongoose = require('mongoose')

require('dotenv').config()      //use the secret keys

app.use(express.static(__dirname))      //Serving static content with express
// Or Second way to index.HTML showFile
// app.get("/",(req,res)=>{            
//     res.sendFile(__dirname+'/index.html');
// })
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended:false} ))


// Mlab MongoDb Url
var dbUrl = process.env.DBLINK


var Message = mongoose.model('Message', {           //Making Schema of mDB
    name : String,
    message : String
})

// var messages = [                 //Now fetching from database
    // {name : "Saksham" , message : "Hello"},
    // {name : "Aditi" , message : "Welcome"}
// ]

app.get('/messages',(req,res)=>{
    // res.send(messages)               INitially we using this to make server api via manual message array now fetching from db and making api
    Message.find({} , (err,mess) => {
        res.send(mess)
    })
})

app.post("/messages",(req,res)=>{
    var message = new Message(req.body)             //Creating object of mongodb schema
    
    message.save( error => {            //SAVING DATA INTO DB
       
        if(error)
            sendStatus(500)         //Sending Server error 
    
        // messages.push(req.body)     [NOW NO NEED TO PUSH msg in manual message array | USE MLAB DATA]      
        io.emit('message',req.body)         //Emitting function which invokes on every msg 
        res.sendStatus(200)    
    })
})



io.on("connection",(socket) => {
    console.log("User Connected !");
    
})

// Mongoose connection
mongoose.connect(dbUrl,(error)=>{                   //if there is error then not go inside
    console.log("MongoDB Connection Successfull")
})

// app.listen(3000, () => console.log('Server Started') )           //Changed with http | coz of Socket.io
http.listen(3000, () => console.log('Server Started') )           

