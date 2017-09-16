moment.locale('zh-cn');
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

option = {
    title: {
        text: 'Travel Time'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ["A->2", "A->3", "B->1", "B->3", "C->1", "C->3", "T1_Entry", "T1_Exit", "T2_Entry", "T3_Entry", "T3_Exit"]
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
    series: [
        {
            name: 'A->2',
            type: 'line',
            sampling: 'average',
            connectNulls: true
        },
        {
            name: 'A->3',
            type: 'line',
            sampling: 'average',
            connectNulls: true
        },
        {
            name: 'B->1',
            type: 'line',
            sampling: 'average',
            connectNulls: true
        },
        {
            name: 'B->3',
            type: 'line',
            sampling: 'average',
            connectNulls: true
        },
        {
            name: 'C->1',
            type: 'line',
            sampling: 'average',
            connectNulls: true
        },
        {
            name: 'C->3',
            type: 'line',
            sampling: 'average',
            connectNulls: true
        },
        {
            name: 'T1_Entry',
            type: 'bar',
            stack: "T1"
        },
        {
            name: 'T1_Exit',
            type: 'bar',
            stack: "T1"
        },
        {
            name: 'T2_Entry',
            type: 'bar'
        },
        {
            name: 'T3_Entry',
            type: 'bar',
            stack: "T3"
        },
        {
            name: 'T3_Exit',
            type: 'bar',
            stack: "T3"
        }
    ]
};


function process_json_data(json_data) {
    var x = [];
    var y = {};
    var json_data_pairs = _.pairs(json_data);
    var length = json_data_pairs.length;
    for (var i = 0; i < length; i++) {
        var time = json_data_pairs[i][0];
        var value = json_data_pairs[i][1];
        var d_str = moment(parseFloat(time)).subtract(8, 'hours').format('YYYY-MM-DD HH:mm');
        x.push(d_str);
        _.each(value, function (v, key) {
            if (y[key]) {
                if (key[0] !== 'T' && v === 0.0) {
                    y[key].push(NaN);
                } else {
                    y[key].push(v.toFixed(0));
                }
            }
            else {
                y[key] = [];
            }
        });
    }
    return [x, y];
}


var xy = process_json_data(my_json_data);
var x = xy[0];
var y = xy[1];
option.xAxis[0].data = x;

option.series[0].data = y["A->2"];
option.series[1].data = y["A->3"];
option.series[2].data = y["B->1"];
option.series[3].data = y["B->3"];
option.series[4].data = y["C->1"];
option.series[5].data = y["C->3"];
option.series[6].data = y["T1D0"];
option.series[7].data = y["T1D1"];
option.series[8].data = y["T2D0"];
option.series[9].data = y["T3D0"];
option.series[10].data = y["T3D1"];

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

