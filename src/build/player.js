const YAML=require('yamljs');
var Config=YAML.load('./data/config.yaml');
Config.dictionary=YAML.load(`./data/${Config.dictionary}`);
const crypto=require('crypto');

var getSymbol=player=>{
    const SHA256=crypto.createHash('sha256');
    var sha256=SHA256.update(player,'utf8').digest('hex');
    return sha256.substr(28,8);
};

var getStandardSymbol=player=>{
    if(Config.dictionary[player])return Config.dictionary[player];
    else return getSymbol(player);
};

module.exports={
    getSymbol, getStandardSymbol
};