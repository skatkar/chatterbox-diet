// Create an app
var server = require("diet")
var fs = require("fs")
var wss = require("./websockets-server");
var app = server()
app.listen("http://localhost:8000")

// Require the diet-static module and configure it
var staticFile = require("diet-static")({
  path: app.path + "/app/"
})

// Attach the static module as a footer middleware
//app.footer(static)
app.view("file", staticFile)

app.missing(function($) {
  //$.end('My Custom 404 Not Found Page')
  // set "Content-Type" header to "text/html"
  //$.redirect("/error.html")
  $.header("Content-Type", "text/html")
  $.status("404")
  fs.readFile(__dirname + "/app/error.html", function(error, content) {
    // handle error
    if (error) throw error;

    // Serve the file to the client
    $.end(content.toString())
  })
})

//Error Handler
app.error(function($) {
  // Throw error message without shutting down the node process
  //console.throw($.fail.error)

  // Display Error Message to the client:
  // 500
  // Internal Server Error
  // Unexpected variable "hello" at index.js:3:4
  $.end($.statusCode + "\n" + $.statusMessage + "\n" + $.fail.error.message)
})

// Default page
app.get("/", function($) {
  //$.end('Hello World! Are you there?')
  $.redirect("index.html")
})
