
var setDetails = function (mode) {

    var details = "Please click the icons above for details";

    switch (mode) {
        case "hover":
            details = "Hover mode is suitable for links to navigate to other page.";
            break;
        case "click":
            details = "Click mode is fine for toggles to call a method in the page.";
            break;
        case "info":
            details = "When you want to show more. Psst... There is a <a href='github.html'>GitHub plugin</a>";
            break;
    }

    document.getElementById("details").innerHTML = details;
};

var setMode = function (mode, modevalue) {
    var hybicons = document.querySelectorAll('[data-hybicon]');

    if (modevalue === undefined) { modevalue = ""; }
    
    for (var i = 0; i < hybicons.length; i++) {
        var hybiconId = hybicons[i].id;
        if (hybiconId === 'userideamain' ||
            hybiconId === 'twittertweetmain' ||
            hybiconId === 'facebooklikemain' ||
            hybiconId === 'gplusplusmain' ||
            hybiconId === 'linkedinconnectmain' ||
            hybiconId === 'instagramfavemain' ||
            hybiconId === 'pinterestpin' ||
            hybiconId === 'githubforkmain') {
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

var createAvailableIcons = function () {

    var allhybiconstroke = document.getElementById("allhybiconstroke");
    createAvailableIconsStyle(allhybiconstroke, "stroke");

    var allhybiconfill = document.getElementById("allhybiconfill");
    createAvailableIconsStyle(allhybiconfill, "fill");

    new hybicon().parseAll();
};

var createAvailableIconsStyle = function (allhybicon, style) {
    for (var property in hybiconbase) {
        if (hybiconbase.hasOwnProperty(property)) {
            if (property !== "switch" &&
                property !== "circle" &&
                property !== "setpresets") {
                var icondiv = "<div class='col-lg-2 col-md-3 col-sm-4 col-xs-6'>";
                icondiv += "     <div data-hybicon='" + property + "' data-hybicon-style='" + style + "'></div>";
                icondiv += "     <div class='smalltitle'>" + property + "</div>";
                icondiv += "</div>";
                allhybicon.innerHTML += icondiv;
            }
        }
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
    var iconSize = 100;

    if (divGitHubStar.getAttribute("data-hybicon-infomode") === "") {
        infomode = "right";
        hovermode = "switch";
        iconSize = 32;
    }
    else {
        infomode = "";
        hovermode = "rotate";
        iconSize = 150;
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
    divGitHubStar.setAttribute("data-hybicon-size", iconSize);
    divGitHubFork.setAttribute("data-hybicon-size", iconSize);
    divGitHubWatch.setAttribute("data-hybicon-size", iconSize);
    divGitHubIssue.setAttribute("data-hybicon-size", iconSize);
    divGitHubDownload.setAttribute("data-hybicon-size", iconSize);

    new hybicongithub().parseAll();
};