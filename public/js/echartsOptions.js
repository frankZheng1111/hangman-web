var statePie = echarts.init($('#hangmen-state-statistic')[0])
statePie.setOption({
    backgroundColor: 'cornsilk',

    title: {
      text: 'hangman记录状态比例',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#999'
      }
    },

    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series : [
    {
      name:'状态',
      type:'pie',
      radius : '55%',
      center: ['50%', '50%'],
      data: [],
      roseType: 'angle',
      label: {
        normal: {
          textStyle: {
            color: '#999'
          }
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: '#999'
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        }
      },
      itemStyle: {
        normal: {
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        }
      },

      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200;
      }
    }
    ]
});
$.get('/api/hangmen/state-data', function(data) {
  var stateToMsg = { init: '尚未开始', 'win': '通关', lose: '失败', giveup: '弃权', guessing: '暂停中' }
  var pieData = [];
  for(var state in data) {
    pieData.push({ value: data[state], name: stateToMsg[state] });
  }
  statePie.setOption({
    series: [{
      name: '状态',
      data: pieData
    }]
  });
});
