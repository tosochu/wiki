const YAML=require('yamljs');
var Config=YAML.load('./data/config.yaml');

module.exports=(config,HTML)=>{
    var _=config._;
    return`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">${config.title} - ${Config.title}</title>
        <script src="https://topan-dev.github.io/TopanUI/src/jquery.js"></script>
        <link rel="stylesheet" href="https://topan-dev.github.io/TopanUI/topan.css">
        <script src="https://topan-dev.github.io/TopanUI/topan.js"></script>
        ${config.header}
    </head>
    <body>
        <div class="topan-header">
            <div class="topan-header-home">
                <a href="/${Config.on}">
                    <button class="topan-button-ordinary topan-button-commonly topan-button-header-round-left">
                        <i class="fa fa-home"></i>
                    </button>
                </a>
            </div>
            <div class="topan-header-left">
                <span class="topan-header-text">${Config.title}&nbsp;</span>
                <a href="/${Config.on}/player">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onplayer?"-showed":""}">
                        <i class="fa fa-solid fa-user"></i>
                        <span>&nbsp;Players</span>
                    </span>
                </a>
                <a href="/${Config.on}/game">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.ongame?"-showed":""}">
                        <i class="fa fa-solid fa-fire"></i>
                        <span>&nbsp;Games</span>
                    </span>
                </a>
            </div>
            <div class="topan-header-right">
            </div>
        </div>
        <div class="topan-outer">
            <div class="topan-page">
                <div class="topan-mainpage-auto">
                    <br>
                    ${HTML}
                    <br>
                </div>
                <footer class="topan-footer">
                    <p></p>
                    <p style="text-align: center; color: #555; font-size: 12px;">
                        Powered by <a href="https://github.com/tosochu/wiki.git">tosochu/wiki</a>&nbsp;&nbsp;&nbsp;
                        © 2023 <a href="https://github.com/Molmin/">Milmon</a> & <a href="https://github.com/hexuben/">hexuben</a>
                    </p>
                </footer>
            </div>
        </div>
    </body>
</html>
    `;
};