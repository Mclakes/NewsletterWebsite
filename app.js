const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended :true}))

app.get("/", function(req, res) {
    res.sendFile(__dirname +  "/signup.html")
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    console.log(firstName, lastName, email)

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/f400099413"

    const option = {
        method: "POST",
        auth: "Ancestor:77cf6907bac9c16639e59522dec3d5a1-us14"
    }

    const request = https.request(url, option, function(response) {

            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html")
            }

            else {
                res.sendFile(__dirname + "/failure.html")
            };


            response.on("data", function (data) {
                console.log(JSON.parse(data));
            });
    })

    // request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000 , function () {
    console.log("This is a Newsletter App");
});

//api key
// 77cf6907bac9c16639e59522dec3d5a1-us14

// audience list id
// f400099413