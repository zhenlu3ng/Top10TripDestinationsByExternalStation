
// Replace content in DOM			
function ReplaceContentInContainer(id,content) {
	var container = document.getElementById(id);
	container.innerHTML = content;
}


//Function return data value
function ReturnData_Val(data,i)
      {
			i=i-1;
			var dataItem = data[i];
			var val = dataItem[1].value;
			return val;
		}





	
	//Global Variables for flow map
    var carPath = 'image://pic/car.png'
	var overlay = new L.echartsLayer3(map, echarts);
	var chartsContainer = overlay.getEchartsContainer();
	var myFlowChart = overlay.initECharts(chartsContainer);
	var series = [];	
	var TAZ_Number = 3001;
	
	
function returnTAZ () {	  	
	TAZ_Number = document.getElementById("mySearch").value;
	Post_Flow_Map(TAZ_Number);
}
		
function Post_Flow_Map(TAZ_Number) {

		// clear old data
		
		myFlowChart = overlay.initECharts(chartsContainer);
		myFlowChart.setOption({},true);
		series = [];
					
		var convertData = function (data) {
			var res = [];
			for (var i = 0; i < data.length; i++) {
				var dataItem = data[i];
				var fromCoord = geoCoordMap[dataItem[0].name];
				var toCoord = geoCoordMap[dataItem[1].name];
				if (fromCoord && toCoord) {
					res.push([{
						coord: fromCoord
					}, {
						coord: toCoord 
					}]);
				}
			}
			return res;
		};

		var color = ['#a6c84c', '#ffa022', '#46bee9'];
	   
	
	   [['TAZ'+TAZ_Number, window['TAZ'+TAZ_Number+'_Data']]].forEach(function (item, i) {
        series.push({
                    name: item[0] + ' Top10',
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: '#fff',
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color:  "Orange",
                            width: 0,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                },
                {
                    name: item[0] + ' Top10',
                    type: 'lines',
                    zlevel: 2,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: carPath,
                        symbolSize: 12
                    },
                    lineStyle: {
                        normal: {
                            color:  "Orange",
                            width: 1,
                            opacity: 0.8,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                },
                {
                    name: item[0] + ' Top10',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 600;
                    },
                    itemStyle: {
                        normal: {
                            //color: color[i]
							color: "Orange"
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
							/*value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]) */
                        };
                    })
                });
    });

		option = {
	//        backgroundColor: '#404a59',
			title: {
				text: '',
				left: 'center',
				textStyle: {
					color: '#fff'
				}
			},
			tooltip: {
			   trigger: 'item'
			},
			legend: {
				orient: 'vertical',
				top: 'bottom',
				left: 'left',
				data: ['TAZ'+TAZ_Number+' Top10'],
				textStyle: {
					color: '#fff'
				},
				selectedMode: 'single'
			},

			geo: {
				map: '',
				label: {
					emphasis: {
						show: false
					}
				},
				roam: true,
				itemStyle: {
					normal: {
						areaColor: '#323c48',
						borderColor: '#404a59'
					},
					emphasis: {
						areaColor: '#2a333d'
					}
				}
			},
			series: series
		};
		
       myFlowChart.setOption(option);
	   
	   // Update content for BarChart
	   // update TAZ number
	   ReplaceContentInContainer("chartsta",TAZ_Number);
	   ReplaceContentInContainer("tablesta",TAZ_Number);
	   
	   // Initialize table value
	   for (i=1; i<= 10; i++) {   
	   
	   ReplaceContentInContainer("top"+i,  0);
	   ReplaceContentInContainer("top"+i+"_title", "");
	   myBarChart.data.datasets[0].data[i-1] =  0;	
	   myBarChart.data.labels[i-1] =  "";	
	   }
	      
	   
	   //update Table Value
	   for (i=1; i<= (window['TAZ'+TAZ_Number+'_Data']).length; i++) {
	   
	   ReplaceContentInContainer("top"+i,  window['TAZ'+TAZ_Number+'_Data'][i-1][1].value);
	   ReplaceContentInContainer("top"+i+"_title",  window['TAZ'+TAZ_Number+'_Data'][i-1][1].name);
	   myBarChart.data.datasets[0].data[i-1] =  window['TAZ'+TAZ_Number+'_Data'][i-1][1].value;	
	   myBarChart.data.labels[i-1] =  window['TAZ'+TAZ_Number+'_Data'][i-1][1].name;	
	   }
	   
	   myBarChart.update();
}


Post_Flow_Map(TAZ_Number);


