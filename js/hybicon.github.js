/* ======================================================================================= */
/*                            hybicon.github.js - v1.0.0                                   */
/* ======================================================================================= */
/* This is a small JavaScript library for GitHub API with hybicon.                         */
/* Requires hybicon.js (http://hybicon.softwaretailoring.net)                              */
/* ======================================================================================= */
/* Check http://hybicon.softwaretailoring.net/github.html for samples.                     */
/* Fork https://github.com/softwaretailoring/hybicon for contribution.                     */
/* ======================================================================================= */
/* Copyright © 2015 Gábor Berkesi (http://softwaretailoring.net)                           */
/* Licensed under MIT (https://github.com/softwaretailoring/hybicon/blob/master/LICENSE)   */
/* ======================================================================================= */

/* ======================================================================================= */
/* Documentation: http://hybicon.softwaretailoring.net                                     */
/* ======================================================================================= */

hybicongithub = function (divId) {

    this.version = "1.0.0";

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
                    callbacktype === "release") {
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
            if (objdata[i].assets !== null) {
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
        if (objdata.assets !== null) {
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