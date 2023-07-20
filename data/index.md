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

- 部分玩家虽然整场游戏中都未被抓捕甚至获得了赏金，但由于游戏中的特殊规则，他们的奖金会被没收或者得到了 99.99% 的逃走率，下面将一一列举：

  - [第七回 お台場2](https://tosochu.github.io/wiki/game/7.html) 中，[眞鍋かをり](https://tosochu.github.io/wiki/player/manabe-kawori.html)、[川合俊一](https://tosochu.github.io/wiki/player/kawai-shunichi.html) 等玩家在附加环节中失利，导致他们先前获得的 1,260,000 日元奖金全部没收。这里的原因是他们并没有完美地完成游戏。

  - [第三十九回 時空を超える決戦(後編)](https://tosochu.github.io/wiki/game/39.html) 中，[えなりかずき](https://tosochu.github.io/wiki/player/enari-kazuki.html) 由于参加了后半战并且战败，导致他在[前半战](https://tosochu.github.io/wiki/game/38.html)中收获的 1,080,000 日元奖金全部没收。

## 数据进度

由于本项目人力过少，导致数据不完整。为避免不必要的误会，如下将展示本 wiki 数据进度。

<p><h2 style="font-family: 宋体;"><center>每回数据进度</center></h2></p>
<center>
<table class="data-process-tip">
	<tr>
		<th class="data-process-tip-block completed">​Comp.</th>
		<th class="data-process-tip-text">​​Completed</th>
		<th class="data-process-tip-block inputing">​Inpt.</th>
		<th class="data-process-tip-text">​Inputing data</th>
	</tr>
	<tr>
		<th class="data-process-tip-block ​collecting">​Coll.</th>
		<th class="data-process-tip-text">​​Collecting data</th>
		<th class="data-process-tip-block empty">Empt.</th>
		<th class="data-process-tip-text">Empty data</th>
	</tr>
</table>
</center>

<center>
	<table class="data-process-detail">
		<thead>
			<tr>
				<th>回数</th><th>状态</th>
				<th>回数</th><th>状态</th>
				<th>回数</th><th>状态</th>
				<th>回数</th><th>状态</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><a href="/wiki/game/1.html">第一回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/2.html">第二回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/3.html">第三回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/4.html">第四回</a></td><td class="completed">Comp.</td>
			</tr>
			<tr>
				<td><a href="/wiki/game/5.html">第五回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/6.html">第六回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/7.html">第七回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/8.html">第八回</a></td><td class="completed">Comp.</td>
			</tr>
			<tr>
				<td><a href="/wiki/game/9.html">第九回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/10.html">第十回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/11.html">第十一回</a></td><td class="completed">Comp.</td>
				<td>第十二回</td><td class="inputing">Inpt.</td>
			</tr>
			<tr>
				<td>第十三回</td><td class="empty">Empt.</td>
				<td>第十四回</td><td class="empty">Empt.</td>
				<td>第十五回</td><td class="empty">Empt.</td>
				<td>第十六回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td><a href="/wiki/game/17.html">第十七回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/18.html">第十八回</a></td><td class="completed">Comp.</td>
				<td>第十九回</td><td class="empty">Empt.</td>
				<td>第二十回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td>第二十一回</td><td class="empty">Empt.</td>
				<td>第二十二回</td><td class="empty">Empt.</td>
				<td>第二十三回</td><td class="empty">Empt.</td>
				<td>第二十四回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td><a href="/wiki/game/25.html">第二十五回</a></td><td class="completed">Comp.</td>
				<td>第二十六回</td><td class="empty">Empt.</td>
				<td>第二十七回</td><td class="empty">Empt.</td>
				<td>第二十八回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td>第二十九回</td><td class="empty">Empt.</td>
				<td>第三十回</td><td class="empty">Empt.</td>
				<td>第三十一回</td><td class="collecting">Coll.</td>
				<td>第三十二回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td>第三十三回</td><td class="empty">Empt.</td>
				<td>第三十四回</td><td class="empty">Empt.</td>
				<td><a href="/wiki/game/35.html">第三十五回</a></td><td class="completed">Comp.</td>
				<td>第三十六回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td>第三十七回</td><td class="empty">Empt.</td>
				<td><a href="/wiki/game/38.html">第三十八回</a></td><td class="completed">Comp.</td>
				<td><a href="/wiki/game/39.html">第三十九回</a></td><td class="completed">Comp.</td>
				<td>第四十回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td>第四十一回</td><td class="empty">Empt.</td>
				<td>第四十二回</td><td class="empty">Empt.</td>
				<td><a href="/wiki/game/43.html">第四十三回</a></td><td class="completed">Comp.</td>
				<td>第四十四回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td>第四十五回</td><td class="empty">Empt.</td>
				<td><a href="/wiki/game/46.html">第四十六回</a></td><td class="completed">Comp.</td>
				<td>第四十七回</td><td class="empty">Empt.</td>
				<td>第四十八回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td><a href="/wiki/game/49.html">第四十九回</a></td><td class="completed">Comp.</td>
				<td>第五十回</td><td class="empty">Empt.</td>
				<td>第五十一回</td><td class="empty">Empt.</td>
				<td>第五十二回</td><td class="empty">Empt.</td>
			</tr>
			<tr>
				<td>第五十三回</td><td class="empty">Empt.</td>
				<td>第五十四回</td><td class="empty">Empt.</td>
				<td>第五十五回</td><td class="empty">Empt.</td>
				<td><a href="/wiki/game/56.html">第五十六回</a></td><td class="completed">Comp.</td>
			</tr>
			<tr>
				<td>第五十七回</td><td class="empty">Empt.</td>
				<td>第五十八回</td><td class="empty">Empt.</td>
				<td>第五十九回</td><td class="empty">Empt.</td>
				<td><a href="/wiki/game/60.html">第六十回</a></td><td class="completed">Comp.</td>
			</tr>
		</tbody>
	</table>
</center>

[]()