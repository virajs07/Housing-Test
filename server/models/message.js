var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * This is the schema for a message which is stored in the database for a user
 * username is required to keep a track of the client for whom the messages 
 * are being stored
 * message stores the message for the client
 */
var Message = new Schema({
	username:{type:String,trim:true},
	message:{type:String,trim:true},
});

module.exports = mongoose.model('Message',Message);