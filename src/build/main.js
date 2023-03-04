const fs=require('fs');
const path=require('path');
const ejs=require('ejs');
const Template=require('./template.js');
const dayjs=require('dayjs');

const YAML=require('yamljs');
var Config=YAML.load('./data/config.yaml');
var MarkdownIt=require('markdown-it')({
    html: true,
    linkify: true
});

var deleteDir=(url)=>{
    if(fs.existsSync(url)){
        var files=[];
        files=fs.readdirSync(url);
        files.forEach((file,index)=>{
            var curPath=path.join(url,file);
            if(fs.statSync(curPath).isDirectory())
                deleteDir(curPath);
            else fs.unlinkSync(curPath);
        });
        fs.rmdirSync(url);
    }
}
var toStandardTime=(time)=>{
    if(typeof time=='number')return time;
    var temp=time.split(':');
    return Number(temp[0])*60+Number(temp[1]);
}
var timeToString=(time)=>{
    var hour=parseInt(time/60),
        minute=time%60;
    var res="";
    var displayHour=hour!=0,
        displayMinute=minute!=0;
    if(displayHour)res+=String(hour)+" h";
    if(displayHour&&displayMinute)res+=" ";
    if(displayMinute)res+=String(minute)+" m";
    console.log(hour,minute,displayMinute,displayHour,res);
    return res;
}

deleteDir("dist");
fs.mkdirSync("dist");
fs.mkdirSync("dist/player");
fs.mkdirSync("dist/game");

ejs.renderFile("./src/templates/home.html",{
    README: MarkdownIt.render(fs.readFileSync(`./data/${Config.readme}`,{encoding:'utf8',flag:'r'}))
},(err,HTML)=>{
    fs.writeFileSync("./dist/index.html",
        Template({title: `Home`,
                  header: ``
                 },HTML));
});

Config.games.forEach((game,index)=>{
    var detail=YAML.load(`./data/${game.file}`);
    detail.date=require('dayjs')(detail.date).format("M / D / YYYY");
    detail.length=timeToString(toStandardTime(detail.length));
    console.log(detail.length);
    Config.games[index].detail=detail;
});

console.log(JSON.stringify(Config,null,"  "));

ejs.renderFile("./src/templates/game_list.html",{
    data: Config
},(err,HTML)=>{
    fs.writeFileSync("./dist/game/index.html",
        Template({title: `Games List`,
                  header: ``
                 },HTML));
});

const ghpages=require('gh-pages');
ghpages.publish('dist',function(err){});