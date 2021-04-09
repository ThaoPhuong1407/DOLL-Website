var moreText = document.getElementById("more");
var btnText = document.getElementById("show");

btnText.addEventListener("click", function() {
    if (btnText.innerHTML === "Show more") {
        moreText.style.display = "block";
        btnText.innerHTML = "Show less";
    } else {
        moreText.style.display = "none";
        btnText.innerHTML = "Show more";
    }
});
