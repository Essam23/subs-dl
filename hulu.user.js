// ==UserScript==
// @name         hulusubs-dl
// @namespace    https://www.hulu.com
// @version      0.1
// @description  Get eab_id
// @author       subdiox
// @match        https://www.hulu.com/watch/*
// @grant        none
// @copyright  2021, subdiox
// ==/UserScript==

(function() {
    'use strict';

    var x = new XMLHttpRequest;
    x.open("GET","https://discover.hulu.com/content/v5/deeplink/playback?namespace=entity&schema=1&id="+window.location.href.split("/").pop(),!1);
    x.withCredentials=!0;
    x.send(null);
    alert(JSON.parse(x.responseText)['eab_id'].split('::')[2]);
})();