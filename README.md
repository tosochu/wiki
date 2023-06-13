## Tosochu Wiki

这里是 [**《全员逃走中》**](https://www.fujitv.co.jp/tosochu/top.html) 的**非官方** Wiki。收录了每一回的数据，并给每个玩家计算了**总钱数、逃走率**等，您可以点击上方按钮查看。

**《全员逃走中》**（原文：Run for money 逃走中，简称：RFM / 逃走中）是**日本富士电视台**著作出品的**生存类实景综艺**游戏节目，自 2004 年起季间不定期放送。

**本项目的代码仓库：** [https://github.com/tosochu/wiki.git](https://github.com/tosochu/wiki.git)

本项目主要由 [Milmon](https://github.com/Molmin) 和 [hexuben](https://github.com/hexuben) 维护。如果你喜欢本项目，欢迎给我们点亮 Star！如果您愿意帮助我们搜集数据，也可以进行 [Pull Request](https://github.com/tosochu/wiki/compare)。

### 逃走率

Tosochu Wiki 将会给每个玩家计算平均以及单个回合的逃走率，并提供逃走率排序。每个玩家的平均逃走率是他（她）在参与的每个回合中的逃走率的平均值。

注：在排序方式中，[Rate of Escape](https://tosochu.github.io/wiki/player/?sort=escapeRate) 是按照玩家平均逃走率排名，而 [Rate of Escape (Upgraded version)](https://tosochu.github.io/wiki/player/?sort=escapeRateBetter) 是先按照**参与回合数**排序，再对**分别**对参与回合数为 1，2，以及大于等于 3 的玩家的逃走率排序（[对应源码部分](https://github.com/tosochu/wiki/blob/master/src/templates/player_list.html#L89-L94)）。（我们提供这种排序方式，是因为参与回合数**过少**时，平均逃走率**并不准确**。）

下面是玩家在单个回合中的逃走率计算方式（[源代码](https://github.com/tosochu/wiki/blob/master/src/build/main.js#L150-L175)）：

- 列出该玩家在该回合中的 [活动事件列表](https://github.com/tosochu/wiki/blob/master/src/build/main.js#L72-L74)；

- 遇到 Caught（被抓）或自首事件时，将其时间戳与上一次复活或游戏开始事件差值加入总和中；

- 将总和除以游戏总时长，就得到逃走率；

- 在 Money Game（[Round #7](https://tosochu.github.io/wiki/game/7.html)）中失败的玩家的逃走率记为 99.99%。（因为他们并没有完美地完成游戏。）