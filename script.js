// ==UserScript==
// @name         twitter large
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       azuse [misakaxindex@gmail.com]
// @match        https://twitter.com*
// @match        https://twitter.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.7.0.min.js
// ==/UserScript==

(function () {

    function extractFilename(url) {
        url = String(url)
        // example: [https://pbs.twimg.com/media/EI5XZXEVUAACaZl.jpg:large] -> [EI5XZXEVUAACaZl.jpg]
        name = url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf(":"))
        return name
    }

    // Select the node that will be observed for mutations
    var targetNode = $("body")[0];

    // Options for the observer (which mutations to observe)
    var config = {
        attributes: true,
        childList: true,
        subtree: true
    };

    // Callback function to execute when mutations are observed
    var src_history = ""
    var callback = function (mutationsList) {
        var a = $("img[src*='jpg:large']");
        a.each(function () {
            if (src_history.indexOf($(this).src) != -1)
                return

            src_history += $(this).src
            // old way:
            //$(this).attr("src",String($(this).attr("src")).replace(/jpg:large/,"jpg"));

            // new way:
            var src = String($(this).attr("src")).replace(/jpg:large/, "jpg:orig") // orig provides better than large SOMETIMES
            image_name = extractFilename(src)

            var img = new Image
            canvas = document.createElement("canvas")
            document.body.appendChild(canvas)
            ctx = canvas.getContext("2d")
            src = src; // insert image url here

            img.crossOrigin = "Anonymous";

            var that = this
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                // localStorage.setItem("savedImageData", canvas.toDataURL("image/png"));
                image_base64 = canvas.toDataURL("image/png")
                // warp an <a> outside <img> to use "downlaod" attribute
                a = document.createElement("a")
                a.onclick = function(){
                    canvas.toBlob(function(blob) {
                        // saveAs(blob, image_name);
                        filename = image_name
                        var file = blob;
                        if (window.navigator.msSaveOrOpenBlob) // IE10+
                            window.navigator.msSaveOrOpenBlob(file, filename);
                        else { // Others
                            var a = document.createElement("a"),
                                    url = URL.createObjectURL(file);
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(function() {
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(url);  
                            }, 0); 
                        }
                    });
                }

                $(canvas).addClass("media-image")
                a.appendChild(canvas)

                parentNode = $(that)[0].parentNode
                parentNode.innerHTML = ""
                parentNode.appendChild(a)

            }
            img.src = src;
            // make sure the load event fires for cached images too
            if (img.complete || img.complete === undefined) {
                img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                img.src = src;
            }


        });
        var b = $("img[src*='png:large']");
        b.each(function () {
            $(this).attr("src", String($(this).attr("src")).replace(/png:large/, "png"));
        });
        //alert("");
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();