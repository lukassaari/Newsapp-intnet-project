var exampleSocket = new WebSocket("http://localhost:5001");

exampleSocket.onopen = function (event) {
  exampleSocket.send("Here's some text that the server is urgently awaiting!"); 
};