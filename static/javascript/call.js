const node = document.getElementById("search");
node.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        console.log(event.target.value);
        removeInputFocus();
        setTimeout(function () {
            document.getElementById("search").style.background = "#00e676"
            document.getElementById("search").classList.add("call-animation");
        }, 1000);

    }
});

function removeInputFocus() {
    document.getElementById("search").style.width = "50px"
    document.getElementById("call-icon").classList.add("visible");
    document.getElementById("call-icon").classList.remove("hidden");
    document.getElementById('search').value = ''
    document.getElementById("search").blur();
}

document.getElementById("callButton").onclick = function () {
    if (document.getElementById("search").style.width == '200px') {
        document.getElementById("search").style.width = "50px"
        document.getElementById('search').value = ''
        document.getElementById("search").blur();
    } else {
        document.getElementById("call-icon").classList.add("hidden");
        document.getElementById("search").style.width = "200px";
        document.getElementById("search").focus();
    }
}