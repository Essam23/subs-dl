// ==UserScript==
// @name         hulusubs-dl
// @namespace    https://www.hulu.com
// @version      0.1
// @description  Get eab_id
// @author       subdiox
// @match        https://www.hulu.com/watch/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_xmlhttpRequest
// @copyright  2021, subdiox
// ==/UserScript==

waitForKeyElements('.PlayerSettingsGroup', pageDidLoad);

function pageDidLoad(jNode) {
    jNode.append('<div id="download-button" aria-label="Download" tabindex="0" role="button" class="PlayerButton PlayerControlsButton" style="touch-action: none;">' +
    '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29.978 29.978" style="enable-background:new 0 0 29.978 29.978;" xml:space="preserve">' +
	'<path d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012 v-8.861H25.462z" fill="#FEFEFE" fill-rule="evenodd"/>' +
	'<path d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723 c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742 c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193 C15.092,18.979,14.62,18.426,14.62,18.426z" fill="#FEFEFE" fill-rule="evenodd"/>' +
    '</svg></div>');
    document.getElementById('download-button').addEventListener('click', downloadDidClick);
}

function downloadDidClick() {
   var x = new XMLHttpRequest;
    x.open('GET', 'https://discover.hulu.com/content/v5/deeplink/playback?namespace=entity&schema=1&id=' + window.location.href.split('/').pop(), !1);
    x.withCredentials = !0;
    x.send(null);
    console.log(x.responseText);
    var json = JSON.parse(x.responseText);
    const eab_id = json.eab_id.split('::')[2];
    x.open('GET', 'https://discover.hulu.com/content/v3/entity?device_context_id=1&language=en&referral_host=www.hulu.com&schema=4&eab_ids=' + json.eab_id, !1);
    x.withCredentials = !0;
    x.send(null);
    json = JSON.parse(x.responseText);
    console.log(json);
    const series = json.items[0].series_name;
    const season = json.items[0].season;
    const number = json.items[0].number;
    const name = json.items[0].name;
    const filename = series + ' S' + season + ' E' + number + ' - ' + name + '.srt';
    x = new XMLHttpRequest;
    x.open('GET', 'https://www.hulu.com/captions.xml?content_id=' + eab_id, !1);
    x.withCredentials = !0;
    x.send(null);
    const parser = new DOMParser();
    const xml = parser.parseFromString(x.responseText, "text/xml");
    const url = xml.getElementsByTagName('en')[0].childNodes[0].nodeValue;
    const vttUrl = url.replace('captions', 'captions_webvtt').replace('.smi', '.vtt');
    GM_xmlhttpRequest({
        method: 'GET',
        url: vttUrl,
        onload: function (response) {
            var srt = '';
            const vtt = response.responseText;
            for (const vttLine of vtt.split('\n')) {
                srt += vttLine.replace(/(WEBVTT\s*(FILE)?.*)(\r\n)*/g, '').replace(/(\d{2}:\d{2}:\d{2})\.(\d{3}\s+)\-\-\>(\s+\d{2}:\d{2}:\d{2})\.(\d{3}\s*)/g, '$1,$2-->$3,$4').replace(/\<.+\>(.+)/g, '$1').replace(/\<.+\>(.+)\<.+\/\>/g, '$1') + '\r\n';
            }
            downloadURI('data:text/html,' + srt, filename);
        }
    });
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}