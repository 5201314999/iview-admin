<template>
    <div class="fl-container">
        <Card>
            <Row slot="title">
                <icon type="wand" class="mr5"></icon>效果
            </Row>
            <div class="fl-detail">
                <Row>
                    <Col span="12">
                        <div class="fl-item clearfix">
                            <div class="fl-item-label">组件ID：</div>
                            <div class="fl-item-content">123456</div>
                        </div>
                        <div class="fl-item clearfix">
                            <div class="fl-item-label">组件名称：</div>
                            <div class="fl-item-content">影视</div>
                        </div>
                    </Col>
                    <Col span="12">
                        <div class="fl-item clearfix">
                            <div class="fl-item-label">推荐位尺寸：</div>
                            <div class="fl-item-content">1920 * 1080</div>
                        </div>
                        <div class="fl-item clearfix">
                            <div class="fl-item-label">推荐位数量：</div>
                            <div class="fl-item-content">1</div>
                        </div>
                    </Col>
                    <Col span="24">
                        <div class="fl-item clearfix">
                            <div class="fl-item-label">长文内容显示：</div>
                            <div class="fl-item-content">早安，给我一分钟，讲个故事1981年，高桥阳一画出了《足球小将》还在基层工作的川渊三郎说：“当时的日本还属于棒球，我带着足球去棒球场，跟孩子们普及足球的妙处...”1988年，川渊三郎成为日本足球联赛总务主士开始推动日本足球朝着职业化方向发展1993年，J联赛开幕式身为日本足协主席的川渊三郎，宣布日本足球的职业化开始了1993年10月28日，日本2-2伊拉克，史称“多哈悲剧”日本在第89分钟被扳平，错失冲进1994年世界杯正赛的机会东京电视台以48.1%的收视率，创造了历史新高1997年11月16日，日本3-2伊朗冈野雅行在加时赛金球制胜，日本队首次冲进世界杯决赛圈2002年日本与韩国共同承办世界杯在特鲁西埃的带领下，首次小组出线，打进16强2005年日本足协颁布“2005宣言”终极目标是2050年，目标是世界杯夺冠，以及拥有1000万以上足球人口2010年南非世界杯，日本队打进16强岡田武史挂帅，首次海外突破小组赛2018年7月2日 日本2-3比利时两球领先，被比利时逆转日本队历史上第三次进入世界杯16强，第三次止步世界杯16强一场刺激的比赛背后只需要37年而已</div>
                        </div>
                    </Col>
                    <Col span="24">
                        <div class="fl-item fl-item-image clearfix">
                            <div class="fl-item-label">图片预览：</div>
                            <div class="fl-item-content">
                                <icon type="images"></icon>
                            </div>
                        </div>
                    </Col>
                    <Col span="12">
                        <div class="fl-item fl-item-btn clearfix">
                            <div class="fl-item-label">&nbsp;</div>
                            <div class="fl-item-content">
                                <Button type="primary" size="large">确定</Button>
                                <Button size="large" type="ghost">返回</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>
        <Card class="mt20">
            <Row slot="title">
                <icon type="code" class="mr5"></icon>代码
            </Row>
            <pre v-highlight><code>{{ html }}</code></pre>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'DetailComponent',
        data() {
            return {
                html: '<div class="fl-container">\n' +
                '    <div class="fl-content">\n' +
                '        <div class="fl-detail">\n' +
                '            <Row>\n' +
                '                <Col span="12">\n' +
                '                    <div class="fl-item clearfix">\n' +
                '                        <div class="fl-item-label">组件ID：</div>\n' +
                '                        <div class="fl-item-content">123456</div>\n' +
                '                    </div>\n' +
                '                    <div class="fl-item clearfix">\n' +
                '                        <div class="fl-item-label">组件名称：</div>\n' +
                '                        <div class="fl-item-content">影视</div>\n' +
                '                    </div>\n' +
                '                </Col>\n' +
                '                <Col span="12">\n' +
                '                    <div class="fl-item clearfix">\n' +
                '                        <div class="fl-item-label">推荐位尺寸：</div>\n' +
                '                        <div class="fl-item-content">1920 * 1080</div>\n' +
                '                    </div>\n' +
                '                    <div class="fl-item clearfix">\n' +
                '                        <div class="fl-item-label">推荐位数量：</div>\n' +
                '                        <div class="fl-item-content">1</div>\n' +
                '                    </div>\n' +
                '                </Col>\n' +
                '                <Col span="24">\n' +
                '                    <div class="fl-item clearfix">\n' +
                '                        <div class="fl-item-label">长文内容显示：</div>\n' +
                '                        <div class="fl-item-content">早安，给我一分钟，讲个故事\n' +
                '1981年，高桥阳一画出了《足球小将》还在基层工作的川渊三郎说：“当时的日本还属于棒球，我带着足\n球去棒球场，跟孩子们普及足球的妙处...”1988年，川渊三郎成为日本足球联赛总务主士开始推动日\n本足球朝着职业化方向发展1993年，J联赛开幕式身为日本足协主席的川渊三郎，宣布日本足球的职业\n化开始了1993年10月28日，日本2-2伊拉克，史称“多哈悲剧”日本在第89分钟被扳平，错失冲进\n1994年世界杯正赛的机会东京电视台以48.1%的收视率，创造了历史新高1997年11月16日，日本3-2伊\n朗冈野雅行在加时赛金球制胜，日本队首次冲进世界杯决赛圈2002年日本与韩国共同承办世界杯\n在特鲁西埃的带领下，首次小组出线，打进16强2005年日本足协颁布“2005宣言”终极目标是2050年\n，目标是世界杯夺冠，以及拥有1000万以上足球人口2010年南非世界杯，日本队打进16强岡田武史挂\n帅，首次海外突破小组赛2018年7月2日 日本2-3比利时两球领先，被比利时逆转日本队历史上第三次\n进入世界杯16强，第三次止步世界杯16强一场刺激的比赛背后只需要37年而已\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                </Col>\n' +
                '                <Col span="24">\n' +
                '                    <div class="fl-item fl-item-image clearfix">\n' +
                '                        <div class="fl-item-label">图片预览：</div>\n' +
                '                        <div class="fl-item-content">\n' +
                '                            <icon type="images"></icon>\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                </Col>\n' +
                '                <Col span="12">\n' +
                '                    <div class="fl-item fl-item-btn clearfix">\n' +
                '                        <div class="fl-item-label">&nbsp;</div>\n' +
                '                        <div class="fl-item-content">\n' +
                '                            <Button size="large" type="ghost">返回</Button>\n' +
                '                            <Button type="primary" size="large">确定</Button>\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                </Col>\n' +
                '            </Row>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '</div>'
            }
        }
    }
</script>