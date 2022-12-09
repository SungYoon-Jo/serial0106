const express = require('express');
const app = express();

const fs = require('fs');
const mysql = require('mysql');
const path = require("path");
const bodyParser = require('body-parser');

// ////////////////////////////////////////////////////////////////////////////
// connect database

const data = fs.readFileSync('./database.json');
const dbInfo = JSON.parse(data);

const mysqlConn = mysql.createConnection({ //데이터베이스 설정
    host: dbInfo.host,
    port: dbInfo.port,
    user: dbInfo.user,
    password: dbInfo.password,
    database: dbInfo.database,
    dateStrings: true,
    multipleStatements: true
});
mysqlConn.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Connect Success!");
});

////////////////////////////////////////////////////////////////////////////////////////////
// 상속 및 외부파일 연결

app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/views'));

// ////////////////////////////////////////////////////////////////////////////
// router and server listen
SERVERPORT = 30001

const capsuleJsonData = fs.readFileSync('./capsule_data.json');
const capsule = JSON.parse(capsuleJsonData);

app.get('/', function (req, res) {
    fs.readFile('capsule_data.json', (err, data) => {
        if (err) {
            fs.readFile('views/login.html', 'utf8', function (err, data) {
                if (err) {
                    console.log('readFile Err');
                } else {
                    res.send(data);
                }
            });
        } else {
            res.redirect(`/${capsule.device_name}/monitoring/detail`);
        }
    });
});

app.post('/', function (req, res) {
    if (req.body.data.device === null) {
        console.log('x');
    } else {
        const device = {
            device_name: req.body.data.device
        }
        const deviceJsonData = JSON.stringify(device);
        fs.writeFileSync("capsule_data.json", deviceJsonData);
    }
});

app.get(`/:capsulename/monitoring/detail`, function (req, res) {
    fs.readFile('views/monitoring.html', 'utf8', function (err, data) {
        if (err) {
            console.log('readFile Err');
        } else {
            res.send(data);
        }
    });
});

app.get(`/:capsulename/monitoring/getdata`, function (req, res) {
    const capsule_name_parse = capsule.device_name;

    mysqlConn.query('select * from capsule_data where capsule_name=? AND regist_time > CURRENT_DATE()', [capsule_name_parse], function (err, results) {
        if (err) {
            console.log('err: ', err.message);
        } else {
            res.json({ data: results });
        }
    });
});

app.post(`/:capsulename/monitoring/registalert`, function (req, res) {
    const capsule_name_parse = capsule.device_name;
    let body = req.body.alertData[0];
    
    mysqlConn.query('INSERT INTO AAMS.daily_report(regist_time, capsule_name, creature, report) VALUES(?,?,?,?)',
        [body.regist_time, capsule_name_parse, body.title, body.contents],
        function (err, result) {
            if (err) {
                console.log('insert error: ', err.message);
            }
        });
});

app.get("/fishinfo", function (req, res) {
    fs.readFile('./creature_data.json', 'utf8', function (err, data) {
        if (err) {
            console.log('Cant not read fish info');
        } else {
            res.send(data);
        }
    });
});

const HTTPServer = app.listen(SERVERPORT, () => {
    console.log(`Server start -> http://127.0.0.1:${SERVERPORT}/`);
});

// ////////////////////////////////////////////////////////////////////////////
// ws 

const { DelimiterParser } = require('@serialport/parser-delimiter');
const { SerialPort } = require('serialport');
const serialPort = new SerialPort({
    path: '/dev/ttyUSB0',
    baudRate: 9600
})
    .on("error", function (err) {
        console.log(err.message);
    });

const parser = serialPort.pipe(new DelimiterParser({ delimiter: '\n' }));

setInterval(function() {
    SerialPort.list().then(function(port){
        if(port.length == 0) {
            console.log("Not connected");
        } else {
            serialPort.open();
        }
    });
}, 1000);

const wsModule = require('ws');
const webSocketServer = new wsModule.Server(
    {
        server: HTTPServer,
        //port: 30002
    }
);

let arduData = {
    capsuleName: capsule.device_name,
    voltage: 0,
    waterTemp: 0,
    luxAdc: 0
};

webSocketServer.on('connection', (ws, request) => {

    parser.on('data', (data) => {
        let dataToString = data.toString();
        arduData.luxAdc = parseString(dataToString)[0] / 100;
        arduData.waterTemp = parseString(dataToString)[1] / 100;
        arduData.voltage = parseString(dataToString)[2];

        let sendData = `{
            "capsuleName" : "${arduData.capsuleName}", 
            "water_temperature" : ${arduData.waterTemp}, 
            "intensity_of_illumination" : ${arduData.luxAdc}, 
            "turbidity" : ${arduData.voltage}
        }`;

        ws.send(sendData);
    });

    ws.on('message', (msg) => {
        console.log(`Send message : ${msg}`);
    })

    ws.on('error', (error) => {
        console.log(`Client err : ${error}`);
    })

    ws.on('close', () => {
        console.log(`Server Closed`);
    })
});

function parseString(data) {
    let resultList = [];

    let commaSplit = data.split(',');
    let voltage = commaSplit[0];
    resultList[0] = Number(voltage.split('{')[1]);
    resultList[1] = Number(commaSplit[1]);
    let luxAdc = commaSplit[2];
    resultList[2] = Number(luxAdc.split('}')[0]);

    return resultList;
}

///////////////////////////////////////////
// function

const registLog = require('./lib/reg_logs')(arduData, mysqlConn);