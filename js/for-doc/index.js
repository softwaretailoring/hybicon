
var setHybicons = function () {
    var iconname = getQueryVariable("hybicon");

    if (iconname !== "") {
        var icons = document.querySelectorAll('[data-hybicon]');

        for (var i = 0; i < icons.length; i++) {
            var icon = document.getElementById(icons[i].id);
            icon.setAttribute('data-hybicon', iconname);
        }

        diviconname = document.getElementById("iconname");
        diviconname.innerText = iconname;
    }

    var hovermode = getQueryVariable("hovermode");
    if (hovermode !== "") { setMode("hovermode", hovermode); }

    var clickmode = getQueryVariable("clickmode");
    if (clickmode !== "") { setMode("clickmode", clickmode); }

    var infomode = getQueryVariable("infomode");
    if (infomode !== "") { setMode("infomode", infomode); }
};

var setMode = function (mode, modevalue) {
    var hybicons = document.querySelectorAll('[data-hybicon]');
    
    for (var i = 0; i < hybicons.length; i++) {
        var hybiconId = hybicons[i].id;
        if (hybiconId !== 'userideaheader' &&
            hybiconId !== 'checkboxHover' &&
            hybiconId !== 'checkboxClick' &&
            hybiconId !== 'checkboxInfo' &&
            hybiconId !== 'iconGitHub' &&
            hybiconId !== 'iconTwitter' &&
            hybiconId !== 'iconMail') {
            var icon = document.getElementById(hybiconId);
            if (icon.hasAttribute('data-hybicon-' + mode )) {
                icon.removeAttribute('data-hybicon-' + mode );
            }
            else {
                icon.setAttribute('data-hybicon-' + mode, modevalue);
                if (mode === "infomode") {
                    icon.setAttribute('data-hybicon-infotext', 'info');
                }
            }
            new hybicon(hybiconId);
        }
    }
};

var selectSource = function (element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

var getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var queryString = query.split("&");
    for (var i = 0; i < queryString.length; i++) {
        var pair = queryString[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return ("");
};

var setStyle = function () {
    var classname = document.body.getAttribute("class");
    footer = document.getElementById("footer");
    if (classname === "styledark") {
        document.body.setAttribute("class", "stylelight");
        footer.setAttribute("class", "stylelight");
    }
    else {
        document.body.setAttribute("class", "styledark");
        footer.setAttribute("class", "styledark");
    }
};

var setGitHubSize = function () {
    var divGitHubStar = document.getElementById("divGitHubStar");
    var divGitHubFork = document.getElementById("divGitHubFork");
    var divGitHubWatch = document.getElementById("divGitHubWatch");
    var divGitHubIssue = document.getElementById("divGitHubIssue");
    var divGitHubDownload = document.getElementById("divGitHubDownload");

    var infomode = "";
    var hovermode = "";
    var currentClass = "";
    var nextClass = "";

    if (divGitHubStar.getAttribute("data-hybicon-infomode") === "") {
        infomode = "right";
        hovermode = "switch";
        currentClass = "hybicon150";
        nextClass = "hybicon30";
    }
    else {
        infomode = "";
        hovermode = "rotate";
        currentClass = "hybicon30";
        nextClass = "hybicon150";
    }

    // set infomode
    divGitHubStar.setAttribute("data-hybicon-infomode", infomode);
    divGitHubFork.setAttribute("data-hybicon-infomode", infomode);
    divGitHubWatch.setAttribute("data-hybicon-infomode", infomode);
    divGitHubIssue.setAttribute("data-hybicon-infomode", infomode);
    divGitHubDownload.setAttribute("data-hybicon-infomode", infomode);
    
    // set hovermode
    divGitHubStar.setAttribute("data-hybicon-hovermode", hovermode);
    divGitHubFork.setAttribute("data-hybicon-hovermode", hovermode);
    divGitHubWatch.setAttribute("data-hybicon-hovermode", hovermode);
    divGitHubIssue.setAttribute("data-hybicon-hovermode", hovermode);
    divGitHubDownload.setAttribute("data-hybicon-hovermode", hovermode);

    // set size
    divGitHubStar.classList.remove(currentClass);
    divGitHubFork.classList.remove(currentClass);
    divGitHubWatch.classList.remove(currentClass);
    divGitHubIssue.classList.remove(currentClass);
    divGitHubDownload.classList.remove(currentClass);

    divGitHubStar.classList.add(nextClass);
    divGitHubFork.classList.add(nextClass);
    divGitHubWatch.classList.add(nextClass);
    divGitHubIssue.classList.add(nextClass);
    divGitHubDownload.classList.add(nextClass);

    hybiconsgithub();
};