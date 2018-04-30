var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var topic = "";
var ws = new WebSocketServer({
  port: port
});

var messages = [];

console.log("Websockets server started");

ws.on("connection", function(socket) {
  console.log("Client connection established");

  if (topic) {
    socket.send("*** Topic is '" + topic + "'");
  }

  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on("message", function(data) {
    console.log("message recieved: " + data);
    var messageToClients = "";

    if (data.startsWith("/topic")) {
      topic = data.split("/topic")[1].trim();
      messageToClients = "*** Topic has changed to '" + topic + "'";
    } else {
      messageToClients = data;
      messages.push(messageToClients);
    }

    ws.clients.forEach(function(clientSocket) {
      clientSocket.send(messageToClients);
    });
  });
});
