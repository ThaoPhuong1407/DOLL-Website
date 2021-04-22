var moreText = document.querySelectorAll('[id=more]');
var btnText = document.getElementById("show");

btnText.addEventListener("click", function() {
    if (btnText.innerHTML === "Show more") {
        moreText.forEach(function (item, index) {
            item.style.display = "block";
        });
        btnText.innerHTML = "Show less";
    } else {
        moreText.forEach(function (item, index) {
            item.style.display = "none";
        });
        btnText.innerHTML = "Show more";
    }
});
