module.exports = (json) => {
    var warnings = new Array(), _return;
    try {
        if (!json.title || !json.date || !json.length || !json.message)
            throw "必须包含 title，date，length 和 message 字段。";
        json.message.forEach(m => {
            if (!m.person) throw "每条记录必须包含玩家信息。";
            if (!m.type) throw "每条记录必须有一个类型。";
            if (![
                'catched', 'waiver', 'win', 'revive',
                'companion-win', 'money-game', 'openning-game',
                'money-game-catched', 'money-game-win'
            ].includes(m.type)) throw "类型不合法。";
            if (m.type == 'revive' && !m.reviver) throw "复活必须包含第二方玩家。";
            if (m.type == 'companion-win' && !m.rely) throw "联合获胜必须有依赖方。";
            if (m.type == 'money-game' && !m.challenger) throw "Money Game 必须包含获胜者。";
        });
        if (!json.video) warnings.push('缺失视频。');
        if (!json.chart) warnings.push('缺失奖金变更图。');
        else json.chart.forEach(x => {
            if (!x.time || (!x.money && x.money != 0)) throw "图表数据不合法。";
        });
        if (warnings.length) _return = { status: 1, text: warnings };
        else _return = { status: 0, text: `` };
    }
    catch (e) {
        _return = { status: 2, text: err.message || String(err) };
    }
}