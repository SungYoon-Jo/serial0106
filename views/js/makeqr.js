var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 100,
    height: 100
});

var url_page = String(window.location.href);
function parseURL(url, num) {
    var url_split = url.split('/');

    return url_split[num];
}

makeCode();
function makeCode() {
    var base_url = `http://ky0615.synology.me:3000/${parseURL(url_page, 3)}/monitoring/detail`

    if (!base_url) {
        alert("error");
        return;
    }

    qrcode.makeCode(base_url);
}


// Modal

const body = document.querySelector('body');
const qrContent = document.querySelector('.qr_content');
const qrButton = document.querySelector('.qr_button');


qrButton.addEventListener('click', () => {
    qrContent.classList.toggle('show');

    if (qrContent.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }
});

qrContent.addEventListener('click', (event) => {
    if (event.target === qrContent) {
        qrContent.classList.toggle('show');

        if (!qrContent.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});