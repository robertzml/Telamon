
var telamon = function () { 
	
	
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
		
  
		getTotalQuantity: function(id, $dom) {
			$.getJSON("/planning/getQuantity", { id: id }, function(response) {
				var quantity = response.quantity;
				
				$dom.text(quantity);
			});
		}
	}

}();

