//a phantomjs example, saved as img
var system = require('system');

var url = "http://javascript.ruanyifeng.com/tool/phantomjs.html#toc7";
url = system.args[1] || "http://www.baidu.com";

var page = require('webpage').create();
page.viewportSize = {
      width: 1080,
      height:600
};
page.open(url, function(status) {
    if ( status === "success" ) {
        console.log(page.title); 
        page.render("front-Thinking.png",  {format: 'png', quality: '100'});
    } else {
        console.log("Page failed to load."); 
    }
    phantom.exit(0);
});
