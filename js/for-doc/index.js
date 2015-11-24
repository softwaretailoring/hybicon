
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
    if (hovermode !== "") { setMode("hover"); }

    var clickmode = getQueryVariable("clickmode");
    if (clickmode !== "") { setMode("click"); }

    var infomode = getQueryVariable("infomode");
    if (infomode !== "") { setMode("info"); }
};

var setMode = function (mode) {
    var hybicons = document.querySelectorAll('[data-hybicon]');

    for (var i = 0; i < hybicons.length; i++) {
        var hybiconId = hybicons[i].id;
        if (hybiconId !== 'userideaheader' &&
            hybiconId !== 'checkboxHover' &&
            hybiconId !== 'checkboxClick' &&
            hybiconId !== 'iconGitHub' &&
            hybiconId !== 'iconTwitter') {
            var icon = document.getElementById(hybiconId);
            if (icon.hasAttribute('data-hybicon-' + mode + 'mode')) {
                icon.removeAttribute('data-hybicon-' + mode + 'mode');
            }
            else {
                icon.setAttribute('data-hybicon-' + mode + 'mode', '');
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

