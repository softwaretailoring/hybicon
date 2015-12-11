/* ======================================================================================= */
/*                                   hybicon.core.js                                       */
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

    this.version = "1.1.0";
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

    this.setDefaultProps();

    this.icon1Transform = this.getTransformString(this.icon1X, this.icon1Y, this.icon1Scale, this.icon1Init.rotate);
    this.icon1TransformAnim = this.getTransformString(this.icon1XAnim, this.icon1YAnim, this.icon1ScaleAnim, this.icon1Anim.rotate);
    if (this.icon2Path !== null) {
        this.icon2Transform = this.getTransformString(this.icon2X, this.icon2Y, this.icon2Scale, this.icon2Init.rotate);
        this.icon2TransformAnim = this.getTransformString(this.icon2XAnim, this.icon2YAnim, this.icon2ScaleAnim, this.icon2Anim.rotate);
    }

    if ((this.hoverMode !== null) || (this.clickMode != null)) {
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
        this.icon1StrokeWidth = 1.5;
        this.icon1Color = "none";
    }

    if (this.icon2Stlye === "stroke") {
        this.icon2Stroke = this.icon2Color;
        this.icon2StrokeWidth = 2;
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

    this.iconRect = this.raphael.rect(0, 0, iconWidth, iconHeight);
    this.iconRect.attr({ fill: "#FFF", "fill-opacity": 0, stroke: "none", cursor: "pointer" });

    this.iconHolder = this.raphael.set();

    if (this.icon2 !== undefined) {
        this.iconHolder.push(
            this.icon1,
            this.icon2,
            this.iconRect
        );
    }
    else {
        this.iconHolder.push(
            this.icon1,
            this.iconRect
        );
    }

    var thishybicon = this;

    if (this.hoverMode !== null) {
        this.iconHolder.mouseover(function () {
            if (thishybicon.hovered !== true &&
                thishybicon.clicked !== true) {
                thishybicon.hovered = true;
                thishybicon.animateIcon(true);
            }
        });
        this.iconHolder.mouseout(function () {
            if (thishybicon.clicked !== true) {
                thishybicon.hovered = false;
                thishybicon.animateIcon(false);
            }
        });
    }

    if (this.clickMode !== null) {
        this.iconHolder.click(function () {
            if (thishybicon.clicked !== true) {
                thishybicon.clicked = true;
                thishybicon.animateIcon(true);
            }
            else {
                thishybicon.clicked = false;
                thishybicon.animateIcon(false);
            }
        });
    }

    return this;
};

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
            this.icon2Anim.size = icon2SizeDefault;
        }
        else {
            this.icon1Anim.centerX = this.icon2Init.centerX;
            this.icon1Anim.centerY = this.icon2Init.centerY;
            this.icon2Anim.centerX = this.icon1Init.centerX;
            this.icon2Anim.centerY = this.icon1Init.centerY;
            if (this.icon2Init.size === 0) { this.icon1Anim.size = icon2SizeDefault; }
            else { this.icon1Anim.size = this.icon2Init.size; }
            if (this.icon2Anim.size === null) { this.icon2Init.size = icon2SizeDefault; }
            else { this.icon2Init.size = this.icon2Anim.size; }
            this.icon2Anim.size = this.icon1Init.size;
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

hybicon.prototype.getTransformString = function (x, y, scale, rotate) {
    return "t" + x.toString() + "," + y.toString() + "s" + scale.toString() + "r" + rotate.toString();
};

//Identifiers
hybicon.prototype.getSvgId = function () {
    return this.holderId + "-svg";
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

