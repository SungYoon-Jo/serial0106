// appbar 기능

window.onload = function () {
    let btn = document.querySelector("#btn");
    let sidebar = document.querySelector("app-bar");

    btn.onclick = function () {
        sidebar.classList.toggle("active");
    }
}
