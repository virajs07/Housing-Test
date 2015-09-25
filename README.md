# Chat Application

This is a smaple chat application written in **Node.js** in backend and **AngularJS** in front end. It is powered with **grunt** tasks to buld, serve and watch. 

This aplication uses **yeomen** and **angular fullstack generator** to scaffold and generate the application, internally which uses bower for package management. 

The application uses web sockets for client server interaction. It has two screens, one for the user and the other for the admin. At any given point of time the admin can chat with any of the user from all the active ones. 

It uses name of users as primary key. For returning users the chat application first sends back all the previous chats information before proceeding. 


## Setup
```
git clone

npm install

grunt build

grunt serve
```

