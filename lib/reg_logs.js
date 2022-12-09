
// 데이터베이스 캡슐 상태 저장 (measure_result)

const express = require('express');

// module.exports = function (socket_data, mysqlConn) {
module.exports = function (arduData, mysqlConn) {
    function setTime() {
        const nowTime = new Date();
        const utc = nowTime.getTime() + (nowTime.getTimezoneOffset() * 60 * 1000);
        const KR_Time_Set = 9 * 60 * 60 * 1000;
        const kr_time = new Date(utc + (KR_Time_Set));

        let timeStemp = {
            year: kr_time.getFullYear(),
            month: kr_time.getMonth() + 1,
            day: kr_time.getDate(),
            hours: kr_time.getHours(),
            minutes: kr_time.getMinutes(),
            seconds: kr_time.getSeconds(),
        };
        let fullTimeStemp = timeStemp.year + "-" + timeStemp.month + "-" + timeStemp.day + " " + timeStemp.hours + ":" + timeStemp.minutes + ":" + timeStemp.seconds;
        if (timeStemp.minutes == 0 && timeStemp.seconds == 0) {
            return [true, fullTimeStemp];
        } else if (timeStemp.minutes%5 == 0 && timeStemp.seconds == 0){
            return [true, fullTimeStemp];
        } else {
            return [false, fullTimeStemp];
        }
    }


    function registStatusLog(data) {
        let water_temperature = data.waterTemp;
        let intensity_of_illumination = data.luxAdc;
        let turbidity = data.voltage;
        let id_data = data.capsuleName;

        let sql = 'INSERT INTO capsule_data(regist_time, capsule_name, water_temperature, intensity_of_illumination, turbidity) VALUES(?,?,?,?,?)';
        let data_set = [setTime()[1], id_data, water_temperature, intensity_of_illumination, turbidity];
        mysqlConn.query(sql, data_set,
            function (err, result) {
                if (err) {
                    console.log('insert error: ', err.message);
                } else {
                    console.log('reg success');
                }
            });
    }

    setInterval(() => {
        if(setTime()[0] == true) {
            registStatusLog(arduData);
        } 
    }, 1000);
}