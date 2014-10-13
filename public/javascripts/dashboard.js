
var dashboard = function() {

	var electricCharge = 0.0, waterCharge = 0.0, gasCharge = 0.0, riceCharge = 0.0;
	var electric = 0.0, water = 0.0, gas = 0.0, rice = 0.0;
	var electricStart = -1, waterStart = -1, gasStart = -1;
	var today, batch = -1;
	var todayDate;
	var morningStart, morningEnd, noonStart, noonEnd;


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

		if (batch == 1)
			$('small#production-batch').text('上午');
		else if (batch == 2)
			$('small#production-batch').text('下午');
		else
			$('small#production-batch').text('未生产');

		$.getJSON("/planning/getCurrentDetails", { date: todayDate, batch: batch } ,function(response) {
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

			/*$.getJSON("/dashboard/energy", function(response) {
				$.each(response.data, function(i, item) {
					var start = item.readData;
					switch(item.type) {
						case 1:
							$('div#today-water').text(data.energy.water - start);
							break;
						case 2:
							$('div#today-electric').text(data.energy.electric - start);
							break;
						case 3:
							$('div#today-gas').text(data.energy.gas - start);
							break;
						case 4:
							$('div#today-rice').text(data.energy.rice - start);
							break;
					}
				});
				
			});*/
		});

		socket.on('rice', function(data) {
			getRiceAmount(todayDate, batch);
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
				batch = 1;
			else if (now.isAfter(noonStart) && now.isBefore(noonEnd))
				batch = 2;
			else
				batch = -1;

			$('#debug-message').text(batch);
		},1000);

	}

	var handleWeekCompare = function(container, title) {
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
                        enabled: true
                    }
                },
				enableMouseTracking: false
            },
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			series: [{
                name: '上周',
                data: [107]
			}, {
                name: '本周',
                data: [133]
            }]
		};
		
		var chart = new Highcharts.Chart(option);
	}
	
	var loadDashboardWeekCompare = function() {
		handleWeekCompare('week-water', '用水');
		handleWeekCompare('week-electric', '用电');
		handleWeekCompare('week-gas', '用气');
	}
	
	var initColumn = function() {
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
				column: {
					pointPadding: 0.3,
					borderWidth: 0,
					dataLabels: {
						enabled: true
					}
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
				data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6],
				color: '#27a9e3'

			}, {
				name: '电',
				data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0],
				color: '#28b779'

			}, {
				name: '气',
				data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0],
				color: '#852b99'
			}]
		};
		
		var chart2 = new Highcharts.Chart(option);
	}
	
	var loadDashboardHistoryCost = function() {
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
					y: 20,
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

				option.series[0].data.push([d, item.avgCost]);
				option.series[1].data.push([d, item.sumCount]);
			});
			
			var chart1 = new Highcharts.Chart(option);
		});
	}
		
	return {
		init: function(b) {
			batch = b;
			today = moment();
			todayDate = today.format('YYYY-MM-DD');
			
			loadParameters();
            loadPlanningDetails();
			displayTime();
			
			loadStartEnergy(todayDate, batch);
			//getProduction('2014-10-09', 1);
			//getRiceAmount('2014-10-09', 1);
		},
		
		initRealTime: function() {
			handleRealTimeData();
		},
		
		initChart: function() {
			initColumn();
			loadDashboardWeekCompare();
			loadDashboardHistoryCost();
		}
	}
	
}();