const fs=require('fs');
const path=require('path');
const ejs=require('ejs');
const Template=require('./template.js');

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
    return res;
}
var secondsToString=(time)=>{
    var minute=parseInt(time/60),
        second=time%60;
    var res="";
    var displayMinute=minute!=0,
        displaySecond=second!=0;
    if(displayMinute)res+=String(minute)+" m";
    if(displayMinute&&displaySecond)res+=" ";
    if(displaySecond)res+=String(second)+" s";
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
    var detail=YAML.load(`./data/${game.file}`),playerset=new Set(),players=new Array();
    detail.message.forEach((message)=>{
        if(typeof message.person=="string"){
            var temp=message.person;
            message.person=new Array(),
            message.person.push(temp);
        }
        message.person.forEach((player)=>{
            playerset.add(player);
        });
        if(!message.time)message.time=0;
        if(!message.money)message.money=0;
        if(message.time==0)message.time="End of the Game";
        else message.time=secondsToString(toStandardTime(message.time));

        if(message.type=="catched")    message.display=`Caught! `;
        if(message.type=="win")        message.display=`Escaped! `;
        if(message.type=="revive")     message.display=`Revived by ${message.reviver}. `;

        // Round #43
        if(message.type=="companion-save") message.display=`Saved by ${message.saver}. `;
        if(message.type=="companion-win")  message.display=``;

        // Round #49 ~ #51
        if(message.type=="money-game"){
            message.display=`<strong>Money Game!</strong>&#10;`;
            message.display+="The bolds won the money game.&#10;";
        }
        var temp="";
        message.person.forEach((player,playerIndex)=>{
            if(message.type=="money-game"&&message.challenger.includes(player))
                temp+=`<strong>${player}</strong>`;
            else temp+=`${player}`;
            if(playerIndex!=message.person.length-1)temp+=`, `;
            if(playerIndex%5==4)temp+=`&#10;`;
        });
        message.person=temp;

        if(message.money>0){
            if(message.type=="companion-win")
                message.display+=`Got ${message.money} yen because of ${message.rely}'s success.`;
            else if(message.person.split(",").length>1)
                message.display+=`Got ${message.money} yen together.`;
            else message.display+=`Got ${message.money} yen.`;
        }
    });
    for(var player of playerset)players.push(player);
    detail.player=players;
    detail.date=require('dayjs')(detail.date).format("M / D / YYYY");
    detail.length=timeToString(toStandardTime(detail.length));
    Config.games[index].detail=detail;
    ejs.renderFile("./src/templates/game_detail.html",{
        data: Config.games[index],
        description: MarkdownIt.render(game.detail.description)
    },(err,HTML)=>{
        fs.writeFileSync(`./dist/game/${game.id}.html`,
            Template({title: `Games List`,
                      header: ``
                     },HTML));
    });
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

if(process.argv.slice(2).includes("-github")){
    const ghpages=require('gh-pages');
    ghpages.publish('dist',function(err){});
}