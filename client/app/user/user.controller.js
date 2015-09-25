'use strict';

angular.module('housingApp')
  .controller('UserCtrl', function ($scope, $http, socket) {
    /**
     *Initial Variable initialization
     */
    $scope.username = "";
    $scope.showLogin = true;
    $scope.messages = [];
    $scope.userMessage = "";
    $scope.socket = socket.socket;
    
    /**
     * This function sets the current user for the admin to the one clicked by the admin
     * It also emits an event to add the user to the list of clients 
     */
    $scope.setUserName = function(){
      $scope.username = $scope.username.trim();
      //get messages for this user if exists
      $scope.showLogin = false;
      $scope.socket.emit('add_user',$scope.username);
    };

    /**
     * This method sends the client's message to the admin
     */
    $scope.sendMessage = function(){
      $scope.userMessage = $scope.userMessage.trim();
      $scope.socket.emit('user_message',$scope.userMessage);
      $scope.messages.push({person:"You",text:$scope.userMessage});
      $scope.userMessage = "";
    };

    /**
     * This event is fired when the admin send a message to the user
     */
    $scope.socket.on('admin_sent_message',function(message){
      $scope.messages.push({person:"Admin",text:message})
    });

    /**
     * This event is fired when a server returns with the messages of user
     */
    $scope.socket.on('user_exists',function(messages){
      $scope.messages = messages;
    });

    /**
     * This function is fired when a user presses a key
     * @param  {Object} event ---> This contains the keydown event object
     * @return {void}
     */
    $scope.keypressed = function(event){
      if(event.keyCode === 13){
        if($scope.showLogin === false){
          $scope.sendMessage();
        } 
        else{
          $scope.setUserName();
        }
      }
    };
  });
