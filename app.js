//jshint esversion:6
const express = require("express");
const app = express();
app.set("view engine","ejs");

const https = require("https");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){                //this res sends the processed information in the server back to the client
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){    
    const query = req.body.City;
    const apiKey =  "76b2aaa82e09b6436041d2b93b21dbc8";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;

    https.get(url,function(response){       //this response extracts data from the url
        // console.log(response.statusCode);
        if((response.statusCode===404)){
            res.render("failure");
        }            
        else{
            response.on("data",function(data){
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const descpr = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageUrl = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
                let today = new Date();
                let options = {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
                dayName = today.toLocaleDateString("en-US",options);
                if(response.statusCode===200){
                    if (icon[2]=="d"){
                        // console.log("It's day");
                        res.render("day",{CityName:query,day:dayName,tmp:temp,description:descpr,iconImgSrc:imageUrl});
                    }
                    else if(icon[2]=="n"){
                        // console.log("It's night");
                        res.render("night",{CityName:query,day:dayName,tmp:temp,description:descpr,iconImgSrc:imageUrl});
                    }
                }
            });
        }
    });    
});
app.post("/day",function(req,res){
    res.sendFile(__dirname+"/index.html");
});
app.post("/night",function(req,res){
    res.sendFile(__dirname+"/index.html");
});
app.post("/failure",function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.listen("3000",function(){
    console.log("Server is listening to port 3000");
})




// res.write("<h1> Weather report of your city is here: </h1>")    //in case of res.write if want to use html then use from very 1st line else won't get it in html format
// //we can have only one res.send but can have multiple res.write 
// //and here res.send should be send empty there shouldn't be any data else throws error of identifying setting header when sent to the client

// res.write("<h1>The temp in "+ query+" is: "+temp+" </h1>");
// imageUrl = "https://openweathermap.org/img/wn/"+icon+"@2x.png"

// res.write("<p>Weather description: "+descpr+" </p>"+"   "+"<img src="+ imageUrl +  ">")
// // imageUrl = "https://openweathermap.org/img/wn/"+icon+"@2x.png"
// // res.write("<img src="+ imageUrl +  ">");         // pay attention here

// res.send();

//use of stringify for flattening data
// const object = {name: "Taru",age:20}
// dt = JSON.stringify(object);
// console.log(dt);
// res.send("Weather project: ") // we can have only one res.send in a app.get
