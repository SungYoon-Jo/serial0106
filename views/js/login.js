// 임시
// 로그인 기능

const loginButton = document.querySelector('input.login-btn');
const id = document.querySelector('#id');
const pw = document.querySelector('#pw');

loginButton.addEventListener('click', function () {
    // db 등록

    // 
    let obj = { "device": id.value };

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: obj
        })
    });

    location.href=`/${id.value}/monitoring/detail`;
});