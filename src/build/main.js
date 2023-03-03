const fs=require('fs');
if(!fs.existsSync("dist"))fs.mkdirSync("dist");
fs.writeFileSync("dist/index.html",fs.readFileSync("data/round1.yaml",'utf8',(err,data)=>{}),(err)=>{});
var ghpages=require('gh-pages');
fs.exi;
ghpages.publish('dist',function(err){});