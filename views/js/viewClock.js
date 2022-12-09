// 시계 기능

const viewClock = document.querySelector(".clock"),
    clockTitle = viewClock.querySelector("p");

function setClock() {
    const nowTime = new Date();
    const utc = nowTime.getTime() + (nowTime.getTimezoneOffset() * 60 * 1000);
    const KR_Time_Set = 9 * 60 * 60 * 1000;
    const kr_time = new Date(utc + (KR_Time_Set));
    let year = kr_time.getFullYear();
    let month = kr_time.getMonth() + 1;
    let day = kr_time.getDate();
    const hours = kr_time.getHours();
    const minutes = kr_time.getMinutes();
    const seconds = kr_time.getSeconds();

    clockTitle.innerHTML = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day} ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

    //console.log(today);
}

function init() {
    setClock();
    setInterval(setClock, 1000);
}

init();