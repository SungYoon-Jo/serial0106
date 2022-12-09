
var url_page = String(window.location.href);
function parseURL(url, num) {
    var url_split = url.split('/');

    return url_split[num];
}

class Appbar extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = this.template();
    }

    template() {
        return `
            <div class="logo_content">
                <div class="logo">
                    <div class="logo_name">🔘 AAMS WEB</div>
                </div>
                <i class='bx bx-menu' id="btn"></i>
            </div>

            <ul class="nav_list">
                <li>
                    <a href="http://127.0.0.1:30001/${parseURL(url_page, 3)}/monitoring/detail">
                        <i class='bx bx-grid-alt'></i>
                        <span class="links_name">캡슐 모니터링</span>
                    </a>
                    <span class="tooltip">캡슐 모니터링</span>
                </li>
                <!--<li>
                    <a href="/${parseURL(url_page, 3)}/dailyreport">
                        <i class='bx bx-chat'></i>
                        <span class="links_name">캡슐일지</span>
                    </a>
                    <span class="tooltip">캡슐일지</span>
                </li>
                <li>
                    <a href="/${parseURL(url_page, 3)}/sensor">
                        <i class='bx bx-folder'></i>
                        <span class="links_name">센서기록조회</span>
                    </a>
                    <span class="tooltip">센서기록조회</span>
                </li>-->
                <li>
                <a href="http://127.0.0.1:5000/${parseURL(url_page, 3)}/camera">
                        <i class='bx bx-pie-chart-alt-2'></i>
                        <span class="links_name">촬영기록조회</span>
                    </a>
                    <span class="tooltip">촬영기록조회</span>
                </li>
            </ul>
            
            <div class="profile_content">
                <div class="profile">
                    <div class="profile_details">
                        <!--<img src="profile.jpg" alt="">-->
                        <div class="name_job">
                            <div class="name">Test User</div>
                            <div class="job">관리자</div>
                        </div>
                    </div>
                    <a href ="http://127.0.0.1:30001/"><i class='bx bx-log-out' id="log_out"></i></a>
                </div>
            </div>`;
    }
}

window.customElements.define('app-bar', Appbar);
