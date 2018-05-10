const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const setupPassport = require("./passport");
const bodyParser = require("body-parser");
const knex = require("knex");
const http = require("http").Server(app);
const https = require("https");
const router = require("./router")(express);
const port = process.env.PORT || 3030;
const path = require('path');
const hbs = require('express-handlebars');
const routes = require('./routes/index');

// INITIALIZE BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));

//Set HANDLEBARS View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'hbs');
app.set('partials', path.join(__dirname, '/views/partials'));
app.use(express.static(path.join(__dirname, '/public')));



// Import Routers
const ItiRouter = require("./routers/itiRouter");
// Import Services
const ItiService = require("./services/itiService");

// Create Session
app.use(
    session({
      secret: "supersecret",
      resave: true,
      saveUninitialized: true
    })
  );

app.use("/", router); //'/'is used as mother route and app.use to use router.get,post.delete... to control the  subsidiary route
let itiService = new ItiService(knex);
let itiRouter = new ItiRouter(itiService);
app.use("/iti", itiRouter.route()); // at route /iti, will call itRouter's route()method

https.createServer(
    {
      key: fs.readFileSync("domain.key"),
      cert: fs.readFileSync("domain.crt")
    }, app).listen(port);





app.get('/', function (req, res) {
    res.render('index', {
        data: data
    });
});

app.get('/profile', function (req, res) {
    res.render('profile', {
        data: data
    });
});

app.get('/builder', function (req, res) {
    res.render('builder', {
        blockData: blockData
    });
});


var data = [
    {
        title: "Journey to Edo",
        city: "Tokyo",
        description: "Tokyo is awesome!",
        activity_tags: ["Historical", "Epic"],
        each_activity: [{
            img_url: "image url",
            act_name: "Edo Palace",
            address: "Edo District",
            activity_description: "Welcome to MTV cribs: shogun edition"
        }]
    }, {
        title: "Singing in Singapore!",
        city: "Singapore",
        description: "We're singing in the rain!",
        activity_tags: ["Theatrical", "Amazing"],
        each_activity: [
            {
                img_url: "image url",
                act_name: "Marina Bay Sands",
                address: "Marina Bay",
                activity_description: "ITS A GIANT CASINO"
            }, {
                img_url: "image url",
                act_name: "Merlion",
                address: "Marina Bay",
                activity_description: "ROARRRRRR"
            }
        ]

    }];

    var blockData = [
          {
          name: "Dim Sum",
          address: "1 Des Veoux Road",
          octime: "7:00-19:00",
          activity_tag: "Gastronomic",
          description: "its delicious!"
        }, {
            activity_img: "",
            name: "Big Buddha",
            address: "Lantau Island",
            octime: "8:00-22:00",
            activity_tag: "Cultural",
            description: "He's a big brudda!"
          }, {
            name: "Ocean Park",
            address: "Aberdeen",
            octime: "9:00-21:00",
            activity_tag: "Epic",
            description: "Best park in HK"
          }
    ];



app.set('port', (3000));

app.listen(app.get('port'), function () {
    console.log('Server is listening on port ' + app.get('port'))
});
