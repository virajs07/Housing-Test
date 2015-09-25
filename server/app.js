/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var Message = require('./models/message');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

var sockets = {}; // this is used to keep a track of the sockets connected to from server
var user = {}; // this is used to keep usernames
var admin = "admin";

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(9000,function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

/**
 * This function gets the messages of a user from the db and then 
 * sends them to the client socket
 * @param  {String} name ---> client name where the message has to be sent
 * @param  {String} socket ---> the socket to be used while sending the message
 * @param  {String} message ---> the event to be generated on the client socket
 * @return {void}
 */
function getMessagesOfUserFromDb(name,socket,message){
	var messages = [];
	Message.find({username:name},function(err,messageObject){
		if(err){
			throw err;
		}
		console.log(messageObject);
		for(var i=0;i<messageObject.length;i++){
			messages.push(JSON.parse(messageObject[i]["message"]));
		}
		socket.emit(message,messages);
	});
}
/**
 * This function is called whenever a client is able to establish a connection with the 
 * 
 */
socketio.on('connection',function(socket){
	
	/**
	 * This event is fired when a user sends a message.
	 * It then notifies the admin of the message send by the user.
	 */
	socket.on("user_message",function(message){
		var messageJSON = JSON.stringify({person:socket.username,text:message});
		var userMessage = new Message({username:socket.username,message:messageJSON});
		userMessage.save();
		console.log("User's message has been saved in db");
		if(user[admin]){
			var adminSocket = sockets[user[admin]];
			adminSocket.emit('user_message',JSON.parse(messageJSON));
			console.log("Send to admin socket");
		}
		console.log("end")
	});

	/**
	 * This event is fired when the admin sends a request to get the list of users 
	 * currently active
	 */	
	socket.on("get_users",function(){
		socket.emit("users",Object.keys(user));
	});
	
	/**
	 * This event is fired when a user joins the chat.
	 * It then sees if there is an admin in the chat then it notifies the admin
	 * about the user joining the chat
	 */	
	socket.on("add_user",function(username){
		socket.username = username.trim();
		socket.emit('message',"User has been added successfully");
		sockets[socket.id] = socket;
		user[socket.username] = socket.id;
		getMessagesOfUserFromDb(username,socket,'user_exists');		
		if(user[admin]){
			var adminSocket = sockets[user[admin]];
			adminSocket.emit('users',Object.keys(user));
			console.log("Send to admin socket");
		}
	});

	/**
	 * This event is fired whenever an admin joins the chat
	 */
	socket.on('add_admin',function(message){
		user[admin] = socket.id;
		sockets[socket.id] = socket;
		console.log("Admin logged in");
	});

	/**
	 * This event is fired when an admin sends a message to a client .
	 * It also fires an event on the client socket notifying it of the 
	 * message by admin
	 */
	socket.on('admin_message',function(message){
		var userSocket = sockets[user[message.username]];
		var messageJSON = JSON.stringify({person:message.person,text:message.text});
		var userMessage = new Message({username:message.username,message:messageJSON});
		userMessage.save();
		userSocket.emit('admin_sent_message',message.text);
	});

	/**
	 * This function is fired when the server socket gets an event to get the list of
	 * messages from the database for a given user
	 */
	socket.on("get_user",function(username){
		getMessagesOfUserFromDb(username,socket,'message_history');
	});

	/**
	 * This function removes the sockets from the list of client sockets on server
	 * and then fires the users event on admin socket so that the list of users 
	 * gets updated on admin
	 */
	socket.on("disconnect",function(){
		delete user[socket.username];
		delete sockets[sockets.id];
		if(user[admin]){
			var adminSocket = sockets[user[admin]];
			adminSocket.emit('user_disconnected',socket.username);
			console.log("Send to admin socket");
		}
		console.log("Socket disconnected");
	});
});

// Expose app
exports = module.exports = app;
