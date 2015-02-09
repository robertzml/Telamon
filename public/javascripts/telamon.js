
var telamon = function () { 
	
	var startDate, endDate;
	
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
				todayHighlight: true,
                autoclose: true
            });
        }
    }
	
	
    var handleDateRangePickers = function ($dom, callback) {
        if (!jQuery().daterangepicker) {
            return;
        }

		startDate = moment().subtract('days', 29);
		endDate = moment();
		$('input#startDate').val(startDate.format('YYYY-MM-DD'));
		$('input#endDate').val(endDate.format('YYYY-MM-DD'));
		//console.log(startDate.format('YYYY-MM-DD'));
		//console.log(endDate.format('YYYY-MM-DD'));
			
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
		}, function (start, end) {
			$dom.find('span').html(start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));
		}).on('apply.daterangepicker', function(ev, picker) {
			console.log(picker.startDate.format('YYYY-MM-DD'));
			console.log(picker.endDate.format('YYYY-MM-DD'));
			startDate = picker.startDate;
			endDate = picker.endDate;
			$('input#startDate').val(startDate.format('YYYY-MM-DD'));
			$('input#endDate').val(endDate.format('YYYY-MM-DD'));
			callback(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
		});
		
        //Set the initial state of the picker label
		$dom.find('span').html(moment().subtract('days', 29).format('YYYY-MM-DD') + ' 至 ' + moment().format('YYYY-MM-DD'));
		callback(moment().subtract('days', 29).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
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
					tickInterval: 24 * 3600 * 1000,
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
			var colors = Highcharts.getOptions().colors;
			var option = {
				chart: {
					renderTo: 'container1'
				},
				title: {
					text: '米饭生产成本曲线'
				},
				xAxis: {
					type: 'datetime',
					tickInterval: 24 * 3600 * 1000,
					labels: {
						formatter:function(){
							return Highcharts.dateFormat('%m-%d', this.value);
						}
					}
				},
				yAxis: [{
					title: {
						text: '成本(元/箱)'
					},
                    min: 0,
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: colors[0]
						}
					}
				}, {
					title: {
						text: '总箱数'
					},
					opposite: true,
                    max: 500,
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: colors[1]
						}
					}
				}],
				credits: {
					enabled: false
				},
				tooltip: {
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
					yAxis: 0,
					name: '成本',
                    type: 'line',
					data: []
				},{
					yAxis: 1,
					name: '产量',
                    type: 'column',
					data: []
				}]
			};
			
			$.each(data, function(i, item) {
				var s = moment(item.productionDate);
				var d = Date.UTC(s.year(), s.month(), s.date());
				
				
				option.series[0].data.push([d, item.averageCost]);
				option.series[1].data.push([d, item.totalCount])
				
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

		exportPlanning: function($dom) {
			$dom.click(function(e) {
				e.preventDefault();
				
				
				$.get('/statistic/exportPlanning', { startDate: startDate.format("YYYY-MM-DD"), endDate: endDate.format("YYYY-MM-DD") }, function(response) {
				
				});
			});
		}

	}

}();
