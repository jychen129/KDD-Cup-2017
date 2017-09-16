/**
 * Created by JunyuChen on 2017/3/22.
 */
Highcharts.setOptions({
    lang: {
        contextButtonTitle: "图表导出菜单",
        decimalPoint: ".",
        downloadJPEG: "下载JPEG图片",
        downloadPDF: "下载PDF文件",
        downloadPNG: "下载PNG文件",
        downloadSVG: "下载SVG文件",
        drillUpText: "返回 {series.name}",
        loading: "加载中",
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        noData: "没有数据",
        numericSymbols: ["千", "兆", "G", "T", "P", "E"],
        printChart: "打印图表",
        resetZoom: "恢复缩放",
        resetZoomTitle: "恢复图表",
        shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        thousandsSep: ",",
        weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    }
});
$(function () {
    var getSeriesOption = function (route) {
        var data = _.filter(routeData, {route: route});
        data = _.map(data, function (element) {
            var time_window = parseFloat(moment(element.time_window).add(8, 'hours').format('x'));
            return [time_window, element.avg_travel_flow];
        });
        return ({
            name: route,
            tooltip: {
                valueDecimals: 3
            },
            type: 'area',
            threshold: null,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            data: data
        });
    };
    // var routes = ['B->3', 'B->1', 'A->3', 'A->2', 'C->3', 'C->1'];
    var route = 'B->3';

    var setHighcharts = function (route) {
        Highcharts.stockChart('container', {
            rangeSelector: {
                buttons: [{
                    type: 'hour',
                    count: 12,
                    text: '12h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'day',
                    count: 2,
                    text: '2d'
                },
                    {
                        type: 'day',
                        count: 3,
                        text: '3d'
                    },
                    {
                        type: 'day',
                        count: 4,
                        text: '4d'
                    },
                    {
                        type: 'day',
                        count: 5,
                        text: '5d'
                    },
                    {
                        type: 'week',
                        count: 1,
                        text: '1w'
                    }, {
                        type: 'all',
                        text: 'All'
                    }],
                inputEnabled: true, // it supports only days
                selected: 7 // all
            },
            xAxis: {
                minRange: 3600 * 1000  // one hour
            },
            title: {
                text: 'Route Traffic Flow'
            },
            yAxis: {
                title: {
                    text: 'Traffic Flow'
                }
            },
            series: [getSeriesOption(route)]
        });
    };

    setHighcharts(route);

    $("#route_select").change(function (e) {
        setHighcharts($(this).val());
    });
});