'use strict'

angular.module('housingApp')
	.controller('AdminCtrl',function ($scope, $http,$timeout, socket){

		/**
		 * Initial variables initialization
		 */
		$scope.users =[]; //list of users
		$scope.messages = []; // list of messages
		$scope.currentUser = ""; // current user in the scope
		$scope.socket = socket.socket; 
		$scope.messageFor = "";
		$scope.adminMessage = ""; //message typed by the admin

		/**
		 * This event adds the admin to the list of clients connected on server 
		 */
		$scope.socket.emit('add_admin',"");

		/**
		 * This event gets the list of users currently connected to the server
		 */
		$scope.socket.emit('get_users',"");

		/**
		 * This function sets the current user with whom admin is interacting
		 * and them emits an event to get the chat history between them
		 * @param  {String} name ---> the username that the admin wants to chat with
		 * @return {void}
		 */
		$scope.setUserName = function(name){
			$scope.currentUser = name;
			$scope.socket.emit('get_user',name);			
		}

		/**
		 * This event is fired when a user has sent a message to the admin.
		 * This displays the message by adding it to the list of messages
		 * 
		 */
		$scope.socket.on('user_message',function(message){
			console.log('User has sent message: ' +message);
			if(message.person == $scope.currentUser){
				$scope.messages.push(message);
			}
			else{
				$scope.messageFor = message.person;
				$timeout(function() {$scope.messageFor = ""}, 5000);
			}
		});
		/**
		 * This event is fired when any user disconnects from the chat
		 * It removes the user from the list of users and removes it's messages
		 * if any from the scope.
		 */
		$scope.socket.on('user_disconnected',function(username){
			$scope.users.splice($scope.users.indexOf(username),1);
			if($scope.currentUser == username){
				$scope.messages = "";
			}
		});
		/**
		 * This event is fired when the server returns with a list of users
		 * It removes admin from the list and displays the rest
		 */
		$scope.socket.on('users',function(users){
			users.splice(users.indexOf("admin"),1);
			$scope.users = users;
		});
		/**
		 * This event is fired when the server returns with a list of 
		 * messages for a user
		 */
		$scope.socket.on('message_history',function(messages){
			$scope.messages = messages;
		});
		/**
		 * This function sends the message send by the admin to the client
		 * @return {void}
		 */
		$scope.sendMessage = function(){
			$scope.messages.push({person:"Admin",text:$scope.adminMessage});
			$scope.socket.emit('admin_message',{person:"Admin",text:$scope.adminMessage,
				username:$scope.currentUser});
			$scope.adminMessage = "";
		};
		/**
		 * This function is fired whenever a user presses a key
		 * @param  {Object} event ---> This contains the keydown event object
		 * @return {void}
		 */
		$scope.keypressed = function(event){
			if(event.keyCode === 13){
				$scope.sendMessage();
			}
		};


});