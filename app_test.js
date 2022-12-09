const { DelimiterParser } = require('@serialport/parser-delimiter');
const {SerialPort} = require('serialport');
const serialPort = new SerialPort({
    path: '/dev/ttyACM0',
    baudRate: 9600
});

const parser = serialPort.pipe(new DelimiterParser({delimiter:'\n'}))
parser.on('data', (data) => {
    let dataToString = data.toString();
    let voltage = parseString(dataToString)[0] / 100;
    let waterTemp = parseString(dataToString)[1] / 100;
    let luxAdc = parseString(dataToString)[2];

    console.log(voltage, waterTemp, luxAdc);
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