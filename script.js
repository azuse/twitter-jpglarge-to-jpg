// ==UserScript==
// @name         twitter large
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change jfif to jpg
// @author       azuse
// @match        https://twitter.com*
// @match        https://twitter.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==

(function() {
    // Select the node that will be observed for mutations
    var targetNode = $("body")[0];

    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList) {


        var a=$("img[src*='?format=jpg&name=']");
        a.each(function(){
            //alert($(this).attr("src"));
            $(this).attr("src",String($(this).attr("src")).replace(/\?format=jpg&name=.*/,".jpg?name=large"));
            //alert($(this).attr("src"));
        });
        var b=$("img[src*='png:large']");
        b.each(function(){
            $(this).attr( "src",String($(this).attr("src")).replace(/png:large/,"png"));
        });
        //alert("");
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();