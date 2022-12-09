let temp_data = {
  low: 0,
  high: 0
};

fetch('/fishinfo')
  .then((response) => response.json())
  .then((json) => {
    temp_data.low = json.water_temperature_low;
    temp_data.high = json.water_temperature_high;
  });

// monitoring
const webSocket = new WebSocket("ws://127.0.0.1:30001");
const serverWebSocket = new WebSocket("ws://219.251.228.214:3000")

webSocket.onopen = () => {
  console.log("Connect Success");
};

serverWebSocket.onerror = (err) => {
  if (err) {
    location.reload();
  }
}

webSocket.onmessage = function (event) {
  let parse_data = JSON.parse(event.data);
  setSensorData(parse_data);
  serverWebSocket.send(event.data);
}

webSocket.onclose = function () {
  console.log("서버 웹소켓 연결 종료");
}

// 에러 처리
webSocket.onerror = function (event) {
  console.log(event);
}

function setSensorData(data) {
  showvalue(document.getElementById("temperature_status"), data.water_temperature);
  showvalue(document.getElementById("water_temperature_status"), data.turbidity);
  showvalue(document.getElementById("humidity_status"), data.intensity_of_illumination);
  // alertColor(temp_data.low, temp_data.high, data.water_temperature);
}

function getTime() {
  const get_time = new Date();
  const years = get_time.getFullYear();
  const month = get_time.getMonth() + 1;
  const date = get_time.getDate();
  const hours = get_time.getHours();
  const minutes = get_time.getMinutes();
  const seconds = get_time.getSeconds();

  const regist_time = `${years}-${month}-${date} ${hours}:${minutes}:${seconds}`;

  return regist_time;
}

const background = document.querySelector('.main_content');
const dataTitle = document.querySelector('.middle_line ul');
const tempData = document.querySelector('li#temperature_status');
const turbiData = document.querySelector('li#humidity_status');
const ioiData = document.querySelector('li#water_temperature_status');

function alertColor(low, high, data) {
  if (data < low || data > high) {
    if (background.style.backgroundColor === 'rgb(255, 255, 255)') {
      sendWarningAlert(low, high, data, getTime());
    }
    background.style.backgroundColor = "#AA0000";
    dataTitle.style.color = "#ffffff";
    tempData.style.color = "#ffffff";
    turbiData.style.color = "#ffffff";
    ioiData.style.color = "#ffffff";
  } else {
    if (background.style.backgroundColor === 'rgb(170, 0, 0)') {
      sendRecoverAlert(getTime());
    }
    background.style.backgroundColor = "#ffffff";
    dataTitle.style.color = "#696969";
    tempData.style.color = "#696969";
    turbiData.style.color = "#696969";
    ioiData.style.color = "#696969";
  }
}

// send alert
function sendWarningAlert(low, high, data, now) {
  const url = '/' + parseURL(url_page, 3) + '/monitoring/registalert';

  let alertData = {};
  if (data < low) {
    alertData = {
      "alertData": [
        {
          "title": "System",
          "contents": "온도가 24도 밑으로 떨어졌습니다.",
          "regist_time": now,
        }
      ]
    };
  } else if (data > high) {
    alertData = {
      "alertData": [
        {
          "title": "System",
          "contents": "온도가 27위로 올라갔습니다.",
          "regist_time": now,
        }
      ]
    };
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(alertData)
  }).then((response) => response.json());
}

function sendRecoverAlert(now) {
  const url = '/' + parseURL(url_page, 3) + '/monitoring/registalert';

  let alertData = {
    "alertData": [
      {
        "title": "System",
        "contents": "온도가 정상범위 입니다.",
        "regist_time": now,
      }
    ]
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(alertData)
  }).then((response) => response.json());
}

function showvalue(tag, value) {
  if (value == null) {
    tag.innerHTML = '0.0';
  } else {
    // 소수점 한자리 까지 표현
    tag.innerHTML = value.toFixed(2);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
// Chart space 

// URL 파싱
var url_page = String(window.location.href);
function parseURL(url, num) {
  var url_split = url.split('/');

  return url_split[num];
}

function getSensorData(url = '') {
  const response = fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(),
  });

  return response;
}

var data_set1 = [];
var data_set2 = [];
var data_set3 = [];

setInterval(function () {
  getSensorData("/" + parseURL(url_page, 3) + "/monitoring/getdata")
    .then((response) => response.json())
    .then(function (res) {
      for (let i = 0; i < res.data.length; i++) {
        data_set1.push(res.data[i]["water_temperature"]);
        data_set2.push(res.data[i]["intensity_of_illumination"]);
        data_set3.push(res.data[i]["turbidity"]);
      }
      data_set1 = [];
      data_set2 = [];
      data_set3 = [];
    })
    .catch((error) => console.log("err: ", error));

}, 1000);

// const DATA_COUNT = 24;
const labels = [0, "", "", "", "", "", "", "", "", "", "", "",
  1, "", "", "", "", "", "", "", "", "", "", "",
  2, "", "", "", "", "", "", "", "", "", "", "",
  3, "", "", "", "", "", "", "", "", "", "", "",
  4, "", "", "", "", "", "", "", "", "", "", "",
  5, "", "", "", "", "", "", "", "", "", "", "",
  6, "", "", "", "", "", "", "", "", "", "", "",
  7, "", "", "", "", "", "", "", "", "", "", "",
  8, "", "", "", "", "", "", "", "", "", "", "",
  9, "", "", "", "", "", "", "", "", "", "", "",
  10, "", "", "", "", "", "", "", "", "", "", "",
  11, "", "", "", "", "", "", "", "", "", "", "",
  12, "", "", "", "", "", "", "", "", "", "", "",
  13, "", "", "", "", "", "", "", "", "", "", "",
  14, "", "", "", "", "", "", "", "", "", "", "",
  15, "", "", "", "", "", "", "", "", "", "", "",
  16, "", "", "", "", "", "", "", "", "", "", "",
  17, "", "", "", "", "", "", "", "", "", "", "",
  18, "", "", "", "", "", "", "", "", "", "", "",
  19, "", "", "", "", "", "", "", "", "", "", "",
  20, "", "", "", "", "", "", "", "", "", "", "",
  21, "", "", "", "", "", "", "", "", "", "", "",
  22, "", "", "", "", "", "", "", "", "", "", "",
  23, "", "", "", "", "", "", "", "", "", "", ""];
// for (let i = 1; i <= DATA_COUNT; i++) {
//   labels.push(i.toString());
// }

const datapoints1 = data_set1;
const datapoints2 = data_set2;
const datapoints3 = data_set3;

const data = {
  labels: labels,
  datasets: [
    {
      label: '수온',
      data: datapoints1,
      borderColor: 'red',
      borderWidth: 1,
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.1
    }, {
      label: '탁도',
      data: datapoints2,
      borderColor: 'blue',
      borderWidth: 1,
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.1
    }, {
      label: '조도',
      data: datapoints3,
      borderColor: 'green',
      borderWidth: 1,
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.1
    }
  ]
};
const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sensor Data Graph(24H)'
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true
        }
      },
      y: {
        display: true,
        title: {
          display: false,
          text: 'Value'
        },
        suggestedMin: 0,
        suggestedMax: 50
      }
    }
  },
};

var myChart = new Chart(
  document.getElementById('data_chart'),
  config
);

// graph button
const graphButton = document.querySelector('button');
const graph = document.querySelector('.graph_display');
const mainTitle = document.querySelector('.header_line');
const underBlank = document.querySelector('._blank');

graphButton.addEventListener('click', function () {
  if (graph.style.display === 'none') {
    background.style.height = '750px';
    mainTitle.style.height = '11%';
    graph.style.display = 'block';
    underBlank.style.display = 'block';

  } else {
    background.style.height = '337px';
    mainTitle.style.height = '25%';
    graph.style.display = 'none';
    underBlank.style.display = 'none';
  }
});
