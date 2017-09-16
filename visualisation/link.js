moment.locale('zh-cn');
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

option = {
    title: {
        text: 'Link Speed'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: []
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {}
        }
    },
    grid: {
        left: '3%',
        right: '3%',
        bottom: '8%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false
    }],
    yAxis: [{
        type: 'value'
    }],
    dataZoom: [{
        type: 'inside',
        start: 70,
        end: 72
    }, {
        start: 70,
        end: 72
    }],
    series: []
};


function process_json_data(json_data) {
    var legends = _.keys(json_data);
    var x = _.keys(json_data[legends[0]]);
    x = _.map(x, function (time) {
        return moment(parseFloat(time)).subtract(8, 'hours').format('YYYY-MM-DD HH:mm');
    });
    var y = {};
    _.each(legends, function (legend) {
        var json_data_pairs = _.toPairs(json_data[legend]);
        var length = json_data_pairs.length;
        for (var i = 0; i < length; i++) {
            var speed = json_data_pairs[i][1];
            if (y[legend]) {
                y[legend].push(speed);
            }
            else {
                y[legend] = [speed];
            }
        }
    });

    return [x, y, legends];
}


var xy = process_json_data(speed);
var x = xy[0];
var y = xy[1];
var legends = xy[2];

option.xAxis[0].data = x;
option.legend.data = legends;

_.each(legends, function (legend) {
    option.series.push(
        {
            name: legend,
            type: 'line',
            sampling: 'average',
            connectNulls: true,
            data: y[legend]
        }
    );
});


// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

