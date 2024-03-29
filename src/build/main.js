const fs=require('fs');
const path=require('path');
const ejs=require('ejs');
const Template=require('./template.js');
const Player=require('./player.js');
const Checker=require('./check.js');

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
    if(displayMinute)res+=String(minute)+" 分";
    if(displayMinute&&displaySecond)res+=" ";
    if(displaySecond)res+=String(second)+" 秒";
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
        Template({title: `トップ`,
                  header: ``
                 },HTML));
});

Config.player=new Array();
var playerSet=new Set();
var rounds_check_result={text:``,err:0,warn:0},
    rounds_check_render={};

Config.games.forEach((game,index)=>{
    var detail=YAML.load(`./data/${game.file}`),playerset=new Set(),players=new Array();
    var timeline={};
    {
        var {status,text}=Checker(detail);
        rounds_check_render[String(game.id)]=status;
        if(status==0)rounds_check_result.text+=`Round ${game.id}: Very Good!\n`;
        else if(status==1)rounds_check_result.warn++,
            rounds_check_result.text+=`Round ${game.id}: Get Warnings: ${text.join('')}\n`;
        else rounds_check_result.err++,
            rounds_check_result.text+=`Round ${game.id}: Get Error: ${text}\n`;
    }
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
        if(message.time==0)message.time="ゲーム終了時",message.numberTime=0;
        else if(toStandardTime(message.time)==detail.length*60) // Round #7
            message.time="オペニーングゲーム 確保",message.numberTime=toStandardTime(message.time),
            message.display=`確保`;
        else message.numberTime=toStandardTime(message.time),
            message.time=secondsToString(toStandardTime(message.time));

        if(message.type=="catched")    message.display=`確保。`;
        if(message.type=="win")        message.display=`逃走成功。`;
        if(message.type=="revive")     message.display=`${message.reviver} を復活。`;
        if(message.type=="waiver")     message.display=`自首成立。`;

        // Round #43
        if(message.type=="companion-win")  message.display=``;

        // Round #49 ~ #51
        if(message.type=="money-game"){
            message.display=`<strong>賞金ゲーム！</strong>&#10;`;
            message.display+="<strong>黑体</strong>は代表者&#10;";
        }

        // Round #7
        if(message.type=="money-game-catched")
            message.display=`賞金ゲームは敗北 ${message.money} 円没収！`
        if(message.type=="money-game-win")
            message.display=`賞金ゲームは成功！`;

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
                message.display+=`${message.money} 円獲得 (${message.rely} 逃走成功)`;
            else if(message.type=="money-game-win")
                message.display+=`また ${message.money} 円獲得`;
            else if(message.person.split(",").length>1)
                message.display+=`一緒に ${message.money} 円獲得`;
            else message.display+=`${message.money} 円獲得`;
        }
        if(message.description)message.display=message.description;
    });
    for(var player of playerset)players.push(player);
    detail.player=players;
    detail.date=require('dayjs')(detail.date).format("M / D / YYYY");
    var gameLength=toStandardTime(detail.length);
    detail.length=`${gameLength} 分`;
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
    var chart={
        chart: { type: 'area' },
        title: { text: '賞金変更' },
        subtitle: { text: `第 ${game.id} 回 — ${game.detail.title}` },
        tooltip: { shared: true, valueSuffix: ' 円' },
        credits: { enabled: false },
        plotOptions: { area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        } },
        xAxis: {
            categories: new Array(),
            title: { enabled: false },
            tickmarkPlacement: 'on'
        },
        yAxis: {
            title: { enabled: false }
        },
        series: [{
            name: '当前時点の賞金',
            data: new Array()
        }],
        display: true
    };
    if(game.detail.chart){
        game.detail.chart.forEach(node=>{
            chart.xAxis.categories.push(node.time);
            chart.series[0].data.push(node.money);
        });
    }
    else chart={display: false};
    ejs.renderFile("./src/templates/game_detail.html",{
        data: Config.games[index], chart,
        description: MarkdownIt.render(game.detail.description),
    },(err,HTML)=>{
        fs.writeFileSync(`./dist/game/${game.id}.html`,
            Template({title: `第 ${game.id} 回：${game.detail.title}`,
                      header: ``,
                      ongame: true
                     },HTML));
        fs.writeFileSync(
            `./dist/game/${game.id}.yaml`,
            fs.readFileSync(`./data/${game.file}`,'utf8')
        );
    });
});

ejs.renderFile("./src/templates/game_list.html",{
    data: Config
},(err,HTML)=>{
    fs.writeFileSync("./dist/game/index.html",
        Template({title: `ゲーム`,
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
        Template({title: `プレイヤー`,
                  header: ``,
                  onplayer: true
                 },HTML));
});

ejs.renderFile("./src/templates/tool.html",{
    data: Config, check: rounds_check_render
},(err,HTML)=>{
    fs.writeFileSync("./dist/tool.html",HTML);
});

fs.writeFileSync(
    "rounds-check-result",
    `Total Found ${rounds_check_result.err} Rounds Get Errors.\n`
  + `Total Found ${rounds_check_result.warn} Rounds Get Warnings.\n`
  + rounds_check_result.text
);

if(process.argv.slice(2).includes("-github")){
    const ghpages=require('gh-pages');
    ghpages.publish('dist',console.log);
}