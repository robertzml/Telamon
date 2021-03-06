
var dashboard = function() {

	var electricCharge = 0.0, waterCharge = 0.0, gasCharge = 0.0, riceCharge = 0.0;
	var electric = 0.0, water = 0.0, gas = 0.0, rice = 0.0;
	var electricStart = -1, waterStart = -1, gasStart = -1;
	var today, currentBatch = -1;
	var productionCount = 0;
	var todayDate;
	var morningStart, morningEnd, noonStart, noonEnd;
	var lastWeekWaterAmount, lastWeekElectricAmount, lastWeekGasAmount;
	var lastWeekWaterChart, lastWeekElectricChart, lastWeekGasChart;
	var colors = Highcharts.getOptions().colors;

	var loadBatch = function(callback) {
		$.getJSON("/dashboard/getBatch", function(response) {
			currentBatch = response;

			callback();
		});
	}

	var loadParameters = function() {
		$.getJSON("/parameter/getValues", function(response) {
			$.each(response, function(i, item) {
				switch(item.name) {
					case 'electric-charge':
						electricCharge = parseFloat(item.value);
						$('span#electric-charge').text(item.value);
						break;
					case 'water-charge':
						waterCharge = parseFloat(item.value);
						$('span#water-charge').text(item.value);
						break;
					case 'gas-charge':
						gasCharge = parseFloat(item.value);
						$('span#gas-charge').text(item.value);
						break;
					case 'rice-charge':
						riceCharge = parseFloat(item.value);
						$('span#rice-charge').text(item.value);
						break;
					case 'morning-start':
						morningStart = moment(item.value, 'HH:mm:ss');
						break;
					case 'morning-end':
						morningEnd = moment(item.value, 'HH:mm:ss');
						break;
					case 'noon-start':
						noonStart = moment(item.value, 'HH:mm:ss');
						break;
					case 'noon-end':
						noonEnd = moment(item.value, 'HH:mm:ss');
						break;
				}
			});
		});
	}

	var loadPlanningDetails = function() {

		if (currentBatch == 1)
			$('small#production-batch').text('上午');
		else if (currentBatch == 2)
			$('small#production-batch').text('下午');
		else {
			$('small#production-batch').text('未生产');
			$('#planning-details').empty();
			return;
		}


		$('#planning-details').empty();

		$.getJSON("/planning/getCurrentDetails", { date: todayDate, batch: currentBatch } ,function(response) {
			var total = 0;

			for (var i = 0; i < response.length; i = i + 2) {

				var name1 =	$("<td/>").append(response[i].name);
				var quantity1 = $("<td/>").append(response[i].quantity + " 箱");
				total += response[i].quantity;

				var name2, quantity2;
				if (i + 1 < response.length) {
					name2 =	$("<td/>").append(response[i + 1].name);
					quantity2 = $("<td/>").append(response[i + 1].quantity + " 箱");
					total += response[i + 1].quantity;
				} else  {
					name2 =	$("<td/>");
					quantity2 = $("<td/>");
				}

				var row = $("<tr/>").append(name1).append(quantity1).append(name2).append(quantity2);
				$('#planning-details').append(row);
			}

			$('#total-planning').text(total);
		});
	}

	var loadStartEnergy = function(date, batch) {
		if (currentBatch == -1)
			return;

		$.getJSON("/dashboard/getStartEnergy", { date: date, batch: batch, type: 1 }, function(response) {
			var w = parseFloat(response);
			if (waterStart != w)
				waterStart = w;
		});

		$.getJSON("/dashboard/getStartEnergy", { date: date, batch: batch, type: 2 }, function(response) {
			var e = parseFloat(response);
			if (electricStart != e)
				electricStart = e;
		});

		$.getJSON("/dashboard/getStartEnergy", { date: date, batch: batch, type: 3 }, function(response) {
			var g = parseFloat(response);
			if (gasStart != g)
				gasStart = g;
		});
	}

	var getRiceAmount = function(date, batch) {
		$.getJSON("/dashboard/getRiceAmount", { date: date, batch: batch }, function(response) {
			rice = parseFloat(response);
			$('div#today-rice').text(rice);
		});
	}

	var getRiceCount = function(date, batch) {
		$.getJSON("/dashboard/getRiceCount", { date: date, batch: batch }, function(response) {
			productionCount = parseInt(response);
			$('b#current-production').text(productionCount);
		});
	}

	var socketMessge = function(message) {
		$('#socket-message').text(message);
	}

	var errorMessge = function(message) {
		$('#error-message').text(message);
	}

	//calculate the cost by page display value
	var calculateCost = function() {
		//var count = parseInt($('b#current-production').text());
		var price = (water * waterCharge + electric * electricCharge + gas * gasCharge + rice * riceCharge) / productionCount;

		$('b#current-cost').text(price.toFixed(2));
	}

	var handleRealTimeData = function() {
		var socket = io('http://172.18.5.5:4002');

		socket.on('energy', function(data) {
			socketMessge(''); 

			if (waterStart == -1 || electricStart == -1 || gasStart == -1)
				errorMessge('未找到起始读数');
			else {
				errorMessge('');
				water = data.energy.water - waterStart;
				electric = data.energy.electric - electricStart;
				gas = data.energy.gas - gasStart;

				$('div#today-water').text(water.toFixed(2));
				$('div#today-electric').text(electric.toFixed(2));
				$('div#today-gas').text(gas.toFixed(2));
				setChartCurrentEnergy(lastWeekWaterChart, water);
				setChartCurrentEnergy(lastWeekElectricChart, electric);
				setChartCurrentEnergy(lastWeekGasChart, gas);
			}
		});

		socket.on('water', function(data) {
			socketMessge(''); 
			
			if (waterStart == -1)
				errorMessge('未找到水起始读数');
			else {
				errorMessge('');
				water = data.energy.water - waterStart;

				$('div#today-water').text(water.toFixed(2));
				setChartCurrentEnergy(lastWeekWaterChart, water);
			}
		});

		socket.on('electric', function(data) {
			socketMessge(''); 

			if (electricStart == -1)
				errorMessge('未找到电起始读数');
			else {
				errorMessge('');
				electric = data.energy.electric - electricStart;

				$('div#today-electric').text(electric.toFixed(2));
				setChartCurrentEnergy(lastWeekElectricChart, electric);
			}
		});

		socket.on('gas', function(data) {
			socketMessge(''); 

			if (gasStart == -1)
				errorMessge('未找到气起始读数');
			else {
				errorMessge('');
				gas = data.energy.gas - gasStart;

				$('div#today-gas').text(gas.toFixed(2));
				setChartCurrentEnergy(lastWeekGasChart, gas);
			}
		});

		socket.on('rice', function(data) {
			getRiceAmount(todayDate, currentBatch);
		});

		socket.on('production', function(data) {
			//$('b#current-production').text(data.production.count);
			$('b#current-weight').text(data.production.weight);
			getRiceCount(todayDate, currentBatch);
			calculateCost();
		});

		socket.on('reconnect_failed', function() { 
			socketMessge("设备重连失败."); 
		});

		socket.on('connect_error', function() {
			socketMessge('设备连接失败.');
		});

		socket.on('connect_timeout', function() {
			socketMessge('设备连接超时.');
		});
	}

	var setTimer = function() {

		// display time
		setInterval(function(){
			var now = moment();
			$('#current-time').html(now.format('YYYY年MM月DD日 HH:mm:ss'));

			if (now.isAfter(morningStart) && now.isBefore(morningEnd))
				currentBatch = 1;
			else if (now.isAfter(noonStart) && now.isBefore(noonEnd))
				currentBatch = 2;
			else
				currentBatch = -1;

		},1000);

		// load batch, 10 mins
		setInterval(function() {
			loadBatch();
		}, 600000);

		// load planning details, 5 mins
		setInterval(function(){
			loadPlanningDetails();
		}, 30000);

		// load start energy, 10 mins
		setInterval(function() {
			loadStartEnergy(todayDate, currentBatch);
		}, 600000);
	}

	var setChartCurrentEnergy = function(chart, value) {
		chart.series[0].data[0].update(value);		
	}

	var getLastWeekEnergy = function(callback) {
		$.getJSON("/dashboard/lastWeekEnergy", { batch: currentBatch }, function(response) {
			lastWeekWaterAmount = parseFloat(response.waterAmount);
			lastWeekElectricAmount = parseFloat(response.electricAmount);
			lastWeekGasAmount = parseFloat(response.gasAmount);

			callback();
		});
	}

	var initWeekCompare = function(container, title, lastValue, color) {
		var option = {
			chart: {
				type: 'bar',
				renderTo: container
			},
			title: {
				text: title,
                margin: 8,
                style: {
                    'fontSize': '14px'
                }
			},
			xAxis: {
				title: {
                    text: null
                },
				labels: {
					enabled: false
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: null
				}
			},
			plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        color: '#FFFFFF',
                        align: 'right',
						format: '{point.y:.2f}'
                    },
					enableMouseTracking: false,
                    pointWidth: 12
                }
            },
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			series: [{
                name: '本周',
                data: [0],
				color: color
            }, {
                name: '上周',
                data: [lastValue],
				color: colors[8]
			}]
		};

		var chart = new Highcharts.Chart(option);
		return chart
	}

	var loadWeekCompare = function() {
		getLastWeekEnergy(function() {
			lastWeekWaterChart = initWeekCompare('compare-water', '用水', lastWeekWaterAmount, colors[0]);
			lastWeekElectricChart = initWeekCompare('compare-electric', '用电', lastWeekElectricAmount, colors[2]);
			lastWeekGasChart = initWeekCompare('compare-gas', '用气', lastWeekGasAmount, colors[4]);
		});
	}

	var loadWeekEnergy = function() {
		$.getJSON("/dashboard/weekEnergyUse", function(response) {
			initWeekEnergyChart(response);
		});
	}

	var initWeekEnergyChart = function(data) {
		var option = {
			chart: {
				type: 'column',
				renderTo: 'history-energy'
			},
			title: {
				text: null
			},				
			xAxis: {
				categories: [],				
				type: 'datetime',
				//tickInterval: 24 * 3600 * 1000,
				labels: {
					formatter:function(){
						return Highcharts.dateFormat('%d', this.value);
					}
				}
			},
			yAxis: {
				min: 0,
				max: 300,
				title: {
					text: null
				}
			},
			plotOptions: {
				column: {
					pointPadding: 0.3,
					borderWidth: 0,
					groupPadding: 0.1,
					dataLabels: {
						enabled: true
					},
					enableMouseTracking: false
				}
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			series: [{
				name: '水',
				data: [],
				color: '#27a9e3'

			}, {
				name: '电',
				data: [],
				color: '#28b779'

			}, {
				name: '气',
				data: [],
				color: '#852b99'
			}]
		};
		
		$.each(data, function(i, item) {
			var s = moment(item.productionDate);
			var d = Date.UTC(s.year(), s.month(), s.date());
				
			option.xAxis.categories.push(d);
			option.series[0].data.push(item.waterAmount);
			option.series[1].data.push(item.electricAmount);
			option.series[2].data.push(item.gasAmount);
		});
		var chart2 = new Highcharts.Chart(option);
	}
	
	var loadHistoryCost = function() {
		$.getJSON("/dashboard/lastCost", function(response) {

			var option = {
				chart: {
					renderTo: 'history_cost'
				},
				title: {
					text: null
				},				
				xAxis: {
					type: 'datetime',
					tickInterval: 24 * 3600 * 1000,
					labels: {
						formatter:function(){
							return Highcharts.dateFormat('%d', this.value);
						}
					}
				},
				yAxis: [{
					title: {
						text: '成本(元/箱)'
					},
					min: 0
				}, {
					title: {
						text: '出饭量(箱)'
					},
					opposite: true,
					max: 800
				}],
				credits: {
					enabled: false
				},
				legend: {
					layout: 'vertical',
					align: 'left',
					verticalAlign: 'top',
					x: 50,
					y: 10,
					floating: true,
					borderWidth: 1
				},
				plotOptions: {
					line: {
						dataLabels: {
							enabled: true,
							color: 'red'
						},
						enableMouseTracking: false
					},
					column: {
						dataLabels: {
							enabled: true
						},
						pointWidth: 10,
						enableMouseTracking: false
					}
				},
				series: [{
					name: '成本',
					type: 'line',
					yAxis: 0,
					data: []
				}, {
					name: '出饭量',
					type: 'column',
					yAxis: 1,
					data: []
				}]
			};

			$.each(response, function(i, item) {
				var s = moment(item.productionDate);
				var d = Date.UTC(s.year(), s.month(), s.date());

				option.series[0].data.push([d, item.averageCost]);
				option.series[1].data.push([d, item.totalCount]);
			});
			
			var chart1 = new Highcharts.Chart(option);
		});
	}
		
	return {
		init: function() {

			today = moment();
			todayDate = today.format('YYYY-MM-DD');

			loadBatch(function() {
				loadPlanningDetails();
				loadStartEnergy(todayDate, currentBatch);
				loadWeekCompare();
			});

			loadParameters();

			setTimer();
		},
		
		initRealTime: function() {
			handleRealTimeData();
		},

		initChart: function() {
			loadHistoryCost();
			//loadWeekCompare();
			loadWeekEnergy();
		}
	}
	
}();