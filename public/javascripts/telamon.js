
var telamon = function () { 
	
	var handleDiningValidate = function() {
		var form1 = $('#form_dining');
		var error1 = $('.alert-danger', form1);
		var success1 = $('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input			
			rules: {
				name: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit              
				success1.hide();
				error1.show();
				Metronic.scrollTo(error1, -200);
			},

			highlight: function (element) { // hightlight error inputs
				$(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				$(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
				form.submit();
			}
		});
	};
	
	
	var handlePlanningValidate = function() {
		var form1 = $('#form_planning');
		var error1 = $('.alert-danger', form1);
		var success1 = $('.alert-success', form1);

		form1.validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block help-block-error', // default input error message class
			focusInvalid: false, // do not focus the last invalid input			
			rules: {
				planningDate: {
					required: true
				}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit              
				success1.hide();
				error1.show();
				Metronic.scrollTo(error1, -200);
			},

			highlight: function (element) { // hightlight error inputs
				$(element)
					.closest('.form-group').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				$(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {
				label
					.closest('.form-group').removeClass('has-error'); // set success class to the control group
			},

			submitHandler: function (form) {
				success1.show();
				error1.hide();
				form.submit();
			}
		});
	}
	
	var handleInitDatatable = function($dom) {

		var oTable = $dom.dataTable({
			"order": [
				[0, 'asc']
			],

			"lengthMenu": [
				[5, 10, 20, -1],
				[5, 10, 20, "All"] // change per page values here
			],
			// set the initial value
			"pageLength": 10,

			"pagingType": "bootstrap_full_number",

			"language": {
					"lengthMenu": "  _MENU_ 记录",
					"sLengthMenu": "每页 _MENU_ 条记录",
					"sInfo": "显示 _START_ 至 _END_ 共有 _TOTAL_ 条记录",
					"sInfoEmpty": "记录为空",
					"sInfoFiltered": " - 从 _MAX_ 条记录中",
					"sZeroRecords": "结果为空",
					"sSearch": "搜索:",
					"paginate": {
						"previous":"Prev",
						"next": "Next",
						"last": "Last",
						"first": "First"
					}
				},

			"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12' p>>", // horizobtal scrollable datatable
		});	
		return oTable;
	}
	
	var handleDatePickers = function ($dom) {

        if (jQuery().datepicker) {
            $dom.datepicker({
				format: "yyyy-mm-dd",
				language: "zh-CN",
                weekStart: 7,
                autoclose: true
            });
        }
    }
	
	
    var handleDateRangePickers = function ($dom, callback) {
        if (!jQuery().daterangepicker) {
            return;
        }

        $dom.daterangepicker({
                opens: 'left',
                startDate: moment().subtract('days', 29),
                endDate: moment(),
                minDate: '2014-01-01',
                maxDate: '2020-12-31',
                dateLimit: {
                    days: 90
                },
                showDropdowns: true,
                showWeekNumbers: true,
                timePicker: false,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                ranges: {
                    '今天': [moment(), moment()],
                    '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    '最近7天': [moment().subtract('days', 6), moment()],
                    '最近30天': [moment().subtract('days', 29), moment()],
					'上周': [moment().day(-6), moment().day(0)],
					'本周': [moment().day(1), moment().day(7)],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                    '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                buttonClasses: ['btn'],
                applyClass: 'green',
                cancelClass: 'default',
                format: 'YYYY-MM-DD',
                separator: ' 至 ',
                locale: {
                    applyLabel: '查询',
					cancelLabel: '取消',
                    fromLabel: '开始',
                    toLabel: '结束',
                    customRangeLabel: '自定义',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    firstDay: 1
                }
            },
            function (start, end) {
                $dom.find('span').html(start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));
            }
        ).on('apply.daterangepicker', function(ev, picker) {
			console.log(picker.startDate.format('YYYY-MM-DD'));
			console.log(picker.endDate.format('YYYY-MM-DD'));
			callback(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
		});
		
        //Set the initial state of the picker label
		$dom.find('span').html(moment().subtract('days', 29).format('YYYY-MM-DD') + ' 至 ' + moment().format('YYYY-MM-DD'));
		callback(moment().subtract('days', 29).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    }


	var socketMessge = function(message) {
		$('#socket-message').text(message);
	}
	
	//calculate the cost by page display value
	var calculateCost = function() {
		var count = parseInt($('b#current-production').text());
		
		var water = parseFloat($('div#today-water').text());
		var electric = parseFloat($('div#today-electric').text());
		var gas = parseFloat($('div#today-gas').text());
		var rice = parseFloat($('div#today-rice').text());
		
		var water_charge = parseFloat($('span#water-charge').text());
		var electric_charge = parseFloat($('span#electric-charge').text());
		var gas_charge = parseFloat($('span#gas-charge').text());
		var rice_charge = parseFloat($('span#rice-charge').text());
		
		var price = (water * water_charge + electric * electric_charge + gas * gas_charge + rice * rice_charge) / count;
		
		$('b#current-cost').text(price.toFixed(2));
	}
	
	var handleRealTimeData = function() {
		var socket = io('http://localhost:4002');

		socket.on('energy', function(data) {
			socketMessge(''); 

			$.getJSON("/dashboard/energy", function(response) {
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
				
			});
		});
		
		socket.on('production', function(data) {
			$('b#current-production').text(data.production.count);
			$('b#current-weight').text(data.production.count);
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
	
	var handleBaseCharge = function() {
		$.getJSON("/parameter/getValues", function(response) {
			$.each(response, function(i, item) {
				switch(item.name) {
					case 'electric-charge':
						$('span#electric-charge').text(item.value);
						break;
					case 'water-charge':
						$('span#water-charge').text(item.value);
						break;
					case 'gas-charge':
						$('span#gas-charge').text(item.value);
						break;
					case 'rice-charge':
						$('span#rice-charge').text(item.value);
						break;
				}
			});
			
		});
	}
	
	
	return {
		leftNavActive: function($dom) {
					
			var parent = $dom.parent();
			parent.addClass('active');
			
			var li = $dom.closest('li.left-nav-first');
			li.addClass('active open');
			li.find('a').append('<span class="selected"></span>');
			li.find('.arrow').addClass('open');
		},
		
		planningValidate: function() {
			handlePlanningValidate();
		},
		
		diningValidate: function() {
			handleDiningValidate();
		},
		
		initDatatable: function($dom) {
			return handleInitDatatable($dom);
		},
		
		initHighchart: function() {
			function randValue() {
                return (Math.floor(Math.random() * (1 + 50 - 20))) + 10;
            }
			
			var products = [
                [1, randValue()],
                [2, randValue()],
                [3, 2 + randValue()],
                [4, 3 + randValue()],
                [5, 5 + randValue()],
                [6, 10 + randValue()],
                [7, 15 + randValue()],
                [8, 20 + randValue()],
                [9, 25 + randValue()],
                [10, 30 + randValue()],
                [11, 35 + randValue()],
                [12, 25 + randValue()],
                [13, 15 + randValue()],
                [14, 20 + randValue()],
                [15, 45 + randValue()],
                [16, 50 + randValue()],
                [17, 65 + randValue()],
                [18, 70 + randValue()],
                [19, 85 + randValue()],
                [20, 80 + randValue()],
                [21, 75 + randValue()],
                [22, 80 + randValue()],
                [23, 75 + randValue()],
                [24, 70 + randValue()],
                [25, 65 + randValue()],
                [26, 75 + randValue()],
                [27, 80 + randValue()],
                [28, 85 + randValue()],
                [29, 90 + randValue()],
                [30, 95 + randValue()]
            ];

            var costs = [
                [1, randValue() - 5],
                [2, randValue() - 5],
                [3, randValue() - 5],
                [4, 6 + randValue()],
                [5, 5 + randValue()],
                [6, 20 + randValue()],
                [7, 25 + randValue()],
                [8, 36 + randValue()],
                [9, 26 + randValue()],
                [10, 38 + randValue()],
                [11, 39 + randValue()],
                [12, 50 + randValue()],
                [13, 51 + randValue()],
                [14, 12 + randValue()],
                [15, 13 + randValue()],
                [16, 14 + randValue()],
                [17, 15 + randValue()],
                [18, 15 + randValue()],
                [19, 16 + randValue()],
                [20, 17 + randValue()],
                [21, 18 + randValue()],
                [22, 19 + randValue()],
                [23, 20 + randValue()],
                [24, 21 + randValue()],
                [25, 14 + randValue()],
                [26, 24 + randValue()],
                [27, 25 + randValue()],
                [28, 26 + randValue()],
                [29, 27 + randValue()],
                [30, 31 + randValue()]
            ];
			
			var option = {
				chart: {
					renderTo: 'rice_statistics',
					type: 'line'					
				},
				title: {
					text: null
				},				
				xAxis: {
					categories: []
				},
				yAxis: {
					title: {
						text: null
					}
				},
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
					name: '出饭量',
					data: products
				}, {
					name: '成本',
					data: costs
				}]
			};
			
			var chart1 = new Highcharts.Chart(option);
		},
		
		
		initMiniCharts: function () {

            // IE8 Fix: function.bind polyfill
            if (Metronic.isIE8() && !Function.prototype.bind) {
                Function.prototype.bind = function (oThis) {
                    if (typeof this !== "function") {
                        // closest thing possible to the ECMAScript 5 internal IsCallable function
                        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                    }

                    var aArgs = Array.prototype.slice.call(arguments, 1),
                        fToBind = this,
                        fNOP = function () {},
                        fBound = function () {
                            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                    };

                    fNOP.prototype = this.prototype;
                    fBound.prototype = new fNOP();

                    return fBound;
                };
            }

            $('.easy-pie-chart .number.transactions').easyPieChart({
                animate: 1000,
                size: 75,
                lineWidth: 3,
                barColor: Metronic.getBrandColor('yellow')
            });

            $('.easy-pie-chart .number.visits').easyPieChart({
                animate: 1000,
                size: 75,
                lineWidth: 3,
                barColor: Metronic.getBrandColor('green')
            });

            $('.easy-pie-chart .number.bounce').easyPieChart({
                animate: 1000,
                size: 75,
                lineWidth: 3,
                barColor: Metronic.getBrandColor('red')
            });

            $('.easy-pie-chart-reload').click(function () {
                $('.easy-pie-chart .number').each(function () {
                    var newValue = Math.floor(100 * Math.random());
                    $(this).data('easyPieChart').update(newValue);
                    $('span', this).text(newValue);
                });
            });

            $("#sparkline_bar").sparkline([8, 9, 10, 11, 10, 10, 12, 10, 10, 11, 9, 12, 11, 10, 9, 11, 13, 13, 12], {
                type: 'bar',
                width: '100',
                barWidth: 5,
                height: '55',
                barColor: '#35aa47',
                negBarColor: '#e02222'
            });

            $("#sparkline_bar2").sparkline([9, 11, 12, 13, 12, 13, 10, 14, 13, 11, 11, 12, 11, 11, 10, 12, 11, 10], {
                type: 'bar',
                width: '100',
                barWidth: 5,
                height: '55',
                barColor: '#ffb848',
                negBarColor: '#e02222'
            });

            $("#sparkline_line").sparkline([9, 10, 9, 10, 10, 11, 12, 10, 10, 11, 11, 12, 11, 10, 12, 11, 10, 12], {
                type: 'line',
                width: '100',
                height: '55',
                lineColor: '#ffb848'
            });

        },
		
		initColumn: function() {
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
		},
		

		initDatePicker: function($dom) {
			handleDatePickers($dom);
		},
		
		initDateRangePicker: function($dom, callback) {
			handleDateRangePickers($dom, callback);
		}, 
		
		// init planning statistic chart 
		loadPlanningStatistic: function(data) {
			var option = {
				chart: {
					renderTo: 'container1',
					type: 'column'
				},
				title: {
					text: '米饭生产日计划总量'
				},
				xAxis: {
					//categories:  [],
					type: 'datetime',
					labels: {
						formatter:function(){
							return Highcharts.dateFormat('%m-%d', this.value);
						}
					}
				},
				yAxis: {
					min: 0,
					title: {
						text: '计划量'
					},
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
						}
					}
				},
				credits: {
					enabled: false
				},
				tooltip: {
					shared : true,
					xDateFormat: '%Y-%m-%d'
				},  
				plotOptions: {
					column: {
						stacking: 'normal',
						dataLabels: {
							enabled: true,
							color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
							style: {
								textShadow: '0 0 3px black, 0 0 3px black'
							}
						}
					}
				},
				series: [{
					name: '上午',
					data: []
				}, {
					name: '下午',
					data: []
				}]
			};
			
			$.each(data, function(i, item) {
				var s = moment(item.productionDate);
				var d = Date.UTC(s.year(), s.month(), s.date());
				
				if (item.productionBatch == 1) {
					option.series[0].data.push([d, item.quantity])
				} else {
					option.series[1].data.push([d, item.quantity]);
				}
			});
			
			var chart1 = new Highcharts.Chart(option);
		},
		
		// init cost statistic chart
		loadCostStatistic: function(data) {
			var option = {
				chart: {
					renderTo: 'container1',
					type: 'line'
				},
				title: {
					text: '米饭生产成本曲线'
				},
				xAxis: {
					type: 'datetime',
					labels: {
						formatter:function(){
							return Highcharts.dateFormat('%m-%d', this.value);
						}
					}
				},
				yAxis: {
					min: 0,
					title: {
						text: '费用'
					},
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
						}
					}
				},
				credits: {
					enabled: false
				},
				tooltip: {
					shared : true,
					xDateFormat: '%Y-%m-%d'
				},  
				plotOptions: {
					line: {
						dataLabels: {
							enabled: true
						}
					}
				},
				series: [{
					name: '上午',
					data: []
				}, {
					name: '下午',
					data: []
				}]
			};
			
			$.each(data, function(i, item) {
				var s = moment(item.productionDate);
				var d = Date.UTC(s.year(), s.month(), s.date());
				
				if (item.batch == 1) {
					option.series[0].data.push([d, item.averageCost])
				} else {
					option.series[1].data.push([d, item.averageCost]);
				}
			});
			
			var chart1 = new Highcharts.Chart(option);
		},
		
		// call in planning details
		loadPlanningDetails: function(id, $dom) {
			$.getJSON("/planning/getDetails", { id: id }, function(response) {
				$.each(response, function(i, item) {
					var name =	$("<td/>").append(response[i].name);
					var quantity = $("<td/>").append(response[i].quantity + " 箱");
					var row = $("<tr/>").append(name).append(quantity);
					
					$dom.append(row);
				});
			});
		},
		
		getDashboardRealTimeData: function() {
			handleRealTimeData();
		},
		
		loadDashboardCharges: function() {
			handleBaseCharge();
		},
		
		loadDashboardPlanningDetails: function($dom) {
			$.getJSON("/planning/getCurrentDetails", function(response) {
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
					$dom.append(row);
				}
				
				$('#total-planning').text(total);
				
				var date = moment();
				if (date.hour() < 12) {
					$('small#production-batch').text('上午');
				} else {
					$('small#production-batch').text('下午');
				}
			});
		},
		
		setDashboardTime: function($dom) {
			
			setInterval(function(){
				$dom.html(moment().format('YYYY年MM月DD日 HH:mm:ss')); 
			},1000);
			
		}
	}

}();

