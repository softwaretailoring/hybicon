﻿///#source 1 1 /js/hybicon.core.js
/* ======================================================================================= */
/*                                   hybicon.core.js                                       */
/* ======================================================================================= */
/* This is a small JavaScript library for animated SVG based icons.                        */
/* Requires Raphaël JavaScript Vector Library (http://dmitrybaranovskiy.github.io/raphael/)*/
/* ======================================================================================= */
/* Check http://hybicon.softwaretailoring.net for samples.                                 */
/* Fork https://github.com/softwaretailoring/hybicon for contribution.                     */
/* ======================================================================================= */
/* Copyright © 2015-2018 Gábor Berkesi (http://softwaretailoring.net)                      */
/* Licensed under MIT (https://github.com/softwaretailoring/hybicon/blob/master/LICENSE)   */
/* ======================================================================================= */

/* ======================================================================================= */
/* Documentation: http://hybicon.softwaretailoring.net                                     */
/* ======================================================================================= */

hybicon = function (divId) {

    this.version = "1.4.0";
    this.holderId = "hybicon";

    if (divId !== undefined &&
        divId !== null) {
        this.holderId = divId;
    }

    this.holderDiv = document.getElementById(divId);

    if ((this.holderDiv === null ||
        this.holderDiv === undefined)) {
        return this;
    }
    
    //Prepare raphael's div
    var removeChildrens = [];
    for (var i = 0; i < this.holderDiv.children.length; i++) {
        if (this.holderDiv.children[i].localName === "svg") {
            removeChildrens.push(this.holderDiv.children[i]);
        }
    }

    for (var i = 0; i < removeChildrens.length; i++) {
        this.holderDiv.removeChild(removeChildrens[i]);
    }

    //Private properties
    this.icon1X = null;
    this.icon1Y = null;
    this.icon1Height = null;
    this.icon1Width = null;
    this.icon1Scale = null;
    this.icon1XAnim = null;
    this.icon1YAnim = null;
    this.icon1HeightAnim = null;
    this.icon1WidthAnim = null;
    this.icon1ScaleAnim = null;
    this.icon2X = null;
    this.icon2Y = null;
    this.icon2Height = null;
    this.icon2Width = null;
    this.icon2Scale = null;
    this.icon2XAnim = null;
    this.icon2YAnim = null;
    this.icon2HeightAnim = null;
    this.icon2WidthAnim = null;
    this.icon2ScaleAnim = null;

    //Public properties
    this.icon1Path = null;
    this.icon2Path = null;

    if (window["hybiconbase"] !== undefined) {
        this.icon1Path = hybiconbase.user;
        this.icon2Path = hybiconbase.idea;
    }

    this.icon1Stlye = "fill";
    this.icon1Color = "#222";
    this.icon1Stroke = "none";
    this.icon1StrokeWidth = 0;
    this.icon1PathAnim = null;

    this.icon1InitSettings = null;
    this.icon1Init = new this.hybiconSettings();

    this.icon1AnimSettings = null;
    this.icon1Anim = new this.hybiconSettings();

    this.icon2Stlye = "fill";
    this.icon2Color = "#222";
    this.icon2Stroke = "none";
    this.icon2StrokeWidth = 0;
    this.icon2PathAnim = null;

    this.icon2InitSettings = null;
    this.icon2Init = new this.hybiconSettings();
    
    this.icon2AnimSettings = null;
    this.icon2Anim = new this.hybiconSettings();

    this.animateTime = null;
    this.animateEasing = null;
    this.hoverMode = null;
    this.clickMode = null;
    this.clickFunction = null;
    this.hovered = false;
    this.clicked = false;
    this.infoMode = null;
    this.infoText = "HYBICON";
    this.infoFillColor = "#939393";
    this.infoStrokeColor = "#939393";
    this.infoTextColor = "#FFF";

    this.hybiconSize = 100;
    this.hybiconAlign = "center";
    this.hybiconBorder = "";
    this.hybiconBorderRadius = "";
    this.hybiconBackground = "";
    this.hybiconAlt = null;
    this.hybiconKeyCode = "32"; // default key is spacebar

    this.positioning = "topright";

    this.parseIcon();

    return this;
};

hybicon.prototype.createIcon = function () {

    var iconWidth = 100;
    var iconHeight = 100;

    var infoType = null;
    var infoSize = 0;

    if (this.infoMode !== null) {
        var infoModeParams = this.infoMode.split('-');
        if (infoModeParams.length > 1) {
            infoType = infoModeParams[0];
            infoSize = Number(infoModeParams[1]);
        }
        else {
            infoType = this.infoMode;
            if (infoType === "right") { infoSize = 200; }
        }
    }

    iconWidth += infoSize;

    // Set style of div
    if (this.hybiconSize !== "css") { // When size via JavaScript
        this.holderDiv.style.width = ((iconWidth / 100) * this.hybiconSize).toString() + "px";
        this.holderDiv.style.height = this.hybiconSize + "px";
    }

    switch (this.hybiconAlign) {
        case "left":
            this.holderDiv.style.marginRight = "auto";
            break;
        case "right":
            this.holderDiv.style.marginLeft = "auto";
            break;
        default:
            this.holderDiv.style.margin = "auto";
    }

    this.raphael = new Raphael(this.holderId);
    this.raphael.canvas.id = this.getSvgId();

    this.raphael.setViewBox(0, 0, iconWidth, iconHeight, true);

    // Set style of svg
    if (this.hybiconSize === "css") { // Responsive behaviour is possible via CSS
        this.holderDiv.firstChild.style.width = "100%";
        this.holderDiv.firstChild.style.height = "100%";
    }
    this.holderDiv.firstChild.style.border = this.hybiconBorder;
    this.holderDiv.firstChild.style.borderRadius = this.hybiconBorderRadius;
    this.holderDiv.firstChild.style.background = this.hybiconBackground;

    // Set accessibility
    if (this.hybiconAlt !== null) {
        var hybiconTitle = document.createElement("title");
        hybiconTitle.innerText = this.hybiconAlt;
        hybiconTitle.id = this.getSvgTitleId();
        this.holderDiv.firstChild.insertBefore(hybiconTitle, this.holderDiv.firstChild.firstChild);
        this.holderDiv.firstChild.setAttribute("aria-labelledby", hybiconTitle.id);
    }
    if (this.clickMode !== null) {
        this.holderDiv.firstChild.setAttribute("role", "button");
        this.holderDiv.firstChild.setAttribute("aria-pressed", "false");
    }
    else {
        this.holderDiv.firstChild.setAttribute("role", "icon");
    }

    this.setDefaultProps();

    this.icon1Transform = this.getTransformString(this.icon1X, this.icon1Y, this.icon1Scale, this.icon1Init.rotate);
    this.icon1TransformAnim = this.getTransformString(this.icon1XAnim, this.icon1YAnim, this.icon1ScaleAnim, this.icon1Anim.rotate);
    if (this.icon2Path !== null) {
        this.icon2Transform = this.getTransformString(this.icon2X, this.icon2Y, this.icon2Scale, this.icon2Init.rotate);
        this.icon2TransformAnim = this.getTransformString(this.icon2XAnim, this.icon2YAnim, this.icon2ScaleAnim, this.icon2Anim.rotate);
    }

    if (this.hoverMode !== null || this.clickMode != null) {
        this.icon1 = this.raphael.path(this.icon1Path);
        this.icon1.attr({ transform: this.icon1Transform });
        if (this.icon2Path !== null) {
            this.icon2 = this.raphael.path(this.icon2Path);
            this.icon2.attr({ transform: this.icon2Transform });
        }
    }
    else {
        this.icon1 = this.raphael.path(this.icon1PathAnim);
        this.icon1.attr({ transform: this.icon1TransformAnim });
        if (this.icon2PathAnim !== null) {
            this.icon2 = this.raphael.path(this.icon2PathAnim);
            this.icon2.attr({ transform: this.icon2TransformAnim });
        }
    }

    // Set info mode
    if (infoType !== null) {
        if (infoType === "" ||
            infoType === "bottomright") {
            this.infoFont = '100 12px Arial, Helvetica, sans-serif';
            var infobottomright = "M50,100,L100,50,L100,85,Q100,100,85,100,z";
            this.info = this.raphael.path(infobottomright);
            this.infotext = this.raphael.text(82, 82, this.infoText).attr({ transform: "r-45" });
        }

        if (infoType === "right") {
            this.infoFont = '100 50px Arial, Helvetica, sans-serif';
            var infoScaleX = (infoSize / 200);
            var infoTranslateX = ((infoSize - 200) / 2) - 3;
            var inforight = "m 297.34441,21.317398 q 0,-9.703729 -12.41277,-9.703729 l -161.36591,0 q -12.41276,0 -12.41276,9.703729 l 0,19.407449 -11.112757,9.703727 11.112757,9.703722 0,19.407453 q 0,9.703728 12.41276,9.703728 l 161.36591,0 q 12.41277,0 12.41277,-9.703728 z";
            this.info = this.raphael.path(inforight).attr({ transform: "s" + infoScaleX + ",1,T" + infoTranslateX + ",0" });
            this.infotext = this.raphael.text(100 + (infoSize / 2), 50, this.infoText);
        }

        if (this.info != null) {
            this.info.attr({ fill: this.infoFillColor, stroke: this.infoStrokeColor, 'stroke-width': 2, override: 'hidden' });
            this.infotext.attr({ font: this.infoFont, fill: this.infoTextColor, stroke: 'none' });
            this.info.id = this.getInfoId();
            this.info.node.id = this.info.id;
            this.infotext.id = this.getInfoTextId();
            this.infotext.node.childNodes[0].id = this.infotext.id;
        }
    }

    // Set style of icons
    if (this.icon1Stlye === "stroke") {
        this.icon1Stroke = this.icon1Color;
        this.icon1StrokeWidth = 1;
        this.icon1Color = "none";
    }

    if (this.icon2Stlye === "stroke") {
        this.icon2Stroke = this.icon2Color;
        this.icon2StrokeWidth = 1;
        this.icon2Color = "none";
    }

    this.icon1.id = this.getIcon1Id();
    this.icon1.node.id = this.icon1.id;
    this.icon1.attr({ fill: this.icon1Color, stroke: this.icon1Stroke, 'stroke-width': this.icon1StrokeWidth });

    if (this.icon2 !== undefined) {
        this.icon2.id = this.getIcon2Id();
        this.icon2.node.id = this.icon2.id;
        this.icon2.attr({ fill: this.icon2Color, stroke: this.icon2Stroke, 'stroke-width': this.icon2StrokeWidth });
    }

    var cursorstyle = "default";
    if (this.hoverMode !== null ||
        this.clickMode != null ||
        this.holderDiv.parentNode.tagName.toUpperCase() === "A") {
        cursorstyle = "pointer";
    }

    this.iconRect = this.raphael.rect(0, 0, iconWidth, iconHeight);
    this.iconRect.attr({ fill: "#FFF", "fill-opacity": 0, stroke: "none", cursor: cursorstyle });

    var thishybicon = this;

    if (this.hoverMode !== null) {
        this.holderDiv.addEventListener("mouseover", function (event) {
            if (thishybicon.hovered !== true &&
                thishybicon.clicked !== true) {
                thishybicon.hovered = true;
                thishybicon.animateIcon(true);
            }
        });
        this.holderDiv.addEventListener("mouseout", function (event) {
            if (thishybicon.clicked !== true) {
                thishybicon.hovered = false;
                thishybicon.animateIcon(false);
            }
        });
    }

    if (this.clickMode !== null) {
        if (this.holderDiv.parentNode.tagName.toUpperCase() !== "A" &&
            !this.holderDiv.hasAttribute("tabindex")) {
            this.holderDiv.setAttribute("tabindex", 0);
        }

        this.holderDiv.addEventListener("click", function (event) {
            thishybicon.handleMouseDown(event);
        });

        this.holderDiv.addEventListener("keydown", function (event) {
            thishybicon.handleKeyDown(event);
        });
    }

    return this;
};

hybicon.prototype.handleMouseDown = function (event) {
    this.clicked = !this.clicked;
    if (this.clickFunction !== null) { this.clickFunction(); }
    this.holderDiv.firstChild.setAttribute("aria-pressed", this.clicked ? "true" : "false");
    this.animateIcon(this.clicked);
}

hybicon.prototype.handleKeyDown = function (event) {
    event = event || window.event;
    if (event.keyCode.toString() === this.hybiconKeyCode) {
        this.handleMouseDown(event);
        event.preventDefault();
    }
}

hybicon.prototype.animateIcon = function (hovered) {
    if (hovered === true) {
        this.icon1.animate({ path: this.icon1PathAnim, transform: this.icon1TransformAnim }, this.animateTime, this.animateEasing);
        if (this.icon2PathAnim !== null) {
            this.icon2.animate({ path: this.icon2PathAnim, transform: this.icon2TransformAnim }, this.animateTime, this.animateEasing);
        }
    }
    else {
        this.icon1.animate({ path: this.icon1Path, transform: this.icon1Transform }, this.animateTime, this.animateEasing);
        if (this.icon2Path !== null) {
            this.icon2.animate({ path: this.icon2Path, transform: this.icon2Transform }, this.animateTime, this.animateEasing);
        }
    }
};

//Parse html5 data- attributes
hybicon.prototype.parseIcon = function () {
    if (this.holderDiv !== undefined &&
        this.holderDiv !== null) {
        //data-hybicon attribute is required
        var hybiconHasData = this.holderDiv.hasAttribute("data-hybicon");
        if (hybiconHasData) {

            // Set icon class
            var iconClassName = "hybiconbase";
            var hybiconClass = this.holderDiv.getAttribute("data-hybicon-iconclass");
            if (hybiconClass !== null) {
                iconClassName = hybiconClass;
            }

            var iconClass = window[iconClassName];

            if (iconClass !== undefined) {
                // set primary and secondary icons
                var hybiconData = this.holderDiv.getAttribute("data-hybicon");

                var icons = hybiconData.split("-");
                if (icons.length === 2) {
                    if (iconClass[icons[0]] !== undefined &&
                        iconClass[icons[0]] !== null) {
                        this.icon1Path = iconClass[icons[0]];
                    }
                    if (iconClass[icons[1]] !== undefined &&
                        iconClass[icons[1]] !== null) {
                        this.icon2Path = iconClass[icons[1]];
                    }
                }
                else {
                    if (iconClass[hybiconData] !== undefined &&
                        iconClass[hybiconData] !== null) {
                        this.icon1Path = iconClass[hybiconData];
                        this.icon1Init.centerX = 50;
                        this.icon1Init.centerY = 50;
                        this.icon2Path = null;
                    }
                }

                //set predefined icons
                if (iconClass.setpresets !== undefined) {
                    iconClass.setpresets(this, hybiconData);
                }
            }
            else {
                this.icon1Path = "M0,0L100,100M100,0L0,100";
                this.icon1Stroke = "#222";
                this.icon1StrokeWidth = 2;
            }

            //data-hybicon-size
            var hybiconSize = this.holderDiv.getAttribute("data-hybicon-size");
            if (hybiconSize !== null) {
                this.hybiconSize = hybiconSize;
            }

            //data-hybicon-align
            var hybiconAlign = this.holderDiv.getAttribute("data-hybicon-align");
            if (hybiconAlign !== null) {
                this.hybiconAlign = hybiconAlign;
            }

            //data-hybicon-border
            var hybiconBorder = this.holderDiv.getAttribute("data-hybicon-border");
            if (hybiconBorder !== null) {
                this.hybiconBorder = hybiconBorder;
            }

            //data-hybicon-borderradius
            var hybiconBorderradius = this.holderDiv.getAttribute("data-hybicon-borderradius");
            if (hybiconBorderradius !== null) {
                this.hybiconBorderRadius = hybiconBorderradius;
            }

            //data-hybicon-color
            var hybiconColor = this.holderDiv.getAttribute("data-hybicon-color");
            if (hybiconColor !== null &&
                hybiconColor !== "") {
                var hybiconColors = hybiconColor.split('-');
                if (hybiconColors.length > 1) {
                    this.icon1Color = hybiconColors[0];
                    this.icon2Color = hybiconColors[1];
                }
                else {
                    this.icon1Color = hybiconColor;
                    this.icon2Color = hybiconColor;
                }
            }

            //data-hybicon-style
            var hybiconStyle = this.holderDiv.getAttribute("data-hybicon-style");
            if (hybiconStyle !== null &&
                hybiconStyle !== "") {
                var hybiconStyles = hybiconStyle.split('-');
                if (hybiconStyles.length > 1) {
                    this.icon1Stlye = hybiconStyles[0];
                    this.icon2Stlye = hybiconStyles[1];
                }
                else {
                    this.icon1Stlye = hybiconStyle;
                    this.icon2Stlye = hybiconStyle;
                }
            }

            //data-hybicon-background
            var hybiconBackground = this.holderDiv.getAttribute("data-hybicon-background");
            if (hybiconBackground !== null) {
                this.hybiconBackground = hybiconBackground;
            }

            //data-hybicon-hovermode
            var hybiconHovermode = this.holderDiv.getAttribute("data-hybicon-hovermode");
            if (hybiconHovermode !== null) {
                this.hoverMode = hybiconHovermode;
            }

            //data-hybicon-clickmode
            var hybiconClickmode = this.holderDiv.getAttribute("data-hybicon-clickmode");
            if (hybiconClickmode !== null) {
                this.clickMode = hybiconClickmode;
            }

            //data-hybicon-infomode
            var hybiconInfomode = this.holderDiv.getAttribute("data-hybicon-infomode");
            if (hybiconInfomode !== null) {
                this.infoMode = hybiconInfomode;
            }

            //data-hybicon-infotext
            var hybiconInfotext = this.holderDiv.getAttribute("data-hybicon-infotext");
            if (hybiconInfotext !== null) {
                this.infoText = hybiconInfotext;
            }

            //data-hybicon-positioning
            var hybiconPositioning = this.holderDiv.getAttribute("data-hybicon-positioning");
            if (hybiconPositioning !== null &&
                hybiconPositioning !== "") {
                this.positioning = hybiconPositioning;
            }

            //data-hybicon-icon1init
            var hybiconIcon1Init = this.holderDiv.getAttribute("data-hybicon-icon1init");
            if (hybiconIcon1Init !== null) {
                this.icon1InitSettings = hybiconIcon1Init;
            }

            //data-hybicon-icon1anim
            var hybiconIcon1Anim = this.holderDiv.getAttribute("data-hybicon-icon1anim");
            if (hybiconIcon1Anim !== null) {
                this.icon1AnimSettings = hybiconIcon1Anim;
            }

            //data-hybicon-icon2init
            var hybiconIcon2Init = this.holderDiv.getAttribute("data-hybicon-icon2init");
            if (hybiconIcon2Init !== null) {
                this.icon2InitSettings = hybiconIcon2Init;
            }

            //data-hybicon-icon2anim
            var hybiconIcon2Anim = this.holderDiv.getAttribute("data-hybicon-icon2anim");
            if (hybiconIcon2Anim !== null) {
                this.icon2AnimSettings = hybiconIcon2Anim;
            }

            //data-hybicon-animtime
            var hybiconAnimatetime = this.holderDiv.getAttribute("data-hybicon-animtime");
            if (hybiconAnimatetime !== null &&
                hybiconAnimatetime !== "") {
                this.animateTime = hybiconAnimatetime;
            }

            //data-hybicon-animease
            var hybiconAnimateeasing = this.holderDiv.getAttribute("data-hybicon-animease");
            if (hybiconAnimateeasing !== null &&
                hybiconAnimateeasing !== "") {
                this.animateEasing = hybiconAnimateeasing;
            }

            //data-hybicon-alt
            var hybiconAlt = this.holderDiv.getAttribute("data-hybicon-alt");
            if (hybiconAlt !== null &&
                hybiconAlt !== "") {
                this.hybiconAlt = hybiconAlt;
            }
            
            //onmousedown event of holderdiv
            if (this.holderDiv.onmousedown !== undefined) {
                this.clickFunction = this.holderDiv.onmousedown;
                this.holderDiv.onmousedown = undefined;
            }

            //data-hybicon-keycode
            var hybiconKeyCode = this.holderDiv.getAttribute("data-hybicon-keycode");
            if (hybiconKeyCode !== null &&
                hybiconKeyCode !== "") {
                this.hybiconKeyCode = hybiconKeyCode;
            }

            this.createIcon();
        }

        var removeChildrens = [];
        for (var i = 0; i < this.holderDiv.children.length; i++) {
            if (this.holderDiv.children[i].localName !== "svg") {
                removeChildrens.push(this.holderDiv.children[i]);
            }
        }

        for (var i = 0; i < removeChildrens.length; i++) {
            this.holderDiv.removeChild(removeChildrens[i]);
        }
    }
};

hybicon.prototype.parseAll = function () {
    var hybicons = document.querySelectorAll('[data-hybicon]');

    for (var i = 0; i < hybicons.length; i++) {
        var hybiconid = hybicons[i].id;
        if (hybiconid === "")
        {
            hybiconid = hybicons[i].getAttribute("data-hybicon");
            if (hybiconid === "") { hybiconid = "hybicon"; };
            if (document.getElementById(hybiconid)) {
                thishybicon = document.getElementById(hybiconid);
                var counter = 1;
                while (thishybicon) {
                    counter++;
                    var newhybiconid = hybiconid + counter;
                    thishybicon = document.getElementById(newhybiconid);
                }
                hybiconid += counter;
            }
            hybicons[i].id = hybiconid;
        }
        new hybicon(hybiconid);
    }
};

//Set default properties
hybicon.prototype.setDefaultProps = function () {

    this.setIconSettings(this.icon1Init, this.icon1InitSettings);
    this.setIconSettings(this.icon1Anim, this.icon1AnimSettings);
    this.setIconSettings(this.icon2Init, this.icon2InitSettings);
    this.setIconSettings(this.icon2Anim, this.icon2AnimSettings);

    // default values
    var icon1SizeDefault = 77;
    var icon2SizeDefault = 33;
    if (this.icon2Path === null) {
        icon1SizeDefault = 62;
        if (this.hoverMode === "" && this.icon1Anim.size === null) { this.icon1Anim.size = 71; }
    }
    var icon1CenterXDefault = 45;
    var icon1CenterYDefault = 55;
    var icon2CenterXDefault = 80;
    var icon2CenterYDefault = 20;
    if (this.positioning === "topleft") {
        icon1CenterXDefault = 55;
        icon1CenterYDefault = 55;
        icon2CenterXDefault = 20;
        icon2CenterYDefault = 20;
    }
    if (this.positioning === "center") {
        icon1CenterXDefault = 50;
        icon1CenterYDefault = 50;
        icon2CenterXDefault = 50;
        icon2CenterYDefault = 50;
        icon2SizeDefault = 44;
    }

    if (this.icon1Init.size === null) { this.icon1Init.size = icon1SizeDefault; }
    if (this.icon1Init.centerX === null) { this.icon1Init.centerX = icon1CenterXDefault; }
    if (this.icon1Init.centerY === null) { this.icon1Init.centerY = icon1CenterYDefault; }
    if (this.icon1Init.rotate === null) { this.icon1Init.rotate = 0; }
    if (this.icon2Init.size === null) { this.icon2Init.size = 0; }
    if (this.icon2Init.centerX === null) { this.icon2Init.centerX = icon2CenterXDefault; }
    if (this.icon2Init.centerY === null) { this.icon2Init.centerY = icon2CenterYDefault; }
    if (this.icon2Init.rotate === null) { this.icon2Init.rotate = 0; }

    // handle hover and click modes
    if (this.hoverMode === "switch" ||
        this.clickMode === "switch") {
        if (this.positioning === "center") {
            if (this.icon1Anim.size === null) { this.icon1Anim.size = 0; }
            if (this.icon2Anim.size === null) { this.icon2Anim.size = icon2SizeDefault; }
        }
        else {
            this.icon1Anim.centerX = this.icon2Init.centerX;
            this.icon1Anim.centerY = this.icon2Init.centerY;
            this.icon2Anim.centerX = this.icon1Init.centerX;
            this.icon2Anim.centerY = this.icon1Init.centerY;
            if (this.icon1Anim.size === null) {
                if (this.icon2Init.size === 0) { this.icon1Anim.size = icon2SizeDefault; }
                else { this.icon1Anim.size = this.icon2Init.size; }
            }
            if (this.icon2Init.size === 0) {
                if (this.icon2Anim.size === null) { this.icon2Init.size = icon2SizeDefault; }
                else { this.icon2Init.size = this.icon2Anim.size; }
            }
            if (this.icon2Anim.size === null) { this.icon2Anim.size = this.icon1Init.size; }
        }
    }
    if (this.hoverMode === "rotate" ||
        this.clickMode === "rotate") {
        if (this.icon2Anim.size === null) { this.icon2Init.size = icon2SizeDefault; }
        else { this.icon2Init.size = this.icon2Anim.size; }

        var rotatedeg = "360";
        if (this.clickMode === "rotate") { rotatedeg = "180"; }

        if (this.icon2Path !== null) {
            if (this.icon2Anim.rotate === null) { this.icon2Anim.rotate = rotatedeg; }
        }
        else {
            if (this.icon1Anim.rotate === null) { this.icon1Anim.rotate = rotatedeg; }
        }
    }

    // set width and height
    if (this.icon1Height === null) { this.icon1Height = this.icon1Init.size; }
    if (this.icon1Width === null) { this.icon1Width = this.icon1Init.size; }
    if (this.icon2Height === null) { this.icon2Height = this.icon2Init.size; }
    if (this.icon2Width === null) { this.icon2Width = this.icon2Init.size; }

    // icon1
    var sizeTransform = this.getIconSizeTransform(this.icon1Path, this.icon1Width, this.icon1Height, this.icon1Init.centerX, this.icon1Init.centerY);
    this.icon1Scale = sizeTransform.scale;
    this.icon1X = sizeTransform.iconX;
    this.icon1Y = sizeTransform.iconY;

    if (this.icon1Anim.size === null) { this.icon1Anim.size = this.icon1Init.size; }
    if (this.icon1HeightAnim === null) { this.icon1HeightAnim = this.icon1Anim.size; }
    if (this.icon1WidthAnim === null) { this.icon1WidthAnim = this.icon1Anim.size; }
    if (this.icon1Anim.centerX === null) { this.icon1Anim.centerX = this.icon1Init.centerX; }
    if (this.icon1Anim.centerY === null) { this.icon1Anim.centerY = this.icon1Init.centerY; }
    if (this.icon1PathAnim === null) { this.icon1PathAnim = this.icon1Path; }
    if (this.icon1Anim.rotate === null) { this.icon1Anim.rotate = this.icon1Init.rotate; }

    var sizeTransformAnim = this.getIconSizeTransform(this.icon1PathAnim, this.icon1WidthAnim, this.icon1HeightAnim, this.icon1Anim.centerX, this.icon1Anim.centerY);
    this.icon1ScaleAnim = sizeTransformAnim.scale;
    this.icon1XAnim = sizeTransformAnim.iconX;
    this.icon1YAnim = sizeTransformAnim.iconY;

    // icon2
    if (this.icon2Path !== null) {
        var sizeTransform2 = this.getIconSizeTransform(this.icon2Path, this.icon2Width, this.icon2Height, this.icon2Init.centerX, this.icon2Init.centerY);
        this.icon2Scale = sizeTransform2.scale;
        this.icon2X = sizeTransform2.iconX;
        this.icon2Y = sizeTransform2.iconY;
    }

    if (this.icon2Anim.size === null) {
        if (this.icon2Init.size === 0) { this.icon2Anim.size = icon2SizeDefault; }
        else { this.icon2Anim.size = this.icon2Init.size; }
    }
    if (this.icon2HeightAnim === null) { this.icon2HeightAnim = this.icon2Anim.size; }
    if (this.icon2WidthAnim === null) { this.icon2WidthAnim = this.icon2Anim.size; }
    if (this.icon2Anim.centerX === null) { this.icon2Anim.centerX = this.icon2Init.centerX; }
    if (this.icon2Anim.centerY === null) { this.icon2Anim.centerY = this.icon2Init.centerY; }
    if (this.icon2PathAnim === null) { this.icon2PathAnim = this.icon2Path; }
    if (this.icon2Anim.rotate === null) { this.icon2Anim.rotate = this.icon2Init.rotate; }
    
    if (this.icon2PathAnim !== null) {
        var sizeTransform2Anim = this.getIconSizeTransform(this.icon2PathAnim, this.icon2WidthAnim, this.icon2HeightAnim, this.icon2Anim.centerX, this.icon2Anim.centerY);
        this.icon2ScaleAnim = sizeTransform2Anim.scale;
        this.icon2XAnim = sizeTransform2Anim.iconX;
        this.icon2YAnim = sizeTransform2Anim.iconY;
    }

    // animation
    if (this.animateTime === null) {
        if (this.hoverMode === "rotate") { this.animateTime = 400; }
        else { this.animateTime = 200; }
    }
    if (this.animateEasing === null) { this.animateEasing = "linear"; }
};

hybicon.prototype.setIconSettings = function (iconSet, iconSettings) {
    if (iconSettings !== null) {
        var iconsettings = iconSettings.split(",");
        if (iconsettings.length > 0) {
            if (iconsettings[0] !== "") { iconSet.centerX = iconsettings[0]; }
        }
        if (iconsettings.length > 1) {
            if (iconsettings[1] !== "") { iconSet.centerY = iconsettings[1]; }
        }
        if (iconsettings.length > 2) {
            if (iconsettings[2] !== "") { iconSet.size = iconsettings[2]; }
        }
        if (iconsettings.length > 3) {
            if (iconsettings[3] !== "") { iconSet.rotate = iconsettings[3]; }
        }
    }
}

hybicon.prototype.hybiconSettings = function () {
    return { centerX: null, centerY: null, size: null, rotate: null };
};

//Transform functions
hybicon.prototype.getIconSizeTransform = function (icon, iconWidth, iconHeight, centerX, centerY) {

    var transformAttrX = "";
    var transformAttrY = "";

    var bbox = Raphael.pathBBox(icon);
    var pathcenterX = bbox.cx;
    var pathcenterY = bbox.cy;
    var width = bbox.width;
    var height = bbox.height;

    //Calculate path width & height
    if (iconWidth !== null && iconHeight !== null) {
        if (height > width) {
            transformAttrX = (iconWidth / height);
            transformAttrY = (iconHeight / height);
        }
        else {
            transformAttrX = (iconWidth / width);
            transformAttrY = (iconHeight / width);
        }
    }

    var iconCenterX = centerX - pathcenterX;
    var iconCenterY = centerY - pathcenterY;

    return {
        scale: transformAttrX.toString() + "," + transformAttrY.toString(),
        iconX: iconCenterX,
        iconY: iconCenterY
    }
};

hybicon.prototype.getTransformString = function (x, y, scale, rotate) {
    return "t" + x.toString() + "," + y.toString() + "s" + scale.toString() + "r" + rotate.toString();
};

//Identifiers
hybicon.prototype.getSvgId = function () {
    return this.holderId + "-svg";
};

hybicon.prototype.getSvgTitleId = function () {
    return this.holderId + "-svgtitle";
};

hybicon.prototype.getIcon1Id = function () {
    return this.holderId + "-icon1";
};

hybicon.prototype.getIcon2Id = function () {
    return this.holderId + "-icon2";
};

hybicon.prototype.getInfoId = function () {
    return this.holderId + "-info";
};

hybicon.prototype.getInfoTextId = function () {
    return this.holderId + "-infotext";
};

//Automatic parse
document.addEventListener("DOMContentLoaded", function (event) {
    new hybicon().parseAll();
});


///#source 1 1 /js/hybicon.icons.js
/* ======================================================================================= */
/*                                   hybicon.icons.js                                      */
/* ======================================================================================= */
/* This is a small JavaScript library that hold SVG icons for hybicon.                     */
/* Requires hybicon.js (http://hybicon.softwaretailoring.net)                              */
/* ======================================================================================= */
/* Check http://hybicon.softwaretailoring.net/icons.html for samples.                      */
/* Fork https://github.com/softwaretailoring/hybicon for contribution.                     */
/* ======================================================================================= */
/* Copyright © 2015-2018 Gábor Berkesi (http://softwaretailoring.net)                      */
/* Licensed under MIT (https://github.com/softwaretailoring/hybicon/blob/master/LICENSE)   */
/* ======================================================================================= */

/* ======================================================================================= */
/* Documentation: http://hybicon.softwaretailoring.net                                     */
/* ======================================================================================= */

/* =========================== */
/* Base icons                  */
/* =========================== */

var hybiconbase = {
    "switch": "M 24.4,2.6 C 13.8,2.35 3.71,10.7 2.53,21.3 0.976,31.4 8.01,41.8 17.8,44.5 c 5.5,1.6 11.3,0.7 17,0.9 14,0 28.1,0.1 42.1,0 10.6,-0.5 20,-9.6 20.3,-20.3 C 98,14.7 89.9,4.82 79.7,3.04 74.2,2.24 68.6,2.75 63,2.6 c -12.9,0 -25.7,0 -38.6,0 z m 1.3,2.36 c 16.6,0 33.1,-0.1 49.7,0.1 9.4,0.41 18.5,7.74 19.1,17.44 1,9.2 -6.2,17.7 -15,19.7 -5.4,1.3 -10.9,0.6 -16.4,0.7 -13,0 -26,0.1 -39,0 C 14.7,42.5 5.65,35.1 4.97,25.4 4.03,16.2 11.3,7.7 20,5.68 21.9,5.2 23.8,4.96 25.7,4.96 Z",
    circle: "M 77.8,39.8 C 78.7,61.3 57.2,80.4 36,77.3 19.1,75 4,60.7 2.8,43.4 1.3,26.8 11.7,9.09 28.1,4.19 c 17.1,-5.62 38.5,2.1 46,18.91 2.4,5.2 3.9,10.9 3.7,16.7 z",
    //Author of these icons: http://dmitrybaranovskiy.github.io/raphael/
    githubalt: "m 76.4,57.2 c 0,0 0,0 0,0.1 l 0.6,0 c 0.3,0 0.7,0 1.1,0 -0.2,0 -0.3,0 -0.5,0 L 76.4,57.2 Z M 49.8,2.19 C 23.1,2.2 1.48,23.8 1.48,50.5 1.48,77.2 23.1,98.8 49.8,98.8 76.5,98.8 98.1,77.2 98.1,50.5 98.1,23.8 76.5,2.2 49.8,2.19 Z M 10,55.9 c 2.9,-0.3 6.2,-0.5 9.5,-0.5 0.9,0 1.7,0 2.4,0 0.2,0.7 0.5,1.4 0.8,2 l 0,0 c -3.1,0.1 -7,0.6 -10.7,1.2 -0.4,0.1 -0.9,0.2 -1.5,0.2 -0.2,-0.9 -0.3,-1.9 -0.4,-2.9 z m 28.6,17.4 c -0.4,0.1 -0.8,0.2 -1.2,0.4 -1.7,0.6 -2.3,0.7 -3.9,0.7 -1.7,0 -2.1,-0.1 -3.1,-0.6 C 28.9,73.1 27.5,71.9 26.6,70.3 25,67.8 22.4,66 20.2,66 c -1.9,0 -2.3,0.8 -0.9,1.9 2,1.7 3.6,3.4 4.2,4.7 0.4,0.7 0.9,1.9 1.2,2.5 0.4,0.7 1.1,1.6 1.8,2.3 1.6,1.5 3.1,2.3 5.4,2.6 1.5,0.2 1.9,0.2 3.7,0 0.9,-0.1 1.7,-0.2 2.3,-0.4 l 0,2.6 c 0,3.6 0,5.6 -0.1,6.6 C 31.6,86.9 26,83.4 21.4,78.9 16.1,73.5 12.2,66.7 10.6,59.1 13.8,58.5 17.6,58 22,57.6 l 0.7,-0.1 c 1.4,3.1 3.4,5.5 6.4,7.4 1.8,1.1 4.6,2.3 6.1,2.5 0.4,0.1 1.6,0.3 2.6,0.5 1,0.2 3,0.6 4.4,0.8 l 0,0 c 0,0.1 0,0.1 -0.1,0.1 -1.7,0.9 -2.8,2.3 -3.6,4.5 z m 5.2,16.9 c -0.6,-0.1 -1.1,-0.2 -1.7,-0.3 0.1,-1 0.1,-2.7 0.2,-5.9 0.1,-5.9 0.1,-6.5 0.5,-7.4 0.2,-0.5 0.6,-1.1 0.8,-1.2 0.3,-0.3 0.3,0.3 0.3,7.4 0,3.8 0,6 -0.1,7.4 z m 6,0.4 c -0.5,0 -1,0 -1.5,0 0.3,-1.9 0.3,-4.8 0.3,-9.7 l 0,-6.2 0.7,0.1 0.7,0.1 0.1,8 c 0.1,4.1 0.1,6.4 0.2,7.8 -0.1,0 -0.3,0 -0.5,0 z m 5.1,-0.3 c -0.1,-1.7 -0.1,-4.2 -0.1,-8.7 0.1,-6.3 0.1,-6.3 0.4,-6 0.9,0.9 1.1,2.2 1.1,8.1 0,3.1 0,5.1 0.2,6.3 -0.5,0.1 -1.1,0.2 -1.6,0.3 z M 89.1,58.7 c -0.6,-0.1 -1.1,-0.2 -1.5,-0.2 -3.3,-0.6 -6.7,-1 -9.6,-1.1 4.3,0.3 7.9,0.8 11,1.4 C 87.4,66.5 83.6,73.5 78.2,78.9 73.4,83.6 67.5,87.2 60.8,89.1 60.7,87.9 60.7,85.5 60.6,81.6 60.5,74.2 60.5,73.9 60,72.8 59.4,71.2 58.5,70 57.3,69.2 57,69 56.7,68.8 56.3,68.7 c 0.5,-0.1 0.9,-0.1 1.4,-0.2 4.8,-0.6 7.4,-1.2 9.4,-2 4.3,-1.6 7.2,-4.4 8.9,-8.3 0.1,-0.4 0.3,-0.7 0.4,-1 l 0,0 c 0.1,-0.2 0.2,-0.4 0.2,-0.4 0.1,0 0.1,-0.3 0.1,-0.5 0,-0.1 0.1,-0.6 0.2,-1.1 0.8,0 1.9,0.1 3.1,0.1 3.3,0 6.6,0.2 9.5,0.5 -0.1,1 -0.3,2 -0.5,2.9 z M 84.8,55.1 C 82.4,55 79,54.9 76.9,55 c 0.1,-0.4 0.2,-0.8 0.2,-1.2 0.3,-1.5 0.4,-3.1 0.4,-6.2 0,-4.8 -0.2,-6.1 -1.8,-9.2 -0.6,-1.3 -1.3,-2.4 -2.2,-3.4 0.8,-2.3 0.7,-5.7 -0.1,-8.8 -0.7,-2.4 -0.9,-2.6 -3.1,-2.1 -1.9,0.4 -3.5,0.9 -5.5,1.9 -0.9,0.5 -2.2,1.2 -3.1,1.8 -2.4,-0.9 -4.9,-1.4 -7.6,-1.7 -2.7,-0.3 -9.3,-0.1 -11.7,0.3 -2.3,0.4 -4.4,0.9 -6.3,1.6 -0.9,-0.6 -2.3,-1.4 -3.2,-1.9 -2,-1 -3.5,-1.5 -5.4,-2 -2.3,-0.4 -2.5,-0.3 -3.2,2.2 -0.8,3.1 -0.8,6.6 0,8.8 0.1,0.3 0.2,0.5 0.2,0.6 -3.2,4 -4.2,8.5 -3.5,14.8 0.1,1.7 0.4,3.2 0.8,4.5 -2,0 -4.9,0.1 -7,0.2 -1.6,0.1 -3.3,0.3 -4.82,0.5 C 9.76,54 9.64,52.3 9.64,50.5 9.64,39.4 14.1,29.4 21.4,22.1 28.7,14.9 38.7,10.4 49.8,10.4 c 11.1,0 21.1,4.5 28.3,11.7 7.3,7.3 11.8,17.3 11.8,28.4 0,1.7 -0.1,3.4 -0.3,5.1 -1.6,-0.2 -3.3,-0.4 -4.8,-0.5 z",
    star: "M 50.3,69.8 C 41.6,76.1 32.8,82.4 24.1,88.8 27.5,78.5 30.8,68.3 34.1,58 25.4,51.7 16.7,45.3 7.96,39 18.7,39 29.5,39 40.3,39 43.6,28.8 47,18.5 50.3,8.28 53.6,18.5 57,28.8 60.3,39 c 10.8,0 21.5,0 32.3,0 -8.7,6.3 -17.4,12.7 -26.2,19 3.4,10.3 6.7,20.5 10,30.8 C 67.7,82.4 59,76.1 50.3,69.8 Z",
    fork: "m 39.6,30.5 23.9,0 0,8 22,-12.9 -22,-12.9 0,7.7 -35.3,0 c 4.6,2.5 8.1,6.4 11.4,10.1 z M 63.5,61.4 C 61.7,60.9 59.3,59.4 56.7,56.7 51.4,51.4 45.8,42.9 39.9,35.3 33.7,28 27.5,20.7 17.8,20.4 l -10.34,0 0,10.1 10.34,0 c 2,0 5,1.5 8.5,5 5.3,5.3 10.9,13.9 16.8,21.5 5.6,6.8 11.5,13.6 20.4,14.8 l 0,7.9 22,-13 -22,-12.6 0,7.3 z",
    twitter: "M 98.5,9.79 C 94.9,11.4 91.2,12.5 87,13 91.2,10.5 94.2,6.65 95.8,1.97 92.2,4.27 87.9,5.85 83.3,6.77 79.7,2.89 74.5,0.466 68.8,0.466 58.1,0.466 49,9.29 49,20.5 c 0,1.3 0.3,2.8 0.3,4.6 C 33.1,24.2 18.5,16.2 8.74,4.15 7.13,7.12 6.09,10.5 6.09,13.9 c 0,6.9 3.6,13 8.81,16.6 -3.3,0 -6.27,-0.9 -8.92,-2.4 0,0 0,0 0,0 0,9.7 6.82,18 15.82,19.5 -1.6,0.2 -3.5,0.9 -5.2,0.9 -1.3,0 -2.5,0 -3.7,-0.7 2.5,7.9 9.8,14 18.4,14 C 24.5,67.3 16,70 6.78,70 c -1.61,0 -3.11,0 -4.77,0 8.79,5.6 19.19,8.6 30.29,8.6 36.5,0 56.5,-29.9 56.5,-55.9 0,-0.9 0,-1.9 -0.3,-2.8 4,-2.8 7.3,-6 10,-10.11 z",
    bubble: "M 50.1,1.04 C 22.9,1.04 0.771,17.5 0.771,37.9 c 0,7 2.599,13.6 7.199,19 L 0.771,72.7 20.6,67.4 c 8.2,4.6 18.6,7.4 29.5,7.4 27.1,0 49.3,-16.5 49.3,-36.9 C 99.4,17.5 77.2,1.04 50.1,1.04 Z",
    skype: "m 97,61.6 c 0.7,-3.1 1,-6.5 1,-10 C 98,25.5 77,4.31 50.8,4.31 48,4.31 45.4,4.61 42.6,5.11 38.5,2.41 33.6,0.714 28.1,0.714 13,0.714 0.8,13.2 0.8,28.3 c 0,5.1 1.3,9.9 3.7,13.7 -0.7,3.1 -1,6.2 -1,9.6 0,26.2 21.2,47.2 47.3,47.2 2.8,0 5.9,-0.4 8.6,-0.7 3.8,1.9 8.3,2.9 13.2,2.9 14.7,0 27.1,-11.8 27.1,-27 0,-4.4 -1,-8.6 -2.7,-12.4 z M 74.9,74.4 c -2,2.7 -5.5,5.4 -9.6,7.2 -4.1,1.7 -8.9,2.3 -14.8,2.3 -6.5,0 -12.4,-1 -16.9,-3.4 -3.1,-1.7 -5.7,-4.1 -7.7,-6.8 -2,-3.1 -3,-5.9 -3,-8.6 0,-1.8 0.7,-3.1 2,-4.6 1.3,-1 2.9,-1.6 4.9,-1.6 1.6,0 3.1,0.3 4.2,1.3 1,1.1 2,2.4 2.7,4.1 0.7,1.8 1.8,3.5 2.8,4.9 1,1 2,2 3.8,3 1.7,0.7 4.1,1.1 6.9,1.1 4.1,0 7.2,-0.7 9.6,-2.4 2.4,-1.7 3.4,-3.5 3.4,-5.8 0,-2.1 -0.7,-3.5 -1.7,-4.6 -1.4,-1.3 -3.1,-2 -5.1,-2.6 -2.1,-0.7 -4.9,-1.5 -8.7,-2.2 -4.8,-1.3 -8.9,-2.3 -12.4,-3.8 -3.3,-1.3 -6,-3.4 -8,-6.1 -2.1,-2.4 -3.1,-5.5 -3.1,-9.3 0,-3.5 1.1,-6.8 3.2,-9.6 2.1,-2.8 5.2,-4.8 9.3,-6.4 3.8,-1.4 8.7,-2.1 13.8,-2.1 4.1,0 7.9,0.5 11,1.4 3.1,1 5.8,2.3 7.9,3.9 2.1,1.6 3.5,3.4 4.5,5.2 1,1.8 1.3,3.6 1.3,5.5 0,1.4 -0.6,3.1 -1.6,4.5 -1.5,1.4 -3.1,2.1 -5.2,2.1 -1.7,0 -3.1,-0.7 -3.8,-1.4 -1.1,-0.7 -2.1,-2.1 -3.1,-3.8 -1,-2.1 -2.4,-4 -4.1,-5.2 -1.4,-1.2 -4.1,-1.8 -7.9,-1.8 -3.5,0 -6.2,0.6 -8.3,2 -1.7,1.3 -2.7,2.6 -2.7,4.7 0,1 0.3,1.7 1,2.7 0.7,0.7 1.4,1.4 2.7,2.1 1.1,0.7 2.4,1 3.8,1.4 1.4,0.3 3.5,1 6.6,1.7 3.8,0.7 7.2,1.7 10.3,2.7 3.1,1.1 5.9,2.1 8.2,3.5 2.1,1.7 3.8,3.5 5.3,5.8 1.3,2.1 2,4.8 2,8.3 0,3.7 -1.4,7.2 -3.5,10.7 z",
    phone: "m 72.8,60.9 c -3.5,-2 -6.2,1.4 -8.4,3.6 -3.1,2.9 -5.8,6.2 -9.1,8.7 -3.4,1.2 -5.2,-2.7 -7.4,-4.4 -7,-7.1 -14,-14.2 -21,-21.2 -2,-3.3 1.7,-5.5 3.6,-7.6 2.6,-2.7 5.7,-5.1 7.9,-8.1 C 39.6,28.4 36.2,26 34.6,23.2 29.4,16 24.4,8.44 19.1,1.19 14.3,-1.59 10.9,5.52 7.57,8.09 2.95,13.2 -0.663,19.9 0.477,26.9 1.56,53.8 18.1,79.1 41.9,91.3 c 11.7,6.1 25,9.7 38,8.7 8.3,-2.5 13.4,-10.1 18,-16.9 3.1,-2.9 0.5,-6.6 -2.7,-7.9 -7.5,-4.7 -15,-9.5 -22.4,-14.3 z",
    linkedin: "M 91.9,0.986 C 63.7,1.01 35.5,0.932 7.29,1.03 2.61,1.39 -0.172,6.21 0.471,10.6 0.497,38 0.419,65.5 0.51,93 c 0.324,4.7 5.18,7 9.49,6.8 27.6,0 55.1,0.1 82.7,0 4.7,-0.4 7.3,-5.2 6.8,-9.6 0,-27.4 0.1,-54.9 0,-82.37 C 99.1,4.06 95.7,0.929 91.9,0.986 Z M 30.7,91 c -5.1,0 -10.1,0 -15.2,0 0,-17.7 0,-35.5 0,-53.2 5.1,0 10.1,0 15.2,0 0,17.7 0,35.5 0,53.2 z M 23.2,32.1 c -7.4,0.4 -12.2,-9 -7.9,-14.9 3.8,-6.1 14.1,-5.1 16.6,1.6 2.7,6 -2.1,13.5 -8.7,13.3 z M 83.8,91 c -5,0 -10.1,0 -15.1,0 0,-11 0.1,-21.9 -0.1,-32.9 C 68,53.4 62,52.2 58.5,54.5 c -1.7,0.8 -3.3,1.6 -5,2.4 0,11.4 0,22.7 0,34.1 -5.1,0 -10.1,0 -15.2,0 0,-17.7 0,-35.5 0,-53.2 5.1,0 10.1,0 15.2,0 -1.1,4.5 3.9,0 6.2,0.6 8.8,-1.5 18.3,2.9 21.9,11.2 3.3,6.4 1.9,13.8 2.2,20.7 0,6.9 0,13.8 0,20.7 z",
    link: "M 39,54.6 C 35.6,51.2 32.1,47.7 28.7,44.3 20.5,44.8 12.9,37.8 12.7,29.6 12,20.2 21.1,11.9 30.3,13.6 c 7.7,0.9 13.6,8.2 13.3,15.9 3.3,3.4 6.6,6.9 9.9,10.3 C 59.9,26.6 53,9.53 39.8,3.61 27.8,-2.3 12,2.27 4.91,13.6 -2.57,24.4 -0.688,40.5 9.28,49.2 17.1,56.5 29.2,58.8 39.1,54.6 l -0.1,0 z m 21.4,-7.8 c 3.4,3.3 6.9,6.6 10.3,9.9 C 79.2,56.2 87.1,63.5 87,72 87.2,82.2 75.8,90.6 66.3,86.8 59.9,84.6 55.7,78 56,71.4 52.7,68 49.4,64.5 46.1,61.1 40.4,73 45.4,88.2 56.2,95.4 66.6,103 82.3,101 91,91.7 c 10,-9.3 11,-26 2.4,-36.5 -7.6,-9.8 -21.7,-13.8 -33,-8.4 z m 9.1,14.7 C 58.9,51 48.4,40.4 37.8,29.9 33.3,26.5 26.5,31.8 28.4,37 c 1.5,3.1 4.7,5.2 7,7.8 8.8,8.7 17.5,17.5 26.3,26.2 4.5,3.4 11.3,-1.8 9.4,-7.1 -0.3,-0.9 -0.8,-1.8 -1.6,-2.4 z",
    user: "M 68.1,29.5 C 69.1,24.1 70.3,18.4 68.6,13 65.9,8.37 62.2,3.93 56.7,2.73 52.4,0.905 47.5,0.522 43.1,2.15 39.4,3.97 36.9,6.02 33.3,7.78 31,11.6 30,16.1 31,20.5 c -0.4,2.8 2.7,7.6 0.3,9 -0.3,4.5 -0.5,10.6 4,13.2 -0.2,4.2 3.3,7.2 4,10.5 -2.8,1.6 -4.4,6.5 -8.6,7.6 -9.3,3.8 -18.8,7.1 -27.71,11.6 -2.371,2.4 -3.035,9.1 -1.42,11.1 32.73,0 65.43,0 98.13,0 -0.2,-4.3 1.3,-11 -4.5,-12.4 -9,-4.2 -18.5,-7.3 -27.5,-11.5 -2.8,-1.8 -3.8,-5.2 -6.1,-6.4 0.7,-3.3 3.8,-6.4 3.5,-10.5 4.6,-2.5 4.4,-8.7 4.1,-13.2 -0.4,0 -0.7,0 -1.1,0 z",
    idea: "m 17.1,88.7 21.4,0 0,-20.3 -21.4,0 0,20.3 z m 10.5,10.4 c 7.4,0 9.7,-4.3 10.5,-6.6 l -21,0 c 0.8,2.3 3.2,6.6 10.5,6.6 z m 0,-98.614 C 12.5,0.486 0.343,12.7 0.343,27.7 0.343,42.7 15.6,47 16.8,64.5 l 5,0 c 0,0 0,0 0,0 L 14,21.6 c -0.4,-1 0.4,-1.9 1.2,-2.1 0.8,-0.5 1.9,0 2.3,0.8 l 2.4,4.3 1.9,-4.3 c 0.3,-0.6 1.1,-1 1.9,-1 0.4,0 1.1,0.4 1.5,1 l 2.4,4.3 1.9,-4.3 c 0.5,-0.6 1.2,-1 2,-1 0.4,0 1.2,0.4 1.6,1 l 2.2,4.3 2,-4.3 c 0.4,-0.7 1.6,-1.2 2.4,-0.8 1.2,0.3 1.5,1.1 1.2,2.1 l -7.8,42.9 c 0,0 0,0 0,0 l 5.4,0 C 39.7,47 54.9,42.7 54.9,27.7 54.9,12.7 42.8,0.486 27.6,0.486 Z M 35.3,31.1 c -0.7,0 -1.5,-0.4 -1.8,-1.2 l -2,-4.3 -2.3,4.3 c -0.4,0.8 -1.2,1.2 -1.6,1.2 -0.8,0 -1.6,-0.4 -1.9,-1.2 l -2,-4.3 -2.3,4.3 c -0.4,0.8 -1.1,1.2 -1.5,1.2 -0.4,0 -0.4,0 -0.4,0 l 5.7,31.1 4.3,0 5.8,-31.1 c 0,0 0,0 0,0 z",
    facebook: "m 46.3,51.7 -14.2,0 0,51.3 -21.1,0 0,-51.3 -10.539,0 0,-17.7 L 11,34 11,23.5 C 11,8.95 16.7,0.45 34,0.45 l 14,0 0,17.65 -8.8,0 c -6.6,0 -7.1,2.5 -7.1,7.1 l 0,8.8 15.9,0 -1.7,17.7 z",
    chrome: "m 49,23.5 c 14.1,0 28.3,0 42.4,0 C 81.6,7.37 61.8,-1.58 43.2,1.06 29,2.83 15.9,11.3 8.25,23.4 13.2,32 18.2,40.7 23.2,49.3 23.3,35.5 35.2,23.7 49,23.5 Z m 44.7,4 c -9.9,0 -19.9,0 -29.8,0 11.8,6.9 16,23.5 9.4,35.3 C 66.4,75 59.4,87.4 52.5,99.7 72.5,98.8 90.9,84.6 96.9,65.5 101,53.1 99.9,39.1 93.7,27.5 Z M 49.6,76.8 C 39.2,77 29.7,70.2 25.2,61 18.8,49.9 12.4,38.7 5.95,27.6 -3.71,45.5 -0.313,69.2 13.8,83.9 22.4,93.3 34.8,99 47.5,99.7 52.4,91 57.2,82.3 62.1,73.6 58.3,75.8 53.9,76.8 49.6,76.8 Z M 27.4,50 C 27.1,62.5 38.8,73.8 51.4,72.5 63.2,72 73.1,60.7 72.2,48.9 72,35.6 58.1,25.1 45.3,28.1 35.2,30.1 27.2,39.7 27.4,50 Z",
    opera: "M 47.3,0.645 C 20.2,0.645 0.615,20.2 0.615,49.4 0.615,75.8 19.6,99.6 47.3,99.6 75.2,99.6 94,75.8 94,49.4 94,19.9 74,0.645 47.3,0.645 Z m 0,88.055 0,0 C 39,88.7 34.7,83.1 32.2,75.4 31.1,71.4 30.7,67.5 30.4,63.2 30,58.1 29.7,53 29.7,48.8 c 0,-3.6 0.3,-7.3 0.3,-10.5 0.4,-6.5 1.5,-12.5 3.3,-17.7 2.5,-6.2 6.8,-10.2 14,-10.2 9,0 13.4,6.4 15.5,15.7 1.9,6.8 2.3,14.7 2.3,22.7 0,8.2 -0.4,18.7 -3,26.6 -2.1,8 -6.9,13.3 -14.8,13.3 z",
    firefox: "m 93.3,70.6 c 1.7,-3.4 3.2,-6.9 3.9,-10.7 2.8,-13 2.4,-24.1 2.4,-24.1 l -1.4,7.7 c 0,0 -1.4,-13.7 -3.5,-18.9 -3.1,-7.8 -4.6,-7.8 -4.6,-7.8 2.2,4.8 1.8,7.6 1.8,8 0,0 0,0 0,-0.3 -0.7,-0.9 -2.8,-6.2 -8,-9.9 C 75.1,5.93 63.2,0.63 50,0.63 c -14.4,0 -27,6 -35.8,15.77 -1.1,-1.7 -2.1,-3.6 -2.2,-5.8 0,0 0,0 0,0 0,0 0,0 0,0 0,0 -5.61,4.4 -5.01,16.2 -1,2.1 -1.9,4.2 -2.7,6.3 -1.3,2.8 -2.6,7 -3.697,12.9 0,0 0.497,-1.4 1.397,-3.2 -0.3,1.4 -0.3,3.2 -0.4,5 -0.3,3 -0.4,6.5 0,10.7 0,0 0,-1.3 0.5,-3.5 2.9,23.9 23.31,42.7 48.01,42.7 l 0,0 c 6.7,0 12.6,-1.4 18.6,-3.9 C 81.3,89.3 89,80.2 93.5,70.7 Z M 50,3.73 c 8.3,0 16.4,2.4 23.4,6.57 -8,-1.77 -12.2,-0.97 -11.9,-0.87 0,0 11.5,1.97 13.6,4.87 0,0 -4.9,0 -9.7,1.5 -0.4,0 18.1,2.3 21.9,21 0,0 -2,-4.5 -4.5,-5.2 1.8,5.2 1.5,14.6 -0.4,19.6 0,0.3 -0.3,-2.9 -3.5,-4.3 1.2,7 0,18.5 -4.8,21.7 -0.4,0 3.1,-11.2 0.7,-7 -14.3,22 -31.5,9 -38.5,4.2 5.6,1.4 11.5,0.7 15,-1.7 3.5,-2.5 5.3,-4.2 7.4,-3.9 1.8,0.7 2.8,-1.4 1.4,-2.8 -1.4,-1.7 -4.9,-3.9 -9.5,-2.8 -3.1,1.1 -7.3,4.6 -13.6,0.7 -5.2,-3.1 -5.2,-5.6 -5.2,-7.3 0,-1.1 1,-2.8 2.4,-3.5 2.1,0.3 3.9,0.7 5.6,1.7 0,-0.7 0,-1 0,-1.7 0,-0.4 0,-1 -0.3,-2.1 0,-1.1 -0.4,-2.1 -0.7,-3.1 0.3,0 0.3,0 0.3,0 0,-1.1 7.4,-5.3 8,-6 0.4,-0.3 1.8,-1 1.8,-3.8 0,-1.1 -0.3,-1.1 -8,-1.1 -3.2,0 -4.9,-3.2 -5.3,-4.5 0.7,-4.2 2.8,-7.3 6.7,-9.4 0,0 0,0 0,0 0.7,-0.5 -9.1,0 -13.3,5.6 -1.2,0.4 -2.8,0 -4.5,0 -2.3,0 -4.1,0.4 -5.6,0.7 -0.4,0 -0.4,0 -0.7,0 -0.5,-0.6 -1.1,-1.3 -2,-2 C 16.9,18.2 17.4,17.6 18,17 26.2,8.83 37.4,3.73 50,3.73 Z",
    safari: "m 44.3,12.3 c -1.7,0 -3.5,0 -5.2,0.3 l -0.4,-0.7 c 0,-0.4 0,-0.7 -0.3,-1 1.4,-1.01 2,-2.61 2,-4.51 0,-3.3 -2.4,-5.897 -5.5,-5.897 -3.5,0 -6,2.597 -6,5.897 0,2.6 1.8,4.81 3.9,5.51 0,0.5 0,0.9 0,1.3 l 0.3,0.5 C 14.3,18.6 0.532,35.6 0.532,56 0.532,79.8 20.1,99.4 44.3,99.4 68.2,99.4 87.8,79.8 87.8,56 87.8,31.8 68.2,12.3 44.3,12.3 Z M 45,22.7 c 15.4,0 28.7,10.8 31.9,25.6 l -2,0.7 c -0.4,-2.5 -2.5,-4.2 -5.4,-4.2 -2.7,0 -5.2,2.4 -5.2,5.2 0,0.4 0,0.7 0,1 L 54.9,50.7 C 54.5,50.4 54.5,50 54.2,49.7 L 66,31.8 66,31.4 49.5,45.8 c -1.3,-0.7 -2.7,-1 -4.2,-1 l 0.4,0 -4.2,-9.2 c 2.5,-0.7 3.8,-2.8 3.8,-4.9 0,-3.1 -2,-5.5 -5.2,-5.5 0,0 -0.3,0 -0.7,0 L 39.8,23 c 1.7,-0.3 3.5,-0.4 5.2,-0.4 z M 30,6.39 c 0,-2.6 2.1,-4.6 4.9,-4.6 2.4,0 4.5,2 4.5,4.6 0,1.4 -0.7,2.8 -1.7,3.6 -0.7,-0.4 -1.4,-0.6 -2.5,-0.4 -0.7,0 -1.4,0.61 -1.7,1.21 C 31.4,10.2 30,8.49 30,6.39 Z M 12.1,55.6 c 0,-15.8 10.8,-28.8 25.6,-32.1 l 1,2 c -2.1,0.7 -3.8,2.7 -3.8,5.2 0,2.8 2.4,5.3 5.2,5.3 0.3,0 0.7,0 0.7,0 l 0,9.8 0,0 C 39.4,46.5 38,47.5 37,49 l 0.3,-0.7 -5.6,-2.1 4.2,4.5 0,-0.3 c -0.7,1.3 -1,2.8 -1,4.5 l 0,-0.3 -9.1,4.5 c -0.8,-2.4 -2.9,-3.8 -5.2,-3.8 -2.9,0 -5.3,2.4 -5.3,5.3 0,0.3 0,0.7 0,0.7 L 12.6,60.9 C 12.3,59.1 12.1,57.4 12.1,55.6 Z M 45,88.3 C 29.3,88.3 16.4,77.4 12.9,63 l 2.5,-1.4 c 0.5,2.5 2.7,4.2 5.2,4.2 3,0 5.5,-2.1 5.5,-5.2 0,-0.4 -0.3,-0.8 -0.3,-1.1 l 10.1,0 c 0,0.3 0.4,0.7 0.4,1.1 L 24.3,79.1 25,78.4 40.8,64.8 c 1.5,0.3 2.5,0.7 3.9,1 l 0,0 4.2,9.1 c -2.1,0.3 -3.9,2.5 -3.9,5.3 0,2.8 2.5,5.3 5.3,5.3 0.4,0 0.7,0 0.7,-0.4 l 0,2.4 c -1.8,0.5 -3.9,0.8 -6,0.8 z m 8.1,-1.1 -1.4,-2.1 c 2,-0.3 3.9,-2.5 3.9,-4.9 0,-3.1 -2.5,-5.6 -5.3,-5.6 -0.4,0 -0.4,0 -0.8,0 l 0,-9.8 0,0 C 51,64.1 52.4,63 53.1,61.9 l 5.6,2.5 -3.8,-4.6 c 0.3,-1.4 0.7,-2.7 0.7,-3.8 l 9,-4.3 c 0.7,2.2 2.9,3.9 4.9,3.9 3.2,0 5.7,-2.4 5.7,-5.6 0,0 -0.3,-0.3 -0.3,-0.7 l 2.4,0.7 c 0.3,1.7 0.3,3.5 0.3,5.6 0,15.1 -10.5,28 -24.5,31.6 z",
    ie9: "m 99.6,57.3 c 0,-1.6 0,-3.7 0,-5.2 0,-7.2 -1.7,-13.7 -4.4,-19.7 4.4,-11.7 4.4,-21.7 -0.9,-27.26 -7.2,-7.3 -21.7,-5.605 -37.8,2.9 -0.4,0 -0.7,0 -1.1,0 -24.2,0 -44.1,19.56 -44.1,44.06 0,0.8 0,1.2 0,1.9 -10.802,16.5 -14.1,32.3 -6.8,39.5 6.3,6.4 18.9,5.6 33.1,-1.6 5.2,2.5 11.7,4 17.7,4 19.3,0 35.8,-12.5 41.8,-29.4 l -23.7,0 c -3.6,6.1 -10.1,10.1 -17.3,10.1 -10.8,0 -19.7,-8.4 -19.7,-18.9 0,0 0,-0.4 0,-0.4 l 63.2,0 0,0 z M 93.5,9.84 c 3.7,3.76 3.3,10.76 0,19.36 C 88.3,20.9 80.3,14.3 71,10.7 81,6.34 89.5,5.64 93.5,9.84 Z M 55.8,27.2 c 10,0 18.4,8 19.2,18 l -38.2,0 c 0.4,-10 8.9,-18 19,-18 z M 10.6,91.9 c -4.4,-4.5 -2.9,-14 3.2,-25.4 3.6,10.1 11,19 20.6,23.8 -10.8,5.2 -19.6,6 -23.8,1.6 z",
    ie: "M 91.8,3.05 C 84.1,-3.85 66.6,4.55 56.7,10.2 54.2,9.75 51.2,9.45 47.9,9.45 c -12,0 -22,3.65 -29.5,10.45 -8.53,7.8 -13.23,18 -13.23,29.8 0,0.3 0,0.3 0,0.3 C 17.2,31.2 35.5,21.6 40.6,19.1 c 0.7,-0.3 1.1,0.6 0.4,0.9 0,0 0,0 0,0 -8.1,4.9 -23.4,19 -33.43,39.9 l 0,0 C 1.37,72.7 -3.93,91 6.67,97.6 14.7,103 28.9,96.9 40.6,89.1 c 3,0.4 5.9,0.8 8.9,0.8 21.4,0 36.4,-12.1 41.6,-29.2 l -29.3,0 c -1,6.2 -5.5,9.4 -11.6,9.4 -8.1,0 -14,-4.4 -14.3,-14.6 L 91.8,55.1 C 91.8,53.3 91.4,51.8 91.4,50 91.4,30.9 80.1,15.9 61.5,11.2 69.2,6.35 83.1,-0.55 89.9,4.95 c 5.2,4.2 2.6,12.95 1.2,16.55 0,1 1,1.1 1,0 C 94.7,15.3 95.4,6.45 91.8,3.05 Z M 38,88.7 c -9.1,5.6 -21.4,9.2 -27.6,4.9 -4.53,-3.7 -2.53,-12.9 1.4,-22 2.5,3.7 5.6,7 9.1,9.8 4.8,3.7 10.6,5.9 17.1,7.3 z M 35.9,42.3 c 0.3,-8.7 6.6,-12.5 13.1,-12.5 7.3,0 12.8,4.1 12.8,12.5 l -25.9,0 z",
    download: "M 83.8,26.7 C 84.3,26 84.3,25.2 84.3,24.4 84.3,11.2 73.5,0.518 60.1,0.518 49.7,0.518 41.3,7.02 37.8,16 c -2.3,-2.3 -5.7,-3.8 -9.1,-3.8 -6.9,0 -12.3,5.3 -12.3,12.2 0,0.8 0,1.6 0.3,2.3 C 7.6,28.3 0.598,35.9 0.598,45.5 0.598,56.3 9.3,64.7 19.9,64.7 l 13.1,0 -2.7,-2.6 c -1.8,-1.6 -2.6,-3.5 -2.6,-5.5 0,-1.9 0.8,-3.8 2.5,-5.4 L 32.1,49 c 1.5,-1.6 3.8,-2.4 5.7,-2.4 0,0 0,0 0.4,0 l 0,-1.8 c 0,-4.2 3.5,-7.7 7.7,-7.7 l 12.2,0 c 4.2,0 7.7,3.5 7.7,7.7 l 0,1.8 c 0.5,0 0.5,0 0.5,0 1.8,0 4.2,0.8 5.6,2.4 l 2,2.2 c 3.1,3.1 3.1,7.8 0,10.9 l -2.7,2.6 9.1,0 c 10.8,0 19.3,-8.4 19.3,-19.2 0,-9.2 -6.6,-17.2 -15.8,-18.8 z m -12.6,27.2 -2,-2.2 C 67.7,50.1 65.4,50.1 64.3,51.2 63.2,52.4 62,51.7 62,49.7 l 0,-4.9 C 62,42.8 60.5,41 58.1,41 L 45.9,41 C 43.6,41 42,42.8 42,44.8 l 0,4.9 c 0,2 -1.1,2.7 -2.3,1.5 -1.1,-1.1 -3.4,-1.1 -4.9,0.5 l -2,2.2 c -1.5,1.6 -1.5,3.9 0,5.4 l 16.6,16.5 c 0.7,0.8 1.4,1.2 2.7,1.2 1.1,0 1.8,-0.4 2.6,-1.2 L 71.2,59.3 c 1.5,-1.5 1.5,-3.8 0,-5.4 z",
    upload: "M 83.8,26.7 C 84.3,26 84.3,25.2 84.3,24.4 84.3,11.2 73.5,0.518 60.1,0.518 49.7,0.518 41.3,7.02 37.8,16 c -2.3,-2.3 -5.7,-3.8 -9.1,-3.8 -6.9,0 -12.3,5.3 -12.3,12.2 0,0.8 0,1.6 0.3,2.3 C 7.6,28.3 0.598,35.9 0.598,45.5 0.598,56.3 9.3,64.7 19.9,64.7 l 8.8,0 c -0.7,-1.2 -1,-1.9 -1,-3.1 0,-2.3 0.8,-4.2 2.5,-5.7 L 46.6,39.4 c 1.5,-1.5 3.5,-2.3 5.5,-2.3 1.8,0 3.8,0.8 5.3,2.3 l 16.5,16.5 c 1.5,1.5 2.2,3.4 2.2,5.7 0,1.2 0,1.9 -0.7,3.1 l 4.9,0 C 91.1,64.7 99.6,56.3 99.6,45.5 99.6,36.3 93,28.3 83.8,26.7 Z M 54.7,42.1 C 53.9,41.3 53.2,41 52.1,41 c -1.3,0 -2,0.3 -2.7,1.1 L 32.8,58.6 c -1.5,1.5 -1.5,4.2 0,5.7 l 2,2 c 1.5,1.4 3.8,1.8 4.9,0.7 1.2,-1.6 2.3,-0.7 2.3,1.5 l 0,4.7 c 0,2.2 1.6,3.8 3.9,3.8 l 12.2,0 c 2.4,0 3.9,-1.6 3.9,-3.8 l 0,-4.7 c 0,-2.2 1.2,-3.1 2.3,-1.5 1.1,1.1 3.4,0.7 4.9,-0.7 l 2,-2 c 1.5,-1.5 1.5,-4.2 0,-5.7 L 54.7,42.1 Z",
    question: "M 50.1,0.593 C 22.7,0.593 0.593,22.7 0.593,50.1 0.593,77.4 22.7,99.6 50.1,99.6 77.4,99.6 99.6,77.4 99.6,50.1 99.6,22.7 77.4,0.593 50.1,0.593 Z m 4.5,78.207 -9.2,0 0,-8.9 9.2,0 0,8.9 z m 0,-18.5 0,3.1 -9.2,0 0,-3.8 C 45.4,48.8 58,47 58,39.2 c 0,-3.4 -3.4,-6.1 -7.5,-6.1 -4.1,0 -7.9,3.1 -7.9,3.1 l -5.4,-6.5 c 0,0 5.1,-5.3 14.3,-5.3 8.1,0 16.3,5.2 16.3,14.1 0,12.3 -13.2,13.6 -13.2,21.8 z",
    checkbox: "m 93.1,99.6 -86.01,0 c -3.6,0 -6.497,-3 -6.497,-6.5 l 0,-86.01 c 0,-3.6 2.897,-6.497 6.497,-6.497 l 86.01,0 c 3.5,0 6.5,2.897 6.5,6.497 l 0,86.01 c 0,3.5 -3,6.5 -6.5,6.5 z m -79.6,-12.9 73.2,0 0,-73.2 -73.2,0 0,73.2 z",
    view: "M 50,0.679 C 22.4,0.679 0.693,28.9 0.693,28.9 0.693,28.9 22.4,57 50,57 71.1,57 99.3,28.9 99.3,28.9 99.3,28.9 71.1,0.679 50,0.679 Z M 50,46.4 c -9.5,0 -17.5,-8 -17.5,-17.5 0,-9.9 8,-17.5 17.5,-17.5 9.5,0 17.5,8 17.5,17.5 0,9.5 -8,17.5 -17.5,17.5 z m 0,-27.7 c -5.5,0 -10.2,4.7 -10.2,10.2 0,5.8 4.7,10.3 10.2,10.3 5.8,0 10.3,-4.5 10.3,-10.3 0,-5.5 -4.5,-10.2 -10.3,-10.2 z",
    noview: "m 33.6,46.9 c -0.8,-1.8 -1.1,-3.6 -1.1,-5.8 0,-9.5 8,-17.5 17.5,-17.5 2.2,0 4,0.3 5.8,1.1 l 8.4,-8.4 C 59.1,14.3 54.3,12.9 50,12.9 22.4,12.9 0.693,41.1 0.693,41.1 c 0,0 7.997,10.3 20.207,18.2 L 33.6,46.9 Z M 77.3,23.6 66.5,34.5 c 0.7,2.3 1,4.4 1,6.6 0,9.4 -8,17.5 -17.5,17.5 -2.2,0 -4.4,-0.4 -6.6,-1.1 l -8.7,8.8 c 4.7,1.8 9.8,2.9 15.3,2.9 21.1,0 49.3,-28.1 49.3,-28.1 0,0 -9.5,-9.5 -22,-17.5 z M 84.7,0.701 9.39,76.1 14.5,81.2 90.2,5.8 84.7,0.701 Z",
    book: "m 79,9.2 c -2.9,-1.31 -5.6,1 -8.3,1.7 C 56.1,16.4 41.6,22 27,27.5 20.7,29.1 13.5,28.7 7.65,25.5 13.4,23 19.7,20.8 25.6,18.5 34.4,15.1 43.1,11.8 51.9,8.4 54.2,9.2 56.4,10 58.7,10.8 58.6,8.18 58.9,5.52 58.6,2.91 57.4,-0.539 53.7,0.645 51.3,1.79 35.9,7.7 20.4,13.5 5.02,19.5 c -3.13,1 -5.149,4.1 -4.671,7.3 0.04,21.5 -0.08,42.9 0.06,64.3 1.608,4.8 7.278,6.5 11.788,7.7 7.1,1.2 14.8,1.1 21.5,-2 14.8,-5.7 29.7,-11.4 44.5,-17.1 2.8,-1.5 1.5,-5 1.8,-7.6 0,-20.4 0,-40.7 0,-61 C 79.9,10.3 79.5,9.67 79,9.2 Z M 3.35,35.8 c 0.34,4.8 5.76,6.1 9.65,7.1 4.8,1 9.9,1.3 14.6,-0.3 0,2.2 0,4.5 0,6.7 C 19.5,51 10.7,50 3.45,46 3.38,42.6 3.58,39 3.35,35.8 Z M 20.4,84.3 c -5.9,0 -11.86,-1.2 -17.05,-4.1 0,-3.4 0,-6.7 0,-10.1 0.43,5.2 6.57,6.1 10.75,7.1 4.4,0.9 9.2,1.3 13.5,-0.4 0,2.3 0,4.5 0,6.8 -2.4,0.4 -4.8,0.7 -7.2,0.7 z",
    search: "M 99.2,85.6 72.6,59.2 c 3.7,-5.9 5.9,-12.6 5.9,-20 C 78.5,17.6 61,0.182 39.5,0.182 17.9,0.182 0.488,17.6 0.488,39.2 c 0,21.5 17.412,39 39.012,39 7.4,0 14.1,-2.2 20,-5.9 L 85.9,98.9 99.2,85.6 Z M 15.3,39.2 C 15.3,25.8 26.1,15 39.5,15 52.9,15 63.6,25.8 63.6,39.2 63.6,52.6 52.9,63.3 39.5,63.3 26.1,63.3 15.3,52.6 15.3,39.2 Z",
    code: "M 29.4,0.785 0.85,29.3 29.4,57.6 39.6,47.4 21.7,29.3 39.6,11.2 29.4,0.785 Z m 41.8,0 L 60.7,11.2 78.8,29.3 60.7,47.4 71.2,57.6 99.5,29.3 71.2,0.785 Z",
    fave: "M 91.9,8.15 C 81.2,-2.55 63.2,-2.05 52.1,9.25 l -1.9,1.85 -2,-1.85 C 37.1,-2.05 19,-2.55 8.3,8.15 -2.4,18.9 -1.9,36.9 9.5,48 L 50.2,88.8 90.9,48 C 102,36.9 102,18.9 91.9,8.15 Z",
    plus: "m 99.6,33.7 -33.1,0 0,-33.06 -33.2,0 0,33.06 -32.707,0 0,33.1 32.707,0 0,32.6 33.2,0 0,-32.6 33.1,0 z",
    minus: "m 99.6,0.691 -99.007,0 0,33.209 99.007,0 z",
    check: "M 0.645,30.8 11.2,20.3 40.4,49.1 88.6,0.898 99.1,11.5 40.4,70.5 Z",
    cross: "M 99.3,82.5 66.8,50 99.3,17.6 82.1,0.893 49.7,33.5 17.2,0.893 0.788,17.6 33.1,50 0.788,82.5 17.2,99.1 49.7,66.6 82.1,99.1 Z",
    arrowright: "M 16.3,97.6 82.8,59.1 c 8.3,-4.9 8.3,-13.2 0,-17.9 L 16.3,2.77 C 7.48,-2.33 0.574,1.87 0.574,11.7 l 0,77.1 c 0,9.4 6.906,13.2 15.726,8.8 z",
    gear: "M 86.9,52.1 99.4,45.4 C 99.4,43 98.7,40.7 98,38.3 l -13.8,-2 C 82.8,33.2 81.1,30.5 79.5,28 L 84.8,14.7 C 82.8,13.1 81.1,11.5 79.2,10 L 66.9,17.6 C 64.3,16 61.2,14.9 57.8,14.2 l -4,-13.36 c -1.3,0 -2.7,-0.4 -3.7,-0.4 -1.4,0 -2.8,0 -3.8,0.4 L 42,14.1 c -3.4,0.7 -6.4,1.8 -9.1,3.3 L 20.9,10 c -2,1.5 -3.9,3.1 -5.7,4.7 l 5.2,13 c -2,2.5 -3.8,5.5 -5,8.6 l -13.56,2 c -0.7,2.4 -1.2,4.7 -1.4,7.1 l 12.16,6.4 c 0,3.7 0.8,6.7 1.8,10.1 L 5.14,72 c 1.1,2.3 2.3,4.4 3.6,6.4 l 13.66,-3 c 2.3,2.7 4.9,4.7 7.8,6.4 l -0.7,13.9 c 2.4,1 4.7,1.9 7.1,2.7 L 45,87.2 c 1.7,0.4 3.1,0.4 4.7,0.4 1.7,0 3.4,0 5.1,-0.4 l 8.8,11.2 c 2.3,-0.8 4.7,-1.7 6.7,-2.7 L 70,81.5 c 2.7,-1.7 5,-3.8 7.1,-6.1 l 14.2,3 c 1.3,-2 2.3,-4.1 3.4,-6.4 L 85.2,61.5 c 1,-3 1.3,-6 1.7,-9.4 z m -21.3,16.2 -6.1,4.1 -3.6,-5.8 c -1.8,0.7 -4.2,1.1 -6.2,1.1 -9.4,0 -17.1,-7.8 -17.1,-17.3 0,-9.4 7.7,-17.2 17.1,-17.2 9.4,0 17.2,7.8 17.2,17.2 0,4.7 -1.6,9.2 -5,12.1 l 3.7,5.8 z",
    refresh: "m 85.3,50.1 c 0,19.2 -16,35.2 -35.2,35.2 -19.3,0 -35.2,-16 -35.2,-35.2 0,-19.2 15.9,-35.2 35.2,-35.2 7.7,0 15.1,2.6 20.8,7 l -7.3,7.3 34.3,9 L 89,3.9 81.1,11.6 C 72.6,4.8 62,0.598 50.1,0.598 22.8,0.698 0.598,22.8 0.598,50.1 0.598,77.5 22.8,99.6 50.1,99.6 77.5,99.6 99.6,77.5 99.6,50.1 l -14.3,0 z",
    icons: "m 0.598,43.6 43.002,0 0,-43.002 -43.002,0 0,43.002 z M 56.6,0.598 l 0,43.002 43,0 0,-43.002 -43,0 z m 0,99.002 43,0 0,-43 -43,0 0,43 z m -56.002,0 43.002,0 0,-43 -43.002,0 0,43 z",
    //Author of like icon: http://designmodo.com/linecons-free
    like: "m 90.4,32.9 c -4,-1.2 -12.9,-1.2 -26.2,-1.6 0.6,-2.7 0.6,-5.3 0.6,-10 0,-11.1 -8.1,-20.76 -15.1,-20.76 -4.9,0 -9.2,4 -9.2,9.2 0,6.16 -1.9,16.86 -12.3,22.26 -0.8,0.6 -3,1.5 -3.3,1.8 l 0,0 c -1.5,-1.5 -3.7,-2.5 -6.1,-2.5 l -9.06,0 c -5.2,0 -9.3,4.1 -9.3,9.3 l 0,49.2 c 0,5.4 4.1,9.3 9.3,9.3 l 9.06,0 c 3.7,0 6.9,-2.1 8.3,-5.2 0,0 0,0 0.4,0 0.3,0 0.4,0 0.7,0 0,0.3 0,0.3 0.3,0.3 1.8,0.3 5.2,1.3 12.6,2.8 1.6,0.3 9.5,2.1 18.2,2.1 l 17,0 c 5.2,0 8.8,-1.8 11,-5.8 0,0 0.6,-1.6 1.2,-3.5 0.3,-1.5 0.6,-3.3 0,-5.5 3.4,-2.1 4.4,-5.5 5.3,-7.6 0.9,-3.8 0.6,-6.6 0,-8.7 1.9,-1.6 3.4,-4.3 4,-8.3 0.3,-2.9 0,-5.3 -1.2,-7.4 1.8,-1.9 2.4,-4.3 2.7,-6.8 l 0,-0.6 c 0,-0.3 0,-0.6 0,-1.5 0,-4 -2.7,-9 -8.6,-10.5 z M 21.9,89.8 c 0,1.9 -1.3,3.2 -3.1,3.2 l -9.06,0 c -1.8,0 -3.2,-1.3 -3.2,-3.2 l 0,-49.2 c 0,-1.8 1.4,-3.1 3.2,-3.1 l 9.06,0 c 1.8,0 3.1,1.3 3.1,3.1 l 0,49.2 z m 71,-44.6 c 0,1.5 -0.7,4.6 -6.2,4.6 -4.6,0 -6.2,0 -6.2,0 -0.9,0 -1.5,0.6 -1.5,1.5 0,1 0.6,1.6 1.5,1.6 0,0 1.3,0 5.9,0 4.6,0 5.2,3.6 4.9,5.6 -0.3,2.4 -1.3,6.7 -6.5,6.7 -5.2,0 -7.3,0 -7.3,0 -0.9,0 -1.6,0.6 -1.6,1.6 0,0.9 0.7,1.5 1.6,1.5 0,0 3.7,0 6.1,0 5.2,0 4.6,4 4,6.4 -1.2,3.2 -1.5,5.9 -8.3,5.9 -2.1,0 -5,0 -5,0 -0.9,0 -1.5,0.7 -1.5,1.6 0,0.9 0.6,1.5 1.5,1.5 0,0 2.3,0 5,0 3.4,0 3.4,3.1 3.1,4.3 -0.3,1.2 -0.9,2.1 -0.9,2.1 C 80.5,92 79,93 75.9,93 L 59,93 C 50.6,93 42.3,91.1 42,91.1 29.2,88 28.5,87.7 27.7,87.7 c 0,0 -2.6,-0.6 -2.6,-2.8 l 0,-42.5 c 0,-1.5 0.9,-2.7 2.4,-3.3 0.4,0 0.5,0 0.7,-0.3 14.1,-5.6 18.4,-18.5 18.4,-28.96 0,-1.6 1.3,-3.2 3.1,-3.2 3.4,0 9,6.46 9,14.66 0,7.3 -0.4,8.6 -2.9,16.2 30.9,0 30.6,0.3 33.3,1.3 3.4,0.9 3.8,3.6 3.8,4.6 0,0.9 0,0.9 0,1.8 z",
    //Author of these icons: https://github.com/github/octicons
    github: "M 49.9,0.664 C 22.5,0.664 0.421,22.9 0.421,50.2 c 0,21.6 14.179,40.2 33.879,47 2.5,0.6 3.4,-1.3 3.4,-2.5 0,-1.2 0,-5 0,-9.3 -12.5,2.5 -15.8,-3 -16.7,-5.6 -0.6,-1.7 -3,-6.1 -5.1,-7.3 -1.8,-0.7 -4.2,-3.1 0,-3.1 3.9,0 6.6,3.7 7.6,5 4.4,7.3 11.6,5.4 14.4,4.3 0.6,-3.2 1.8,-5.6 3.2,-6.9 C 30,70.6 18.5,66.3 18.5,47.6 c 0,-5.4 1.9,-9.9 5.1,-13.3 -0.5,-1.3 -2.2,-6.4 0.4,-13.1 0,0 4.2,-1.3 13.7,5.1 3.9,-1.2 8.1,-1.7 12.4,-1.7 4.1,0 8.3,0.6 12.2,1.7 9.3,-6.5 13.6,-5.1 13.6,-5.1 3.1,6.7 1.3,11.8 0.6,13.1 3.1,3.4 5,7.8 5,13.3 0,19.3 -11.2,23 -22.5,24.2 1.7,1.9 3.3,5 3.3,9.3 0,6.8 0,11.8 0,13.6 0,1.2 0.5,3.1 3.1,2.5 19.8,-6.8 34,-25.4 34,-47 C 99.4,22.9 77.2,0.664 49.9,0.664 Z",
    issue: "M 49.9,9.87 C 71.8,9.87 90.2,28 90.2,50.2 90.2,72.1 71.8,90.5 49.9,90.5 27.7,90.5 9.63,72.1 9.63,50.2 9.63,28 27.7,9.87 49.9,9.87 m 0,-9.196 C 22.7,0.674 0.431,23 0.431,50.2 0.431,77.8 22.7,99.7 49.9,99.7 77.5,99.7 99.4,77.8 99.4,50.2 99.4,23 77.5,0.674 49.9,0.674 Z m 7,21.226 -14,0 0,35.3 14,0 0,-35.3 z m 0,42.4 -14,0 0,14.2 14,0 0,-14.2 z",
    watch: "M 50.3,0.447 C 19,0.447 0.521,37.5 0.521,37.5 c 0,0 18.479,37.1 49.779,37.1 30.5,0 49,-37.1 49,-37.1 0,0 -18.5,-37.053 -49,-37.053 z M 49.9,62.3 c -13.6,0 -24.8,-11.2 -24.8,-24.8 0,-13.6 11.2,-24.8 24.8,-24.8 13.6,0 24.8,11.2 24.8,24.8 0,13.6 -11.2,24.8 -24.8,24.8 z M 62.2,37.5 c 0,6.9 -5.4,12.3 -12.3,12.3 -6.8,0 -12.3,-5.4 -12.3,-12.3 0,-6.8 5.5,-12.3 12.3,-12.3 6.9,0 12.3,5.5 12.3,12.3 z",
    forked: "m 57,0.674 c -7.9,0 -14.2,6.296 -14.2,14.226 0,5.2 3,9.8 7.1,12.1 l 0,9.1 -14.1,14.1 -14.1,-14.1 0,-9.1 c 4.2,-2.3 7,-6.9 7,-12.1 C 28.7,6.97 22.5,0.674 14.6,0.674 6.81,0.674 0.51,6.97 0.51,14.9 c 0,5.2 2.9,9.8 7,12.1 l 0,12.6 21.19,21.2 0,12.7 c -4.1,2.1 -7,7 -7,12 0,7.8 6.3,14.2 14.1,14.2 7.9,0 14.1,-6.4 14.1,-14.2 0,-5 -2.8,-9.9 -7.1,-12 l 0,-12.7 21.3,-21.2 0,-12.6 c 4.1,-2.3 7,-6.9 7,-12.1 C 71.1,6.97 64.8,0.674 57,0.674 Z M 14.6,23.4 c -4.69,0 -8.49,-3.9 -8.49,-8.5 0,-4.6 3.99,-8.53 8.49,-8.53 4.6,0 8.5,3.93 8.5,8.53 0,4.6 -3.9,8.5 -8.5,8.5 z M 35.8,94 c -4.6,0 -8.5,-4.2 -8.5,-8.5 0,-4.2 3.9,-8.5 8.5,-8.5 4.6,0 8.5,4.3 8.5,8.5 0,4.3 -3.9,8.5 -8.5,8.5 z M 57,23.4 c -4.7,0 -8.5,-3.9 -8.5,-8.5 0,-4.6 3.9,-8.53 8.5,-8.53 4.5,0 8.5,3.93 8.5,8.53 0,4.6 -4,8.5 -8.5,8.5 z",
    downloaded: "m 56.1,68.6 12.4,0 -18.6,18.5 -18.5,-18.5 12.3,0 0,-31 12.4,0 0,31 z M 74.6,19.1 C 74.6,16.4 69.1,0.455 46.8,0.455 31.9,0.455 19,12.5 19,25.3 6.82,25.3 0.421,34.7 0.421,43.8 c 0,9.4 6.299,18.6 18.579,18.6 2.7,0 16.5,0 18.6,0 l 0,-8.1 -18.6,0 C 9.02,54.3 8.42,45.6 8.42,43.8 8.42,42.8 8.82,33.3 19,33.3 l 8,0 0,-8 c 0,-8.6 9.7,-16.64 19.8,-16.64 16.1,0 19.1,9.54 19.8,11.04 l 0,7.4 8,0 c 4.9,0 16.8,1.4 16.8,13.6 0,13 -13.7,13.6 -16.8,13.6 l -12.4,0 0,8.1 c 2.6,0 12.4,0 12.4,0 13,0 24.8,-7.4 24.8,-21.7 0,-15.1 -11.8,-21.6 -24.8,-21.6 z",
    starred: "M 98.8,36 64.5,31.6 49.9,1.29 35.3,31.6 1.03,36 26.2,58.7 l -6.5,33.1 30.2,-16 30,16 L 73.6,58.7 98.8,36 Z",
    mail: "m 0.431,7.48 0,56.62 c 0,4.2 3.199,7 7.099,7 l 84.77,0 c 4.2,0 7.1,-2.8 7.1,-7 l 0,-56.62 c 0,-3.8 -2.9,-7.001 -7.1,-7.001 l -84.77,0 C 3.63,0.479 0.431,3.68 0.431,7.48 Z M 92.3,7.48 49.9,42.9 7.53,7.48 92.3,7.48 Z M 7.53,18.1 35.8,39.3 7.53,60.5 l 0,-42.4 z m 7.07,46 24.7,-21.2 10.6,10.6 10.6,-10.6 24.7,21.2 -70.6,0 z M 92.3,60.5 64,39.3 92.3,18.1 l 0,42.4 z",
    mention: "m 43.9,99.7 c 8.2,0 16.6,-2 23.1,-6 L 64.5,87.2 C 59,90.5 52.1,93.1 44.6,93.1 23.3,93.1 7.35,79.2 7.35,55 7.35,26.2 28.7,7.58 50.7,7.58 c 22.9,0 34.8,14.52 34.8,34.32 0,15.8 -9.2,25.5 -16.4,25.5 -7.4,0 -9.4,-4.8 -7.4,-14.4 l 4.7,-24.7 -6.8,0 -0.7,4.7 c -2.7,-4.2 -6.2,-5.5 -10.2,-5.5 -14.5,0 -24.2,15.8 -24.2,28.9 0,11 6.2,16.9 15.2,16.9 5.6,0 11,-3.3 15.2,-8 0.7,6 6.1,9.3 12.8,9.3 C 78.9,74.6 92.8,64 92.8,41.9 92.8,17.9 76.9,0.679 52.1,0.679 24.6,0.679 0.448,22.7 0.448,55.7 c 0,28.8 19.252,44 43.452,44 z m -2.1,-33 c -4.8,0 -8.9,-3.5 -8.9,-11 0,-9.6 6.2,-21.3 15.9,-21.3 3.3,0 5.4,1.3 8.2,5.5 l -3.5,19.9 c -4.1,4.8 -8.2,6.9 -11.7,6.9 z",
    //Author of these icons: https://nucleoapp.com
    beer: "m 78.7,45.1 -11.1,0 0,-5.6 c 3.8,-2.5 6.3,-7 6.3,-11.9 0,-8 -6.3,-14.4 -14.4,-14.4 -0.9,0 -2,0.2 -3,0.4 C 53.5,5.73 45.8,0.43 37.2,0.43 28.6,0.43 21,5.73 17.9,13.6 c -1,-0.2 -2.1,-0.4 -3.1,-0.4 -7.95,0 -14.336,6.4 -14.336,14.4 0,4.9 2.556,9.4 6.386,11.9 l 0,48.7 c 0,6.2 4.95,11.2 11.15,11.2 l 38.4,0 c 6.1,0 11.2,-5 11.2,-11.2 l 0,-14.4 4.7,0 c 4.5,0 7.9,-3.5 7.9,-7.9 l 0,-19.2 c 0,-0.9 -0.6,-1.6 -1.5,-1.6 z M 3.66,27.6 c 0,-6.2 4.94,-11.2 11.14,-11.2 1.1,0 2.3,0.2 3.5,0.7 0.5,0.1 0.8,0.1 1.3,-0.2 0.3,-0.1 0.6,-0.5 0.9,-0.9 C 22.7,8.61 29.4,3.63 37.2,3.63 45,3.63 51.8,8.61 54,16 c 0.1,0.4 0.5,0.8 0.8,0.9 0.3,0.2 0.8,0.2 1.2,0.2 1.3,-0.5 2.4,-0.7 3.5,-0.7 6.3,0 11.2,5 11.2,11.2 0,6.2 -4.9,11.1 -11.2,11.1 l -25.4,0 c -1,0 -1.6,0.6 -1.6,1.6 l 0,19.2 c 0,2.7 -2.2,4.8 -4.9,4.8 -2.7,0 -4.7,-2.1 -4.7,-4.8 l 0,-19.2 c 0,-1 -0.7,-1.6 -1.6,-1.6 l -6.5,0 C 8.6,38.7 3.66,33.8 3.66,27.6 Z M 29.2,81.8 c 0,1 -0.6,1.6 -1.6,1.6 -0.9,0 -1.6,-0.6 -1.6,-1.6 l 0,-6.3 c 0,-1.1 0.7,-1.7 1.6,-1.7 1,0 1.6,0.6 1.6,1.7 l 0,6.3 z m 19.1,0 c 0,1 -0.6,1.6 -1.6,1.6 -0.9,0 -1.5,-0.6 -1.5,-1.6 l 0,-25.6 c 0,-0.9 0.6,-1.5 1.5,-1.5 1,0 1.6,0.6 1.6,1.5 l 0,25.6 z M 77.1,65.9 c 0,2.7 -2.1,4.7 -4.8,4.7 l -4.7,0 0,-22.3 9.5,0 0,17.6 z",
    pizza: "m 1.37,90.3 c 14.33,6.1 29.73,9.4 45.33,9.4 15.7,0 31.1,-3.3 45.4,-9.4 0.3,-0.3 0.6,-0.7 1,-1.3 0,-0.4 0,-0.7 -0.4,-1.4 L 48.3,1.55 c -0.6,-1.198 -2.2,-1.198 -3.2,0 L 0.574,87.6 c 0,0.3 0,1 0,1.4 0,0.6 0.496,1 0.996,1.3 z M 46.7,6.15 81.4,73 C 70.5,76.9 58.5,79.4 46.7,79.4 35,79.4 22.9,76.9 12.2,73 l 8.7,-17 c 1,3.6 4.3,6.2 8.2,6.2 4.9,0 8.8,-3.6 8.8,-8.5 0,-4.9 -3.9,-8.5 -8.8,-8.5 -1,0 -2,0 -2.9,0.7 L 46.7,6.15 Z M 29.4,48.5 c 3,0 5.2,2.3 5.2,5.2 0,2.9 -2.2,5.2 -5.2,5.2 -2.9,0 -5.2,-2.3 -5.2,-5.2 0,-2.9 2.3,-5.2 5.2,-5.2 z M 10.6,75.9 c 11,4.6 24,6.8 36.1,6.8 12.2,0 25.1,-2.2 36.3,-6.8 l 6.1,11.7 C 75.7,93.6 61.4,96.4 46.7,96.4 32,96.4 18,93.6 4.57,87.6 L 10.6,75.9 Z M 46.7,41.6 c 3,0 5.3,-2 5.3,-4.9 0,-2.9 -2.3,-5.2 -5.3,-5.2 -2.9,0 -5.2,2.3 -5.2,5.2 0,2.9 2.3,4.9 5.2,4.9 z m 0,-6.5 c 1,0 1.6,0.6 1.6,1.6 0,1 -0.6,1.6 -1.6,1.6 -0.9,0 -1.6,-0.6 -1.6,-1.6 0,-1 0.7,-1.6 1.6,-1.6 z m 1.6,28.7 c 0,4.9 4,8.8 8.9,8.8 4.8,0 8.8,-3.9 8.8,-8.8 0,-4.5 -4,-8.5 -8.8,-8.5 -4.9,0 -8.9,4 -8.9,8.5 z m 8.9,-4.9 c 2.9,0 5.2,2.3 5.2,4.9 0,3 -2.3,5.2 -5.2,5.2 -2.9,0 -5.2,-2.2 -5.2,-5.2 0,-2.6 2.3,-4.9 5.2,-4.9 z",
    //Author of these icons: http://plainicon.com
    npm: "m 0.886,17.4 0,16.5 27.614,0 0,5.8 21.9,0 0,-5.8 49.5,0 0,-32.906 -99.014,0 0,16.406 0,0 z m 27.614,0 0,11.1 -5.5,0 0,-16.4 -5.4,0 0,16.4 -11.31,0 0,-21.94 22.21,0 0,10.84 z m 27.7,0 -0.4,11.1 -10.8,0 0,5.4 -11.2,0 0,-27.34 22.4,0 0,10.84 0,0 z m 38.3,0 0,11.1 -5.3,0 0,-16.4 -5.8,0 0,16.4 -5.4,0 0,-16.4 -5.3,0 0,16.4 -11.2,0 0,-21.94 33,0 0,10.84 0,0 z m -49.5,0 0,5.4 5.4,0 0,-10.7 -5.4,0 0,5.3 0,0 z",
    bower: "m 38.7,17.7 c -8.9,0 -4.7,14.5 2.8,9.5 4.2,-2.7 2.1,-9.5 -2.8,-9.5 z m 0,4.9 c -5.8,0 -1.4,-6 2,-3.2 2.4,1.3 -0.4,3.4 -2,3.2 z m 58.8,20.5 c -5.8,-4 -13,-4.6 -19.7,-6.2 -6.4,-1.1 -12.5,-1.9 -18.9,-2.6 0,-3.5 5.4,-6 5.7,-1.2 6.4,0.6 13.7,-2.4 16.1,-9 C 82.7,18.7 82,12.3 86.2,7.75 88.4,5.76 88.7,4.37 85.1,4.66 76.4,4.56 68,10.1 64.3,18 59.1,18 59,13.3 56.5,9.79 51.8,2.51 42.6,-0.631 34.3,0.869 17.9,2.8 4.07,16.3 1.23,32.5 c -3,15.8 2.26,33.3 13.57,44.8 3.3,3.4 8.5,6.4 12.9,3.4 2.3,-1 3.2,-6 4,-1.5 1,4.1 4.1,10.7 9.3,7.4 4.3,3.2 8,-1.2 11.7,-1.2 4.9,-0.3 6.3,-5.3 9,-8.2 1.4,-4.7 -5.3,-11.3 -5.2,-13.2 3.7,3 9.3,0.9 11.9,0.1 4,2.8 10.1,1.4 12.5,-1.8 4.2,0.8 10.4,-0.3 11.1,-5.2 2.1,-1.2 7.8,-3.1 7.3,-7.8 0.1,-2.2 -0.4,-4.5 -1.8,-6.2 z M 73,26.5 c -5.7,-3.1 -11.6,-0.4 -17.3,0.2 -4.4,-0.6 3.2,1.9 4.8,0.3 5.5,-0.9 -1.8,2 -3.7,2.8 -4.7,2.8 -3.3,-7.8 -0.8,-10.3 3.8,-1.1 8.4,1.2 12,3.2 1.8,1.1 3.4,2.5 5,3.8 z m 3.4,-0.4 c -2.1,-2.4 -7.1,-3.9 -3.6,-7.4 1,-2.6 5.5,-7.3 5.5,-7.8 -4.4,1.5 -6.3,8.2 -9.2,9.4 -5.1,-1.8 2.1,-7.1 4.4,-9.2 2.5,-1.97 8.3,-4.28 9.8,-3.3 -4.6,5.1 -2.8,12.9 -6.9,18.3 z m -10.2,4.2 c -1.1,-2.2 -1.6,-5.7 2,-3.9 -0.6,3.7 0.5,-1.4 2.8,0.6 2.2,0.4 4.6,1.3 1.1,2.2 -1.9,0.8 -3.8,1.1 -5.9,1.1 z M 55.3,16.5 c -5.1,4.7 -5.2,12.9 -1.7,18.5 -3.7,6.2 -10.5,9.6 -17.5,11.2 7.2,0 15.6,-1.7 20,-7.9 11.5,1 23,2.8 34.3,5.9 2.6,1.1 2.9,4.4 -0.6,2.8 -9.6,-1.1 -18.9,-1.9 -28.4,-2.6 10.2,1.8 20.4,3.7 30.6,5.9 -1.2,3.4 -7.3,2.2 -8.1,3 1.8,5.4 -7,4.6 -8.5,4.8 -0.4,5.5 -8.3,2.7 -10.5,2.6 -2.2,4.2 -9.9,0.2 -10.6,0.2 0.7,4.7 -2.6,9.5 -6.2,12.3 -7,4.9 -16.5,2.9 -23.8,-0.4 C 11.1,66.9 3.01,51.9 4.76,37.6 5.84,22.6 17,8.49 31.8,5.54 38.9,3.8 47.3,4.92 52,10.9 c 1.4,1.6 2.6,3.5 3.3,5.6 z",
    google: "m 65.6,0.603 -26.9,0 c -7,0 -16,0.997 -23.4,7.097 -5.5,4.9 -8.2,11.5 -8.2,17.5 0,10.1 7.8,20.4 21.4,20.4 1.6,0 2.8,0 4.5,-0.4 -0.8,1.6 -1.7,2.8 -1.7,5.3 0,3.7 2.1,6.2 4.1,8.7 -5.7,0.4 -16.8,1.2 -24.8,6.2 C 2.9,69.9 0.603,76.5 0.603,81 0.603,90.5 9.7,99.6 28.5,99.6 50.7,99.6 62.7,87.2 62.7,74.8 62.7,66.2 57.3,61.6 51.9,56.7 L 47,53.4 c -1.2,-1.2 -3.3,-2.9 -3.3,-5.8 0,-2.9 2.1,-4.5 3.7,-6.2 5.4,-4.5 10.7,-9 10.7,-18.5 0,-9.9 -6.2,-15.2 -9,-17.6 l 8.2,0 8.3,-4.697 z M 54,80.2 c 0,7.8 -6.6,14 -19,14 -13.9,0 -22.9,-6.6 -22.9,-16.1 0,-9 8.1,-12.3 11,-13.2 5.4,-2 12.3,-2 13.6,-2 1.2,0 2,0 3.3,0 9.9,7 14,10.7 14,17.3 z M 43.7,38.1 c -2.1,2.1 -5.8,3.8 -9.1,3.8 -11.1,0 -16,-14.4 -16,-23.1 0,-3.3 0.4,-6.8 2.9,-9.6 2,-2.6 5.8,-4.3 9,-4.3 10.7,0 16.5,14.5 16.5,23.9 0,2.3 -0.4,6.5 -3.3,9.3 z",
    //Author of these icons: https://www.iconfinder.com
    pinterest: "M 41.3,0.603 C 14.2,0.603 0.574,20 0.574,35.9 c 0,9.9 3.696,18.7 11.626,21.8 1.4,0.7 2.5,0 2.9,-1.3 0.3,-1.1 0.8,-3.4 1.1,-4.5 0.5,-1.4 0.4,-2 -0.8,-3.3 -2.2,-2.8 -3.8,-6.2 -3.8,-11 0,-14.5 10.8,-27.4 28,-27.4 15.3,0 23.8,9.4 23.8,21.9 0,16.5 -7.2,30 -18,30 -6.2,0 -10.6,-4.7 -9.3,-10.9 1.8,-7.1 5.2,-14.9 5.2,-20 0,-4.7 -2.4,-8.6 -7.5,-8.6 -6.2,0 -11.1,6.3 -11.1,14.7 0,5.4 1.8,9.2 1.8,9.2 0,0 -6.2,26.2 -7.3,31 -2.2,9.1 -0.3,20.4 0,21.4 0,0.6 0.9,1 1.3,0.3 0.6,-0.7 7.8,-9.5 10.3,-18.8 0.7,-2.3 4,-15.2 4,-15.2 C 34.6,69 40.4,72 46.9,72 64.9,72 77.5,55.3 77.5,33.1 77.3,16.3 63.1,0.603 41.3,0.603 Z",
    pin: "M 72.8,2.43 C 69.9,-0.741 64,0.484 62.7,4.61 58.3,14.2 51,23.1 40.8,26.7 31.6,30.8 21.3,31.6 11.4,31.8 6.48,32.5 4.72,39.6 8.69,42.6 15.2,49.2 21.7,55.8 28.2,62.3 18.9,74.8 9.67,87.3 0.277,99.5 12.6,90.4 25.2,81 37.6,71.7 c 7,6.9 13.8,14 21,20.7 4.1,3.1 10.3,-0.8 9.6,-5.7 C 68.3,73.3 70.9,59 79.6,48.5 84.3,43.1 90.7,39.7 97,36.4 101,33.9 99.7,28.6 96.5,26.3 88.6,18.3 80.7,10.4 72.8,2.43 Z",
    instagram: "m 80.2,0.556 -60.6,0 C 9.12,0.556 0.418,9.26 0.418,19.8 l 0,20.1 0,40.5 c 0,10.5 8.702,19.2 19.182,19.2 l 60.6,0 c 10.5,0 19.2,-8.7 19.2,-19.2 l 0,-40.5 0,-20.1 C 99.4,9.26 90.7,0.556 80.2,0.556 Z M 85.8,12 l 2.2,0 0,2.2 0,14.5 -16.8,0 0,-16.7 14.6,0 z M 35.7,39.9 c 3.4,-4.3 8.3,-7.1 14.2,-7.1 5.9,0 10.8,2.8 14.2,7.1 1.9,3.1 3.1,6.5 3.1,10.2 0,9.6 -7.7,17.3 -17.3,17.3 -9.6,0 -17.3,-7.7 -17.3,-17.3 0,-3.7 1.2,-7.1 3.1,-10.2 z m 54.1,40.5 c 0,5.2 -4.4,9.6 -9.6,9.6 L 19.6,90 C 14.4,90 10,85.6 10,80.4 l 0,-40.5 14.9,0 C 23.6,43 23,46.7 23,50.1 c 0,14.8 12.1,27.2 26.9,27.2 14.8,0 27.2,-12.4 27.2,-27.2 0,-3.4 -0.9,-7.1 -2.2,-10.2 l 14.9,0 0,40.5 z",
    //Author of these icons: https://worldvectorlogo.com
    jsdelivr: "m 63.5,51.6 c -0.4,5.9 -9,0.3 -3.7,-2.5 1.7,-0.8 3.8,0.6 3.7,2.5 z m -16,-16.9 c -0.5,5.9 -9.1,0.3 -3.8,-2.4 1.7,-0.9 3.8,0.5 3.8,2.4 z m -0.8,-4.6 c 2.5,-3.2 8.7,-6.3 10,-8.4 -4.9,-2 -10.5,-2.5 -15.7,-1.5 1.1,3.5 1.2,10.3 5.7,9.9 z m -14,25.6 c 0.8,-6.7 4,-12.9 7.9,-18.3 -2,-3.8 1.8,-7.1 -1.3,-10.8 -1,-2.7 -0.6,-7.4 -4.4,-4.5 -10.6,4.8 -17.6,16.5 -16.4,27.9 3.3,3.2 9.3,10.1 13.3,6 l 0.9,-0.3 0,0 z M 48.3,42.4 c -2.4,-5.5 -7.4,-2 -8.7,2.4 -1.2,3.5 -5.4,9.1 -2.3,11.8 2.7,4.9 9.5,0.4 13.7,-0.6 4.4,-0.8 7.3,-5.3 2.7,-7.8 -2,-1.8 -3.7,-3.8 -5.4,-5.8 z m 0.5,-4.6 c 3.1,3.1 6.4,10.7 11.2,8.9 5.8,2.1 8.3,-5.3 10.9,-9.4 C 71.6,32 64.7,25.4 60.1,24.2 56.4,27 48.4,29.5 49.8,34.7 c 0,1.1 -0.4,2.1 -1,3.1 z m 17,14.9 c 3,1.2 9,4.7 8.2,-1.2 0.6,-3.2 0.5,-10.2 -1.2,-11 -1.5,4.7 -7.8,7.4 -7,12.2 z M 29.1,60.9 C 26,60.6 20.8,56 19.9,56.5 22.8,65.1 30,72 38.6,74.4 34.8,71.9 35.2,65.9 31.1,64.4 30,63.6 29.2,62.3 29.1,60.9 Z M 58,55.8 c -5.7,3.6 -12.3,6 -19.2,6.3 -4.5,3.3 0.1,8.2 3.1,11 3.8,4.4 10.1,1.8 14.8,0.4 C 63.6,70.7 69.4,65.1 72.2,58.2 67.8,57.3 64.3,54.7 60.1,56.5 59.3,56.4 58.7,56.2 58,55.8 Z m -21.2,4.6 c -0.5,6 -9,0.3 -3.8,-2.5 1.7,-0.7 3.9,0.7 3.8,2.5 z M 46.3,0.664 C 61.9,6.14 77.6,11.6 93.2,17.1 90.9,37.4 88.4,57.5 86.1,77.8 72.7,85.1 59.5,92.3 46.3,99.5 33.2,92.2 20.1,85.1 6.92,77.8 4.78,57.5 2.65,37.4 0.497,17.1 15.8,11.6 31.1,6.14 46.3,0.664 Z",
    stackoverflow: "M15 21h-10v-2h10v2zm6-11.665l-1.621-9.335-1.993.346 1.62 9.335 1.994-.346zm-5.964 6.937l-9.746-.975-.186 2.016 9.755.879.177-1.92zm.538-2.587l-9.276-2.608-.526 1.954 9.306 2.5.496-1.846zm1.204-2.413l-8.297-4.864-1.029 1.743 8.298 4.865 1.028-1.744zm1.866-1.467l-5.339-7.829-1.672 1.14 5.339 7.829 1.672-1.14zm-2.644 4.195v8h-12v-8h-2v10h16v-10h-2z",
    codepen: "M97.147 48.319c-0.007-0.047-0.019-0.092-0.026-0.139c-0.016-0.09-0.032-0.18-0.056-0.268 c-0.014-0.053-0.033-0.104-0.05-0.154c-0.025-0.078-0.051-0.156-0.082-0.232c-0.021-0.053-0.047-0.105-0.071-0.156 c-0.033-0.072-0.068-0.143-0.108-0.211c-0.029-0.051-0.061-0.1-0.091-0.148c-0.043-0.066-0.087-0.131-0.135-0.193 c-0.035-0.047-0.072-0.094-0.109-0.139c-0.051-0.059-0.104-0.117-0.159-0.172c-0.042-0.043-0.083-0.086-0.127-0.125 c-0.059-0.053-0.119-0.104-0.181-0.152c-0.048-0.037-0.095-0.074-0.145-0.109c-0.019-0.012-0.035-0.027-0.053-0.039L61.817 23.5 c-1.072-0.715-2.468-0.715-3.54 0L24.34 46.081c-0.018 0.012-0.034 0.027-0.053 0.039c-0.05 0.035-0.097 0.072-0.144 0.1 c-0.062 0.049-0.123 0.1-0.181 0.152c-0.045 0.039-0.086 0.082-0.128 0.125c-0.056 0.055-0.108 0.113-0.158 0.2 c-0.038 0.045-0.075 0.092-0.11 0.139c-0.047 0.062-0.092 0.127-0.134 0.193c-0.032 0.049-0.062 0.098-0.092 0.1 c-0.039 0.068-0.074 0.139-0.108 0.211c-0.024 0.051-0.05 0.104-0.071 0.156c-0.031 0.076-0.057 0.154-0.082 0.2 c-0.017 0.051-0.035 0.102-0.05 0.154c-0.023 0.088-0.039 0.178-0.056 0.268c-0.008 0.047-0.02 0.092-0.025 0.1 c-0.019 0.137-0.029 0.275-0.029 0.416V71.36c0 0.1 0 0.3 0 0.418c0.006 0 0 0.1 0 0.1 c0.017 0.1 0 0.2 0.1 0.268c0.015 0.1 0 0.1 0.1 0.154c0.025 0.1 0.1 0.2 0.1 0.2 c0.021 0.1 0 0.1 0.1 0.154c0.034 0.1 0.1 0.1 0.1 0.213c0.029 0 0.1 0.1 0.1 0.1 c0.042 0.1 0.1 0.1 0.1 0.193c0.035 0 0.1 0.1 0.1 0.139c0.05 0.1 0.1 0.1 0.2 0.2 c0.042 0 0.1 0.1 0.1 0.125c0.058 0.1 0.1 0.1 0.2 0.152c0.047 0 0.1 0.1 0.1 0.1 c0.019 0 0 0 0.1 0.039L58.277 96.64c0.536 0.4 1.2 0.5 1.8 0.537c0.616 0 1.233-0.18 1.77-0.537 l33.938-22.625c0.018-0.012 0.034-0.027 0.053-0.039c0.05-0.035 0.097-0.072 0.145-0.109c0.062-0.049 0.122-0.1 0.181-0.152 c0.044-0.039 0.085-0.082 0.127-0.125c0.056-0.055 0.108-0.113 0.159-0.172c0.037-0.045 0.074-0.09 0.109-0.139 c0.048-0.062 0.092-0.127 0.135-0.193c0.03-0.049 0.062-0.098 0.091-0.146c0.04-0.07 0.075-0.141 0.108-0.213 c0.024-0.051 0.05-0.102 0.071-0.154c0.031-0.078 0.057-0.156 0.082-0.234c0.017-0.051 0.036-0.102 0.05-0.154 c0.023-0.088 0.04-0.178 0.056-0.268c0.008-0.045 0.02-0.092 0.026-0.137c0.018-0.139 0.028-0.277 0.028-0.418V48.735 C97.176 48.6 97.2 48.5 97.1 48.319z M63.238 32.073l25.001 16.666L77.072 56.21l-13.834-9.254V32.073z M56.856 32.1 v14.883L43.023 56.21l-11.168-7.471L56.856 32.073z M29.301 54.708l7.983 5.34l-7.983 5.34V54.708z M56.856 88.022L31.855 71.4 l11.168-7.469l13.833 9.252V88.022z M60.048 67.597l-11.286-7.549l11.286-7.549l11.285 7.549L60.048 67.597z M63.238 88.022V73.14 l13.834-9.252l11.167 7.469L63.238 88.022z M90.794 65.388l-7.982-5.34l7.982-5.34V65.388z",
    gitlab: "M525.05,266.61l-24-74L453.36,46a8.19,8.19,0,0,0-15.58,0L390.12,192.62H231.88L184.22,46a8.19,8.19,0,0,0-15.58,0L121,192.62l-24,74a16.38,16.38,0,0,0,6,18.31L311,436.09,519.1,284.92a16.38,16.38,0,0,0,6-18.31",
    bitbucket: "M29.208,3.519c-0.203-0.285-0.451-0.525-0.729-0.738c-0.61-0.475-1.297-0.814-2.01-1.102   c-1.516-0.611-3.097-0.971-4.701-1.229C19.81,0.137,17.836,0.012,15.762,0c-1.854,0.016-3.797,0.133-5.725,0.434   C8.668,0.649,7.316,0.94,6.002,1.385c-0.869,0.297-1.71,0.649-2.477,1.164C3.16,2.793,2.824,3.07,2.549,3.418   C2.205,3.856,2.058,4.344,2.147,4.897C2.32,5.989,2.48,7.082,2.66,8.169c0.264,1.611,0.537,3.222,0.811,4.828   c0.306,1.787,0.62,3.573,0.918,5.36c0.07,0.416,0.246,0.769,0.526,1.07c0.179,0.193,0.37,0.377,0.574,0.543   c0.73,0.59,1.562,1.01,2.432,1.354c2.082,0.83,4.259,1.205,6.485,1.328c1.616,0.09,3.23,0.033,4.838-0.187   c1.369-0.185,2.709-0.479,4.011-0.948c0.965-0.349,1.891-0.775,2.725-1.382c0.355-0.26,0.683-0.547,0.945-0.901   c0.181-0.238,0.305-0.504,0.354-0.805c0.397-2.341,0.809-4.679,1.196-7.021c0.362-2.172,0.701-4.346,1.058-6.518   C29.617,4.388,29.502,3.935,29.208,3.519z M15.82,19.64c-2.4-0.008-4.341-1.971-4.333-4.383c0.006-2.41,1.958-4.347,4.369-4.338   c2.425,0.008,4.359,1.961,4.35,4.387C20.195,17.704,18.227,19.648,15.82,19.64z M24.522,4.394   c-0.124,0.139-0.274,0.262-0.436,0.357c-0.45,0.268-0.951,0.409-1.454,0.541c-0.952,0.243-1.923,0.383-2.896,0.485   c-1.281,0.136-2.565,0.183-3.791,0.188c-1.49-0.008-2.914-0.068-4.332-0.238c-1.064-0.129-2.124-0.291-3.146-0.633   C8.164,4.99,7.869,4.858,7.584,4.713C7.438,4.641,7.309,4.528,7.198,4.409c-0.197-0.215-0.196-0.45,0.005-0.663   C7.32,3.621,7.463,3.514,7.61,3.43C8.034,3.184,8.5,3.041,8.969,2.918c0.983-0.256,1.985-0.402,2.994-0.509   c1.652-0.17,3.308-0.221,4.967-0.172c1.524,0.045,3.045,0.158,4.55,0.431c0.706,0.127,1.407,0.274,2.075,0.545   c0.236,0.096,0.463,0.217,0.683,0.346c0.109,0.064,0.208,0.164,0.288,0.266C24.668,4.007,24.674,4.222,24.522,4.394z    M26.186,22.761c0.009,0.088-0.004,0.183-0.021,0.271c-0.305,1.604-0.614,3.205-0.911,4.811c-0.101,0.539-0.344,0.99-0.724,1.377   c-0.422,0.432-0.918,0.752-1.448,1.023c-0.979,0.498-2.018,0.811-3.085,1.031c-1.377,0.286-2.771,0.414-3.563,0.407   c-2.41-0.006-4.184-0.198-5.917-0.698c-0.802-0.23-1.577-0.529-2.3-0.953c-0.379-0.222-0.732-0.478-1.042-0.789   c-0.388-0.392-0.64-0.846-0.741-1.396c-0.296-1.604-0.609-3.207-0.915-4.81c-0.016-0.081-0.021-0.163-0.019-0.245   c0.019-0.394,0.37-0.597,0.724-0.423c0.036,0.021,0.072,0.041,0.105,0.063c1.174,0.853,2.484,1.423,3.858,1.856   c1.262,0.4,2.556,0.641,3.873,0.758c1.52,0.138,3.031,0.104,4.54-0.11c2-0.28,3.91-0.851,5.687-1.827   c0.354-0.194,0.686-0.43,1.025-0.646c0.056-0.035,0.108-0.076,0.167-0.104C25.819,22.206,26.153,22.395,26.186,22.761z    M18.027,15.284c-0.005,1.203-0.992,2.184-2.197,2.178c-1.205-0.004-2.178-0.987-2.172-2.196c0.004-1.212,0.98-2.181,2.192-2.175   C17.059,13.097,18.03,14.073,18.027,15.284z",
    gitter: "m 94.2,55.5 8.8,0 0,80.5 -8.8,0 z m -16.7,0 8.2,0 0,80.5 -8.2,0 z m 33.5,0 8,0 0,47.5 -8,0 z m -50,-14 8.2,0 0,61.5 -8.2,0 z",
    slack: "M 195,119 C 182,75.5 163,65.5 120,78.4 77.1,91.3 67.1,110 80,153 c 12.9,43 32,53 75,40 43,-13 53,-31 40,-74 z m -22,27 -8,3 3,9 c 1,3 -1,7 -4,8 -1,0 -2,0 -3,0 -2,0 -5,-2 -6,-4 l -2,-9 -17,6 3,8 c 1,4 -1,7 -4,8 -1,1 -2,1 -3,1 -2,0 -5,-2 -6,-5 l -2,-8 -9,3 c 0,0 -1,0 -2,0 -2,0 -5,-2 -6,-5 -1,-3 1,-7 4,-8 l 8,-2 -5,-16 -8,2 c -1,0 -2,1 -2,1 -3,-1 -5.4,-2 -6.3,-5 -1.1,-3 0.7,-7 4.3,-8 l 8,-3 -3,-8 c -1,-4 1,-7 4,-8 4,-2 7,0 8,4 l 3,8 17,-6 -3,-8 c -1,-3 1,-7 4,-8.1 4,-1.1 7,0.7 8,4.1 l 3,8 8,-2 c 4,-1 7,0 9,4 1,3 -1,7 -5,8 l -8,3 6,16 8,-3 c 3,-1 7,1 8,4 1,4 -1,7 -4,8 z m -46,-16 16,-5 5,16 -16,5 z m 0,0 16,-5 5,16 -16,5 z",
    /* =========================== */
    /* Predefined hybrid icons     */
    /* =========================== */

    setpresets: function (hybicon, iconName) {

        switch (iconName) {
            case "twitter-bubble":
                hybicon.icon1Init.centerX = 36;
                hybicon.icon1Init.size = 65;
                hybicon.icon2Init.centerX = 82;
                hybicon.icon2Init.centerY = 23;
                hybicon.icon2Anim.size = 31;
                break;
            case "linkedin-link":
            case "google-plus":
            case "facebook-like":
            case "pinterest-pin":
            case "instagram-fave":
                hybicon.icon1Init.size = 65;
                hybicon.icon2Anim.size = 25;
                break;
            case "user-idea":
                hybicon.icon1Init.centerX = 47;
                hybicon.icon1Init.size = 85;
                hybicon.icon2Init.centerX = 75;
                hybicon.icon2Init.centerY = 25;
                break;
            case "checkbox-check":
                hybicon.icon1InitSettings = "50,50,70";
                hybicon.icon2InitSettings = "50,50";
                hybicon.icon2Anim.size = 50;
                break;
            case "switch-circle":
                hybicon.icon1InitSettings = "50,50,95";
                hybicon.icon2InitSettings = "24,50,33";
                hybicon.icon2AnimSettings = "76";
                break;
        }
    }
};

///#source 1 1 /js/hybicon.github.js
/* ======================================================================================= */
/*                                   hybicon.github.js                                     */
/* ======================================================================================= */
/* This is a small JavaScript library for GitHub API with hybicon.                         */
/* Requires hybicon.js (http://hybicon.softwaretailoring.net)                              */
/* ======================================================================================= */
/* Check http://hybicon.softwaretailoring.net/github.html for samples.                     */
/* Fork https://github.com/softwaretailoring/hybicon for contribution.                     */
/* ======================================================================================= */
/* Copyright © 2015-2018 Gábor Berkesi (http://softwaretailoring.net)                      */
/* Licensed under MIT (https://github.com/softwaretailoring/hybicon/blob/master/LICENSE)   */
/* ======================================================================================= */

/* ======================================================================================= */
/* Documentation: http://hybicon.softwaretailoring.net                                     */
/* ======================================================================================= */

hybicongithub = function (divId) {

    if (divId !== undefined &&
        divId !== null) {
        this.holderId = divId;
    }

    var holderDiv = document.getElementById(divId);

    if ((holderDiv === null ||
        holderDiv === undefined)) {
        return this;
    }

    this.githubUser = null;
    this.githubRepo = null;
    this.githubRepoTag = null;

    this.parseIcon(holderDiv);

    if (this.githubUser !== null &&
        this.githubRepo !== null) {

        var githubUrl = 'https://github.com/' + this.githubUser + '/' + this.githubRepo;
        var githubApiUrl = 'https://api.github.com/repos/' + this.githubUser + '/' + this.githubRepo;

        // set type
        var icons = holderDiv.getAttribute("data-hybicon").split("-");
        var callbacktype = null;

        if (icons[0] === "github" ||
            icons[0] === "githubalt") {

            if (icons[1] === "starred" ||
                icons[1] === "star") {
                callbacktype = "stars";
                dividstar = divId;
                githubUrl += "/stargazers";
            }
            if (icons[1] === "forked" ||
                icons[1] === "fork") {
                callbacktype = "forks";
                dividfork = divId;
                githubUrl += "/network/members";
            }
            if (icons[1] === "watch" ||
                icons[1] === "view") {
                callbacktype = "watchers";
                dividwatch = divId;
                githubUrl += "/watchers";
            }
            if (icons[1] === "issue" ||
                icons[1] === "question") {
                callbacktype = "issues";
                dividissue = divId;
                githubUrl += "/issues";
            }
            if (icons[1] === "downloaded" ||
                icons[1] === "download") {
                callbacktype = "releases";
                dividdownload = divId;
                githubUrl += "/releases";
                githubApiUrl += "/releases";

                if (this.githubRepoTag !== null) {
                    githubApiUrl += "/tags/" + this.githubRepoTag;
                }
            }
        }

        // set GitHub API
        if (callbacktype !== null) {
            if (!holderDiv.hasAttribute("data-hybicon-infomode")) {
                holderDiv.setAttribute("data-hybicon-infomode", "");
            }
            if (!holderDiv.hasAttribute("title")) {
                var githubtitle = this.githubUser + "/" + this.githubRepo + " - " + callbacktype;
                if (this.githubRepoTag !== null &&
                    callbacktype === "releases") {
                    githubtitle += " " + this.githubRepoTag;
                }
                holderDiv.setAttribute("title", githubtitle);
            }

            var githubApi = document.createElement('script');
            githubApi.src = githubApiUrl + '?callback=hybicongithubcallback' + callbacktype;
            document.head.insertBefore(githubApi, document.head.firstChild);
        }

        // set hyperlink
        if (holderDiv.parentNode.tagName.toUpperCase() !== "A") {
            holderDiv.outerHTML = "<a href='" + githubUrl + "' target='_blank'>" + holderDiv.outerHTML + "</a>";
        }
    }

    return this;
};

function hybicongithubcallbackstars(obj) {
    createhybicongithub(dividstar, (obj.data.stargazers_count ? obj.data.stargazers_count : "star"));
};

function hybicongithubcallbackforks(obj) {
    createhybicongithub(dividfork, (obj.data.network_count ? obj.data.network_count : "fork"));
};

function hybicongithubcallbackwatchers(obj) {
    createhybicongithub(dividwatch, (obj.data.subscribers_count ? obj.data.subscribers_count : "watch"));
};

function hybicongithubcallbackissues(obj) {
    createhybicongithub(dividissue, (obj.data.open_issues_count ? obj.data.open_issues_count : "issue"));
};

function hybicongithubcallbackreleases(obj) {
    var download = 0;
    var objdata = obj.data;

    // All downloads
    if (Array.isArray(objdata)) {
        for (var i = 0; i < objdata.length; i++) {
            if (objdata[i].assets !== null &&
                objdata[i].assets !== undefined) {
                for (var j = 0; j < objdata[i].assets.length; j++) {
                    if (objdata[i].assets[j].download_count !== undefined) {
                        download += objdata[i].assets[j].download_count
                    }
                }
            }
        }
    }
    // Downloads per tag
    else {
        if (objdata.assets !== null &&
            objdata.assets !== undefined) {
            for (var i = 0; i < objdata.assets.length; i++) {
                if (objdata.assets[i].download_count !== undefined) {
                    download += objdata.assets[i].download_count
                }
            }
        }
    }

    if (download === 0) { download = "release"; }
    createhybicongithub(dividdownload, download);
};

function createhybicongithub(divId, infoText) {
    var thishybicon = document.getElementById(divId);
    thishybicon.setAttribute("data-hybicon-infotext", infoText);
    new hybicon(divId);
};

//Parse html5 data- attributes
hybicongithub.prototype.parseIcon = function (holderDiv) {
    if (holderDiv !== undefined &&
        holderDiv !== null) {
        //data-hybicon attribute is required
        var hybiconHasData = holderDiv.hasAttribute("data-hybicon");
        if (hybiconHasData) {

            //data-hybicon-github-user
            var hybiconGithubUser = holderDiv.getAttribute("data-hybicon-github-user");
            if (hybiconGithubUser !== null) {
                this.githubUser = hybiconGithubUser;
            }

            //data-hybicon-github-repo
            var hybiconGithubRepo = holderDiv.getAttribute("data-hybicon-github-repo");
            if (hybiconGithubRepo !== null) {
                this.githubRepo = hybiconGithubRepo;
            }

            //data-hybicon-github-repotag
            var hybiconGithubRepoTag = holderDiv.getAttribute("data-hybicon-github-repotag");
            if (hybiconGithubRepoTag !== null) {
                this.githubRepoTag = hybiconGithubRepoTag;
            }
        }
    }
};

hybicongithub.prototype.parseAll = function () {
    var hybicons = document.querySelectorAll('[data-hybicon-github-user]');

    for (var i = 0; i < hybicons.length; i++) {
        new hybicongithub(hybicons[i].id);
    }
};

document.addEventListener("DOMContentLoaded", function (event) {
    new hybicongithub().parseAll();
});
