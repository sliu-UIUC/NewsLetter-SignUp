const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

// Public folder stores static assets that are used
// by the html file.
// Then the functino tells the app to use files
// stored in the public folder.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/signup.html");
});

// Handle post request for our form.
// The form being handled must specify the method
// as POST and have action category specifying the
// location of where data is being sent to.
app.post("/", function(request, response){
  // Fetch data entered from each field.
  const firstName = request.body.fName;
  const lastName = request.body.lName;
  const email = request.body.email;

  // Create javascript object based on the format from
  // the mail list server.
  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  // Parse javascript object into json.
  let jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/14fe5ff1aa";

  const options = {
    method: "POST",
    auth: "jamesliu23:3b51501b447a5c5f7891b86b14c35dd8-us5"
  }

  // Create a post request that linkes to the server.
  const postRequest = https.request(url, options, function(res) {
    if(res.statusCode === 200) {
      response.sendFile(__dirname + "/success.html");
    } else {
      response.sendFile(__dirname + "/failure.html");
    }

    res.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  // This will write our jsonData for subscribers to the server database.
  postRequest.write(jsonData);
  postRequest.end();
});

// Redirect to home page, trigers the app.get
// again and render the sign-up page.
app.post("/failure", function(req, res) {
  res.redirect("/");
});

// Will work both online and locally.
app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000.")
});
