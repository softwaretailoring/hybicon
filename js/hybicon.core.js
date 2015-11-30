/* ======================================================================================= */
/*                                   hybicon.core.js - v1.0.0                              */
/* ======================================================================================= */
/* This is a small JavaScript library for animated SVG based icons.                        */
/* Requires Raphaël JavaScript Vector Library (http://raphaeljs.com)                       */
/* ======================================================================================= */
/* Check http://hybicon.softwaretailoring.net for samples.                                 */
/* Fork https://github.com/softwaretailoring/hybicon for contribution.                     */
/* ======================================================================================= */
/* Copyright © 2015 Gábor Berkesi (http://softwaretailoring.net)                           */
/* Licensed under MIT (https://github.com/softwaretailoring/hybicon/blob/master/LICENSE)   */
/* ======================================================================================= */

/* ======================================================================================= */
/* Documentation: http://hybicon.softwaretailoring.net                                     */
/* ======================================================================================= */

hybicon = function (divId) {

    this.version = "1.0.0";
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
    
    //Prepare raphael object and set the width
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
    this.icon1Color = "#222";
    this.icon1Stroke = "none";
    this.icon1StrokeWidth = 0;
    this.icon1Path = icon.user;
    this.icon1Rotate = null;
    this.icon1Size = null;
    this.icon1CenterX = null;
    this.icon1CenterY = null;

    this.icon1PathAnim = null;
    this.icon1RotateAnim = null;
    this.icon1SizeAnim = null;
    this.icon1CenterXAnim = null;
    this.icon1CenterYAnim = null;

    this.icon2Color = "#222";
    this.icon2Stroke = "none";
    this.icon2StrokeWidth = 0;
    this.icon2Path = icon.idea;
    this.icon2Rotate = null;
    this.icon2Size = null;
    this.icon2CenterX = null;
    this.icon2CenterY = null;

    this.icon2PathAnim = null;
    this.icon2RotateAnim = null;
    this.icon2SizeAnim = null;
    this.icon2CenterXAnim = null;
    this.icon2CenterYAnim = null;

    this.animateTime = 200;
    this.animateEffect = "linear";
    this.hoverMode = null;
    this.clickMode = null;
    this.clicked = false;
    this.infoMode = null;
    this.infoText = "hybicon";
    this.infoStrokeColor = "#222";
    this.infoTextColor = "#222";

    this.hybiconSize = 100;
    this.hybiconAlign = "center";
    this.hybiconBorder = "none";
    this.hybiconBorderRadius = "0%";
    this.hybiconBackground = "";

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
            console.log(infoSize);
        }
        else {
            infoType = this.infoMode;
            if (infoType === "right") { infoSize = 200; }
        }
    }

    iconWidth += infoSize;

    // Set style
    if (this.hybiconSize !== "R") { // When not responsive
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
    this.raphael.setViewBox(0, 0, iconWidth, iconHeight, true);

    // Set style of svg
    if (this.hybiconSize === "R") { // Responsive behaviour
        this.holderDiv.firstChild.style.width = "100%";
        this.holderDiv.firstChild.style.height = "100%";
    }
    this.holderDiv.firstChild.style.border = this.hybiconBorder;
    this.holderDiv.firstChild.style.borderRadius = this.hybiconBorderRadius;
    this.holderDiv.firstChild.style.background = this.hybiconBackground;

    this.setDefaultProps();
    this.hovered = false;

    this.icon1Transform = this.getTransformString(this.icon1X, this.icon1Y, this.icon1Scale, this.icon1Rotate);
    this.icon1TransformAnim = this.getTransformString(this.icon1XAnim, this.icon1YAnim, this.icon1ScaleAnim, this.icon1RotateAnim);
    this.icon2Transform = this.getTransformString(this.icon2X, this.icon2Y, this.icon2Scale, this.icon2Rotate);
    this.icon2TransformAnim = this.getTransformString(this.icon2XAnim, this.icon2YAnim, this.icon2ScaleAnim, this.icon2RotateAnim);

    if ((this.hoverMode !== null) || (this.clickMode != null)) {
        this.icon1 = this.raphael.path(this.icon1Path);
        this.icon1.attr({ transform: this.icon1Transform });
        this.icon2 = this.raphael.path(this.icon2Path);
        this.icon2.attr({ transform: this.icon2Transform });
    }
    else {
        this.icon1 = this.raphael.path(this.icon1PathAnim);
        this.icon1.attr({ transform: this.icon1TransformAnim });
        this.icon2 = this.raphael.path(this.icon2PathAnim);
        this.icon2.attr({ transform: this.icon2TransformAnim });
    }

    if (infoType !== null) {
        if (infoType === "" ||
            infoType === "bottomright") {
            this.infoFont = '100 12px Impact, Charcoal, sans-serif';
            this.info = this.raphael.path(privateicons.infobottomright);
            this.infotext = this.raphael.text(83, 83, this.infoText).attr({ transform: "r-45" });
        }

        if (infoType === "right") {
            this.infoFont = '100 50px Impact, Charcoal, sans-serif';
            var infoScaleX = (infoSize / 200);
            var infoTranslateX = ((infoSize - 200) / 2) - 3;
            this.info = this.raphael.path(privateicons.inforight).attr({ transform: "s" + infoScaleX + ",1,T" + infoTranslateX + ",0" });
            this.infotext = this.raphael.text(100 + (infoSize / 2), 50, this.infoText);
        }

        if (this.info != null) {
            this.info.attr({ stroke: this.infoStrokeColor, 'stroke-width': 2 });
            this.infotext.attr({ font: this.infoFont, fill: this.infoTextColor, stroke: 'none' });
            this.info.id = this.getInfoId();
            this.info.node.id = this.info.id;
            this.infotext.id = this.getInfoTextId();
            this.infotext.node.id = this.infotext.id;
        }
    }

    this.icon1.id = this.getIcon1Id();
    this.icon1.node.id = this.icon1.id;
    this.icon2.id = this.getIcon2Id();
    this.icon2.node.id = this.icon2.id;

    this.icon1.attr({ fill: this.icon1Color, stroke: this.icon1Stroke, 'stroke-width': this.icon1StrokeWidth });
    this.icon2.attr({ fill: this.icon2Color, stroke: this.icon2Stroke, 'stroke-width': this.icon2StrokeWidth });

    this.iconRect = this.raphael.rect(0, 0, iconWidth, iconHeight);
    this.iconRect.attr({ fill: "#FFF", "fill-opacity": 0, stroke: "none", cursor: "pointer" });

    this.iconHolder = this.raphael.set();

    this.iconHolder.push(
        this.icon1,
        this.icon2,
        this.iconRect
    );

    var thishybicon = this;

    if (this.hoverMode !== null) {
        this.iconHolder.mouseover(function () {
            if (thishybicon.hovered !== true &&
                thishybicon.clicked !== true) {
                thishybicon.hovered = true;
                thishybicon.hoverHandler(true);
            }
        });
        this.iconHolder.mouseout(function () {
            if (thishybicon.clicked !== true) {
                thishybicon.hovered = false;
                thishybicon.hoverHandler(false);
            }
        });
    }

    if (this.clickMode !== null) {
        this.iconHolder.click(function () {
            if (thishybicon.clicked !== true) {
                thishybicon.clicked = true;
                thishybicon.hoverHandler(true);
            }
            else {
                thishybicon.clicked = false;
                thishybicon.hoverHandler(false);
            }
        });
    }

    return this;
};

hybicon.prototype.hoverHandler = function (hovered) {
    if (hovered === true) {
        this.icon1.animate({ path: this.icon1PathAnim, transform: this.icon1TransformAnim }, this.animateTime, this.animateEffect);
        this.icon2.animate({ path: this.icon2PathAnim, transform: this.icon2TransformAnim }, this.animateTime, this.animateEffect);
    }
    else {
        this.icon1.animate({ path: this.icon1Path, transform: this.icon1Transform }, this.animateTime, this.animateEffect);
        this.icon2.animate({ path: this.icon2Path, transform: this.icon2Transform }, this.animateTime, this.animateEffect);
    }
};

hybicon.prototype.getIconSizeTransform = function (icon, iconWidth, iconHeight, centerX, centerY) {

    var transformAttrX = "";
    var transformAttrY = "";

    var relativePath = Raphael.pathToRelative(icon);
    var bbox = Raphael.pathBBox(relativePath);
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

//Parse html5 data- attributes, the onmouseup event and anchor link
hybicon.prototype.parseIcon = function () {
    if (this.holderDiv !== undefined &&
        this.holderDiv !== null) {
        //data-hybicon attribute is required
        var hybiconHasData = this.holderDiv.hasAttribute("data-hybicon");
        if (hybiconHasData) {

            var hybiconData = this.holderDiv.getAttribute("data-hybicon");

            // set primary and secondary icons
            var icons = hybiconData.split("-");
            if (icons.length === 2) {
                if (icon[icons[0]] !== undefined &&
                    icon[icons[0]] !== null) {
                    this.icon1Path = icon[icons[0]];
                }
                if (icon[icons[1]] !== undefined &&
                    icon[icons[1]] !== null) {
                    this.icon2Path = icon[icons[1]];
                }
            }
            else {
                if (icon[hybiconData] !== undefined &&
                    icon[hybiconData] !== null) {
                    this.icon1Path = icon[hybiconData];
                    this.icon1CenterX = 50;
                    this.icon1CenterY = 50;
                    this.icon2Path = privateicons.empty;
                }
            }

            //set predefined icons
            this.setIcon(hybiconData);

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
            if (hybiconColor !== null) {
                this.icon1Color = hybiconColor;
                this.icon2Color = hybiconColor;
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

    // default values
    var icon1SizeDefault = 77;
    var icon2SizeDefault = 33;

    if (this.icon1Size === null) { this.icon1Size = icon1SizeDefault; }
    if (this.icon1CenterX === null) { this.icon1CenterX = 45; }
    if (this.icon1CenterY === null) { this.icon1CenterY = 55; }
    if (this.icon1Rotate === null) { this.icon1Rotate = 0; }
    if (this.icon2Size === null) { this.icon2Size = 0; }
    if (this.icon2CenterX === null) { this.icon2CenterX = 80; }
    if (this.icon2CenterY === null) { this.icon2CenterY = 20; }
    if (this.icon2Rotate === null) { this.icon2Rotate = 0; }

    // handle hover and click modes
    if (this.hoverMode === "switch" ||
        this.clickMode === "switch") {
        this.icon1CenterXAnim = this.icon2CenterX;
        this.icon1CenterYAnim = this.icon2CenterY;
        this.icon2CenterXAnim = this.icon1CenterX;
        this.icon2CenterYAnim = this.icon1CenterY;
        if (this.icon2Size === 0) { this.icon1SizeAnim = icon2SizeDefault; }
        else { this.icon1SizeAnim = this.icon2Size; }
        if (this.icon2SizeAnim === null) { this.icon2Size = icon2SizeDefault; }
        else { this.icon2Size = this.icon2SizeAnim; }
        this.icon2SizeAnim = this.icon1Size;
    }
    if (this.hoverMode === "rotate" ||
        this.clickMode === "rotate") {
        if (this.icon2SizeAnim === null) { this.icon2Size = icon2SizeDefault; }
        else { this.icon2Size = this.icon2SizeAnim; }
        this.icon2RotateAnim = "360";
        this.animateTime = 300;
    }

    // set width and height
    if (this.icon1Height === null) { this.icon1Height = this.icon1Size; }
    if (this.icon1Width === null) { this.icon1Width = this.icon1Size; }
    if (this.icon2Height === null) { this.icon2Height = this.icon2Size; }
    if (this.icon2Width === null) { this.icon2Width = this.icon2Size; }

    // icon1
    var sizeTransform = this.getIconSizeTransform(this.icon1Path, this.icon1Width, this.icon1Height, this.icon1CenterX, this.icon1CenterY);
    this.icon1Scale = sizeTransform.scale;
    this.icon1X = sizeTransform.iconX;
    this.icon1Y = sizeTransform.iconY;

    if (this.icon1SizeAnim === null) { this.icon1SizeAnim = this.icon1Size; }
    if (this.icon1HeightAnim === null) { this.icon1HeightAnim = this.icon1SizeAnim; }
    if (this.icon1WidthAnim === null) { this.icon1WidthAnim = this.icon1SizeAnim; }
    if (this.icon1CenterXAnim === null) { this.icon1CenterXAnim = this.icon1CenterX; }
    if (this.icon1CenterYAnim === null) { this.icon1CenterYAnim = this.icon1CenterY; }
    if (this.icon1PathAnim === null) { this.icon1PathAnim = this.icon1Path; }
    if (this.icon1RotateAnim === null) { this.icon1RotateAnim = this.icon1Rotate; }

    var sizeTransformAnim = this.getIconSizeTransform(this.icon1PathAnim, this.icon1WidthAnim, this.icon1HeightAnim, this.icon1CenterXAnim, this.icon1CenterYAnim);
    this.icon1ScaleAnim = sizeTransformAnim.scale;
    this.icon1XAnim = sizeTransformAnim.iconX;
    this.icon1YAnim = sizeTransformAnim.iconY;

    // icon2
    var sizeTransform2 = this.getIconSizeTransform(this.icon2Path, this.icon2Width, this.icon2Height, this.icon2CenterX, this.icon2CenterY);
    this.icon2Scale = sizeTransform2.scale;
    this.icon2X = sizeTransform2.iconX;
    this.icon2Y = sizeTransform2.iconY;

    if (this.icon2SizeAnim === null) {
        if (this.icon2Size === 0) { this.icon2SizeAnim = 33; }
        else { this.icon2SizeAnim = this.icon2Size; }
    }
    if (this.icon2HeightAnim === null) { this.icon2HeightAnim = this.icon2SizeAnim; }
    if (this.icon2WidthAnim === null) { this.icon2WidthAnim = this.icon2SizeAnim; }
    if (this.icon2CenterXAnim === null) { this.icon2CenterXAnim = this.icon2CenterX; }
    if (this.icon2CenterYAnim === null) { this.icon2CenterYAnim = this.icon2CenterY; }
    if (this.icon2PathAnim === null) { this.icon2PathAnim = this.icon2Path; }
    if (this.icon2RotateAnim === null) { this.icon2RotateAnim = this.icon2Rotate; }

    var sizeTransform2Anim = this.getIconSizeTransform(this.icon2PathAnim, this.icon2WidthAnim, this.icon2HeightAnim, this.icon2CenterXAnim, this.icon2CenterYAnim);
    this.icon2ScaleAnim = sizeTransform2Anim.scale;
    this.icon2XAnim = sizeTransform2Anim.iconX;
    this.icon2YAnim = sizeTransform2Anim.iconY;
};

hybicon.prototype.getIcon1Id = function () {
    return "hybicon-" + this.holderId + "-icon1";
};

hybicon.prototype.getIcon2Id = function () {
    return "hybicon-" + this.holderId + "-icon2";
};

hybicon.prototype.getInfoId = function () {
    return "hybicon-" + this.holderId + "-info";
};

hybicon.prototype.getInfoTextId = function () {
    return "hybicon-" + this.holderId + "-infotext";
};

hybicon.prototype.getTransformString = function (x, y, scale, rotate) {
    return "t" + x.toString() + "," + y.toString() + "s" + scale.toString() + "r" + rotate.toString();
    
};

document.addEventListener("DOMContentLoaded", function (event) {
    new hybicon().parseAll();
});

