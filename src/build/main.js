const fs=require('fs');
const path=require('path');
const ejs=require('ejs');
const Template=require('./template.js');
const Player=require('./player.js');

const YAML=require('yamljs');
var Config=YAML.load('./data/config.yaml');
Config.dictionary=YAML.load(`./data/${Config.dictionary}`);
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

Config.player=new Array();
var playerSet=new Set();

Config.games.forEach((game,index)=>{
    var detail=YAML.load(`./data/${game.file}`),playerset=new Set(),players=new Array();
    var timeline={};
    detail.message.forEach((message)=>{
        if(typeof message.person=="string"){
            var temp=message.person;
            message.person=new Array(),
            message.person.push(temp);
        }
        message.person.forEach((player)=>{
            if(!timeline[player])
                timeline[player]=new Array();
            timeline[player].push(message);
            if(!playerSet.has(player))
                playerSet.add(player),
                Config.player.push({
                    name: player,
                    standardSymbol: Player.getStandardSymbol(player),
                    symbol: Player.getSymbol(player),
                    record: []
                });
            if(!playerset.has(player)){
                playerset.add(player);
                var i=0; while(Config.player[i].name!=player)i++;
                Config.player[i].record.push({id: index, money: 0});
            }
        });
        if(!message.time)message.time=0;
        if(!message.money)message.money=0;
        if(message.time==0)message.time="End of the Game",message.numberTime=0;
        else if(toStandardTime(message.time)==detail.length*60) // Round #7
            message.time="Openning Game",message.numberTime=toStandardTime(message.time),
            message.display=`Caught! `;
        else message.numberTime=toStandardTime(message.time),
            message.time=secondsToString(toStandardTime(message.time));

        if(message.type=="catched")    message.display=`Caught! `;
        if(message.type=="win")        message.display=`Escaped! `;
        if(message.type=="revive")     message.display=`Revived by ${message.reviver}. `;
        if(message.type=="waiver")     message.display=`Waiver! `;

        // Round #43
        if(message.type=="companion-save") message.display=`Saved by ${message.saver}. `;
        if(message.type=="companion-win")  message.display=``;

        // Round #49 ~ #51
        if(message.type=="money-game"){
            message.display=`<strong>Money Game!</strong>&#10;`;
            message.display+="The bolds won the money game.&#10;";
        }

        // Round #7
        if(message.type=="money-game-catched")
            message.display=`Lose the money game! Confiscate ${-message.money} yen!`
        if(message.type=="money-game-win")
            message.display=`Win the money game! `;

        var temp="";
        message.person.forEach((player,playerIndex)=>{
            var playerhtml=`<a href="/${Config.on}/player/${Player.getStandardSymbol(player)}.html">${player}</a>`;
            if(message.type=="money-game"&&message.challenger.includes(player))
                temp+=`<strong>${playerhtml}</strong>`;
            else temp+=`${playerhtml}`;
            if(playerIndex!=message.person.length-1)temp+=`, `;
            if(playerIndex%5==4)temp+=`&#10;`;

            var i=0; while(Config.player[i].name!=player)i++;
            var newrecord=Config.player[i].record[Config.player[i].record.length-1];
            newrecord.money+=parseInt(message.money/message.person.length/100)*100;
            Config.player[i].record[Config.player[i].record.length-1]=newrecord;
        });
        message.person=temp;

        if(message.money>0){
            if(message.type=="companion-win")
                message.display+=`Got ${message.money} yen because of ${message.rely}'s success.`;
            else if(message.type=="money-game-win")
                message.display+=`Got another ${message.money}.`;
            else if(message.person.split(",").length>1)
                message.display+=`Got ${message.money} yen together.`;
            else message.display+=`Got ${message.money} yen.`;
        }
    });
    for(var player of playerset)players.push(player);
    detail.player=players;
    detail.date=require('dayjs')(detail.date).format("M / D / YYYY");
    var gameLength=toStandardTime(detail.length);
    detail.length=`${gameLength} m`;
    for(var person in timeline){
        var i=0; while(Config.player[i].name!=person)i++;
        var line=timeline[person],res=0;
        var status="escape",lastTime=gameLength*60,flag=false;
        line.forEach(event=>{
            if(event.type=='catched'||event.type=="waiver"){
                if(status=="escape")
                    res+=lastTime-event.numberTime,
                    status="catch",
                    lastTime=event.numberTime;
            }
            if(event.type=='win'){
                if(status=="escape")
                    res+=lastTime-event.numberTime;
            }
            if(event.type=='revive'){
                if(status=="catch")
                    lastTime=event.numberTime,
                    status="escape";
            }
            if(event.type=='money-game-catched')
                flag=true; // 输掉 Money Game 的显示 99.99%，因为他们并没有完美完成
        });
        Config.player[i].record
            [Config.player[i].record.length-1].escapeRate=flag?0.9999:res/(gameLength*60);
    }
    if(detail.video)
        detail.videohtml=`
        <iframe src="//player.bilibili.com/player.html?${detail.video.startsWith('BV')?'bvid':'aid'}=${detail.video}&autoplay=0"
            scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="500px"></iframe>
        `;
    game.detail=detail;
    ejs.renderFile("./src/templates/game_detail.html",{
        data: Config.games[index],
        description: MarkdownIt.render(game.detail.description)
    },(err,HTML)=>{
        fs.writeFileSync(`./dist/game/${game.id}.html`,
            Template({title: `第 ${game.id} 回：${game.detail.title}`,
                      header: ``,
                      ongame: true
                     },HTML));
    });
});

ejs.renderFile("./src/templates/game_list.html",{
    data: Config
},(err,HTML)=>{
    fs.writeFileSync("./dist/game/index.html",
        Template({title: `Games List`,
                  header: ``,
                  ongame: true
                 },HTML));
});

Config.player=Config.player.sort((x,y)=>{
    if(x.symbol==x.standardSymbol&&y.symbol==y.standardSymbol)
        return x.symbol.localeCompare(y.symbol);
    if(x.symbol!=x.standardSymbol&&y.symbol!=y.standardSymbol)
        return x.standardSymbol.localeCompare(y.standardSymbol);
    return y.symbol==y.standardSymbol?-1:1;
});

Config.player.forEach(player=>{
    player.money=0,player.escapeRate=0;
    player.record.forEach(record=>{
        player.money+=record.money;
        player.escapeRate+=record.escapeRate;
    });
    player.escapeRate/=player.record.length;
    player.lastTime=Config.games[player.record[player.record.length-1].id].id;
    ejs.renderFile("./src/templates/redirect.html",{
        url: `/${Config.on}/player/${player.standardSymbol}.html`
    },(err,HTML)=>{
        fs.writeFileSync(`./dist/player/${player.symbol}.html`,HTML);
    });
    ejs.renderFile("./src/templates/player_detail.html",{
        data: player,
        games: Config.games,
        on: Config.on
    },(err,HTML)=>{
        fs.writeFileSync(`./dist/player/${player.standardSymbol}.html`,
            Template({title: `${player.name+(player.standardSymbol!=player.symbol
                        &&player.name!=player.standardSymbol?` (${player.standardSymbol})`:'')}`,
                      header: ``,
                      onplayer: true
                     },HTML));
    });
});

console.log(Config);
console.log(JSON.stringify(Config,null,"  "));

ejs.renderFile("./src/templates/player_list.html",{
    data: Config
},(err,HTML)=>{
    fs.writeFileSync("./dist/player/index.html",
        Template({title: `Players List`,
                  header: ``,
                  onplayer: true
                 },HTML));
});

if(process.argv.slice(2).includes("-github")){
    const ghpages=require('gh-pages');
    ghpages.publish('dist',console.log);
}