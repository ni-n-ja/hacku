'use strict'
var express = require('express'),
    bodyParser = require('body-parser'),
    env = process.env,
    recentPosted = null,
    app = express();
var request = require('request');

var face = faceSelect("smile");
var motion = {
    r: [90, 90, 90, 90],
    l: [90, 90, 90, 90]
};

var slack = require('slack');
var token = "";
let bot = slack.rtm.client();
bot.listen({
    token
});
bot.message(message => {
    var text = 0;
    if (message.text && message.text.indexOf("USER_ID") !== -1) {
        console.log(JSON.stringify(message));
        var tango = message.text;
        tango = tango.replace('<USER_ID>: ', "").substr(0, (tango.length - 1));
        face = faceSelect("@");

        //このtangoって変数が@silexに向けて発言された内容
        console.log(tango);
        if (tango == "ok") {
            face = faceSelect("ok");
            text = "ok";
            motion = {
                r: [30, 150, 30, 150],
                l: [150, 30, 150, 30]
            };
        }
        else if (tango == "ng") {
            face = faceSelect("ng");
            text = "ng";
            motion = {
                r: [90, 90, 90, 90],
                l: [90, 90, 90, 90]
            };
        }
        else if (tango == "ha?") {
            face = faceSelect("ha?");
            text = "ha?";
            motion = {
                r: [30, 90, 30, 90],
                l: [30, 90, 30, 90]
            };
        }
        else if (tango == "unko") {
            face = faceSelect("unko");
            text = ":hankey:";
            motion = {
                r: [30, 90, 30, 90],
                l: [30, 90, 30, 90]
            };
        }

        if (text) {
            request.post({
                uri: " https://slack.com/api/chat.postMessage ",
                form: {
                    text: text,
                    //textに入れておけばsilexが発言する
                    channel: message.channel,
                    token: token,
                    ling_names: 1,
                    as_user: true
                },
                json: true
            }, function(error, response, body) {
                console.log(error);
                console.log(body);
            });
        }
        else {
            request.post({
                uri: " https://slack.com/api/chat.postMessage ",
                form: {
                    text: tango,
                    //textに入れておけばsilexが発言する
                    channel: message.channel,
                    token: token,
                    ling_names: 1,
                    as_user: true
                },
                json: true
            }, function(error, response, body) {
                console.log(error);
                console.log(body);
            });
        }


    }
});

app.use('/', express.static('__dirname'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {

});

router.route('/api').get(function(req, res) {
    var rot = Math.floor(Math.random() * 60) + 60;

    res.writeHead(200, {
        'content-type': 'application/json'
    });
    res.end(JSON.stringify({
        "face": face,
        "r": motion.r,
        "l": motion.l
    }));
    face = faceSelect("smile");
    motion = {
        r: [90, 90, 90, 90],
        l: [90, 90, 90, 90]
    };
});

router.route('/api/post').post(function(req, res) {
    if (req.result == "succsess") {

        face = faceSelect("ok");
        motion = {
            r: [30, 150, 30, 150],
            l: [150, 30, 150, 30]
        };
    }
    else if (req.result == "fail") {
        face = faceSelect("ng");
        motion = {
            r: [90, 90, 90, 90],
            l: [90, 90, 90, 90]
        };
    }
    res.writeHead(200, {
        'content-type': 'text/plain'
    });
    res.end(JSON.stringify(req.body));
    if (req.body) {

    }
});

router.route('/api/recent').post(function(req, res) {
    recentPosted = req.body;
    res.writeHead(200, {
        'content-type': 'application/json'
    });
    res.end(JSON.stringify(recentPosted));
});

router.route('/api/recent').get(function(req, res) {
    res.writeHead(200, {
        'content-type': 'application/json'
    });
    res.end(JSON.stringify(recentPosted));
});

app.use('/', router);

if (process.env.PORT) {
    app.listen(process.env.PORT || '8080');
}
else {
    app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost');
}

function faceSelect(feeling) {
    var tango = {};
    tango['smile'] = [ //^^
        parseInt("00000000", 2),
        parseInt("00000000", 2),
        parseInt("01000010", 2),
        parseInt("01000010", 2),
        parseInt("01000010", 2),
        parseInt("00000000", 2),
        parseInt("00100100", 2),
        parseInt("00011000", 2)
    ];

    tango["ok"] = [ //ok
        parseInt("00000000", 2),
        parseInt("00000000", 2),
        parseInt("01100100", 2),
        parseInt("10010101", 2),
        parseInt("10010110", 2),
        parseInt("01100101", 2),
        parseInt("00000000", 2),
        parseInt("00000000", 2)
    ];

    tango["ng"] = [ //ng
        parseInt("00000000", 2),
        parseInt("00000000", 2),
        parseInt("10010111", 2),
        parseInt("11010100", 2),
        parseInt("10110101", 2),
        parseInt("10010111", 2),
        parseInt("00000000", 2),
        parseInt("00000000", 2)
    ];

    tango["@"] = [ //@
        parseInt("00111100", 2),
        parseInt("01000010", 2),
        parseInt("10011101", 2),
        parseInt("10100101", 2),
        parseInt("10100101", 2),
        parseInt("10011101", 2),
        parseInt("01000110", 2),
        parseInt("00110001", 2)
    ];

    tango["ha?"] = [ //ha?
        parseInt("00010000", 2),
        parseInt("10111000", 2),
        parseInt("10010000", 2),
        parseInt("10110011", 2),
        parseInt("10111001", 2),
        parseInt("00000010", 2),
        parseInt("00000000", 2),
        parseInt("00000010", 2)
    ];
    tango["unko"] = [
        parseInt("01000010", 2),
        parseInt("00001000", 2),
        parseInt("00011000", 2),
        parseInt("10111100", 2),
        parseInt("00100100", 2),
        parseInt("01011010", 2),
        parseInt("11100011", 2),
        parseInt("11111111", 2)
    ];
    tango["0"] = [
        parseInt("00000000", 2),
        parseInt("00000000", 2),
        parseInt("00000000", 2),
        parseInt("00000000", 2),
        parseInt("00000000", 2),
        parseInt("00000000", 2),
        parseInt("00000000", 2),
        parseInt("00000000", 2)
    ];
    tango["114514"] = [
        parseInt("10101010", 2),
        parseInt("10101110", 2),
        parseInt("10100010", 2),
        parseInt("00000000", 2),
        parseInt("11010101", 2),
        parseInt("10010111", 2),
        parseInt("01010001", 2),
        parseInt("11010001", 2)
    ];

    return tango[feeling];
}

var twitter = require("twitter");
var tbot = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

const BOT_ID = 'teresuec';
tbot.stream('statuses/filter', {
    track: 'teresuec'
}, function(stream) {
    /*
    tbot.post('statuses/update', {
        status: "SilexBot 起動\n"
    }, function(data) {
        console.log(data);
    });
    */
    stream.on('data', function(data) {
        if (data.text.indexOf("うんち") != -1 || data.text.indexOf("unko") != -1 || data.text.indexOf("💩") != -1) {
            face = faceSelect("unko");
            motion = {
                r: [30, 150, 30, 150],
                l: [150, 30, 150, 30]
            };
            return;
        }
        else if (data.text.indexOf("は？") != -1 || data.text.indexOf("は?") != -1) {
            face = faceSelect("ha?");
            motion = {
                r: [30, 50, 30, 50],
                l: [50, 30, 50, 30]
            };
        }
        else if (data.text.indexOf("114514") != -1) {
            face = faceSelect("114514");
            motion = {
                r: [90, 90, 90, 90],
                l: [150, 30, 150, 30]
            };
        }
        else {
            face = faceSelect("@");
            motion = {
                r: [30, 150, 30, 150],
                l: [150, 30, 150, 30]
            };

        }
    });
});
