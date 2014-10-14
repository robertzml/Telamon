
var dashboard = function() {

	var electricCharge = 0.0, waterCharge = 0.0, gasCharge = 0.0, riceCharge = 0.0;
	var electric = 0.0, water = 0.0, gas = 0.0, rice = 0.0;
	var electricStart = -1, waterStart = -1, gasStart = -1;
	var today, currentBatch = -1;
	var todayDate;
	var morningStart, morningEnd, noonStart, noonEnd;
	var lastWeekWaterAmount, lastWeekElectricAmount, lastWeekGasAmount;
	var lastWeekWaterChart, lastWeekElectricChart, lastWeekGasChart;
	var colors = Highcharts.getOptions().colors;

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
		else
			$('small#production-batch').text('未生产');

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
		$.getJSON("/dashboard/getStartEnergy", { date: date, batch: batch, type: 1 }, function(response) {
			waterStart = parseFloat(response);
		});

		$.getJSON("/dashboard/getStartEnergy", { date: date, batch: batch, type: 2 }, function(response) {
			electricStart = parseFloat(response);
		});

		$.getJSON("/dashboard/getStartEnergy", { date: date, batch: batch, type: 3 }, function(response) {
			gasStart = parseFloat(response);
		});
	}

	var getProduction = function(date, batch) {
		$.getJSON("/dashboard/getProduction", { date: date, batch: batch }, function(response) {
			//console.log(response);
		});
	}

	var getRiceAmount = function(date, batch) {
		$.getJSON("/dashboard/getRiceAmount", { date: date, batch: batch }, function(response) {
			rice = parseFloat(response);
			$('div#today-rice').text(rice);
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
		var count = parseInt($('b#current-production').text());
		var price = (water * waterCharge + electric * electricCharge + gas * gasCharge + rice * riceCharge) / count;

		$('b#current-cost').text(price.toFixed(2));
	}

	var handleRealTimeData = function() {
		var socket = io('http://localhost:4002');

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
			$('b#current-production').text(data.production.count);
			$('b#current-weight').text(data.production.weight);
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

	var displayTime = function($dom) {

		setInterval(function(){
			var now = moment();
			$('#current-time').html(now.format('YYYY年MM月DD日 HH:mm:ss'));

			if (now.isAfter(morningStart) && now.isBefore(morningEnd))
				currentBatch = 1;
			else if (now.isAfter(noonStart) && now.isBefore(noonEnd))
				currentBatch = 2;
			else
				currentBatch = -1;

			$('#debug-message').text(currentBatch);
		},1000);

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
				text: title
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
						format: '{point.y:.2f}'
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
                name: '本周',
                data: [0],
				color: color
            }, {
                name: '上周',
                data: [lastValue],
				color: colors[1]
			}]
		};

		var chart = new Highcharts.Chart(option);
		return chart
	}

	var loadWeekCompare = function() {
		getLastWeekEnergy(function() {
			lastWeekWaterChart = initWeekCompare('week-water', '用水', lastWeekWaterAmount, colors[0]);
			lastWeekElectricChart = initWeekCompare('week-electric', '用电', lastWeekElectricAmount, colors[2]);
			lastWeekGasChart = initWeekCompare('week-gas', '用气', lastWeekGasAmount, colors[4]);
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
				title: {
					text: null
				}
			},
			plotOptions: {
				column: {
					pointPadding: 0.3,
					borderWidth: 0,
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
					renderTo: 'history_cost',
					type: 'line'
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
					}
				}, {
					title: {
						text: '出饭量(箱)'
					},
					opposite: true
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
							enabled: true
						},
						enableMouseTracking: false
					}
				},
				series: [{
					name: '成本',
					yAxis: 0,
					data: []
				}, {
					name: '出饭量',
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
		init: function(b) {
			currentBatch = b;
			today = moment();
			todayDate = today.format('YYYY-MM-DD');
			
			loadParameters();
            loadPlanningDetails();
			displayTime();
			
			loadStartEnergy(todayDate, currentBatch);
			//getProduction('2014-10-09', 1);
			//getRiceAmount('2014-10-09', 1);
		},
		
		initRealTime: function() {
			handleRealTimeData();
		},

		initChart: function() {
			loadHistoryCost();
			loadWeekCompare();
			loadWeekEnergy();
		}
	}
	
}();