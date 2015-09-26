# Chat Application

This is a smaple chat application written in **Node.js** in backend and **AngularJS** in front end. It is powered with **grunt** tasks to buld, serve and watch. 

This aplication uses **yeomen** and **angular fullstack generator** to scaffold and generate the application, internally which uses bower for package management. 

The application uses web sockets for client server interaction. It has two screens, one for the user and the other for the admin. At any given point of time the admin can chat with any of the user from all the active ones. The user can also only interact with the admin.

It uses name of users as primary key. For returning users the chat application first sends back all the previous chats information before proceeding. It uses mongodb to store all the chats of a user. 


## Setup
```
git clone

npm install

bower install

grunt build

grunt serve
```

## Working

The application runs on port 9000 by default. It can be changed or set in the config file.

To open the application go to browser and open localhost:9000. You will be pompted for a nickname. Please enter that and you can begin to chat.To view admin screen open localhost:9000/admin. You will then see a list of users on the page. Click on anyone you want to chat with. If you have a chat history with the user then all the messages will be displayed. You can send the message by pressing enter. In the meantime if any other user connects and sends you the messge you will see the username flash for some time. You can choose to chat with him.
