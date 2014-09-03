
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
		}
	}

}();

