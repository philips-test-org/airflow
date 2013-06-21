(function($) {
    if ($.harbingerjs == undefined) { $.harbingerjs = {}; }
    if ($.harbingerjs.asic == undefined) { $.harbingerjs.asic = {}; }
    var asic = $.harbingerjs.asic;

    asic.on = false;
    asic.callAttributes = {crossDomain: true,async: true,contentType: "application/json"};
    asic.host = {};
    // Based on browser checks 
    if (asic.jsonp_fallback == true) {
	asic.host.url = "http://127.0.0.1:52180/proxy/";
	$.extend(asic.callAttributes,{type: "GET", data: {data: ""}, dataType: "jsonp"});
    } else {
	asic.host.url = "http://127.0.0.1:52180/";
	$.extend(asic.callAttributes,{type: "POST"});
    }

    asic._readys = [];
    asic.ready = function(fun) {
	if (asic.on == false) {
	    asic._readys.push(fun);
	} else {
	    fun();
	}
    };

    asic.error = function(message,e) { throw message + e; }
    asic.unload = function() { };
    asic.setup = function(hostData) {
	$(window).unload(asic.unload);
	asic.host.id = hostData['host-id'];
	$.extend(asic,{
	    setup: function() { throw "ASIC already setup" },
	    formatData: function(data) {
		if (asic.jsonp_fallback == true) {
		    return {'data': JSON.stringify(data)};
		} else {
		    return JSON.stringify(data);
		}
	    },
	    sameExam: function(exam1,exam2) {
		if (exam1.mrn != undefined &&
		    exam1.accession != undefined &&
		    exam1.mrn == exam2.mrn &&
		    exam1.accession == exam2.accession) {
		    return true;
		} else if (exam1['study-uid'] != undefined && exam1['study-uid'] == exam2['study-uid']) {
		    return true;
		} else {
		    return false;
		}
	    },
	    examInList: function(exam,listOfExams) {
		var list = $.grep(listOfExams,function(n) { return asic.sameExam(exam,n); });
		if (list.length > 0) { return true; } else { return false; }
	    },
	    examsInList: function(exams1,exams2) {
		var list = $.map(exams1,function(exam) { return asic.examInList(exam,exams2); });
		if ($.inArray(false,list) == -1) { return true; } else { return false; }
	    },
	    dispatch: function(rk,payload) {
		// asic.host-id.event-type.event
		tokens = rk.split(".");
		if (tokens[2] == "image-viewer") { asic.imageViewer.dispatch(tokens[3],payload) }
		else { throw "ASIC Dispatch Error: Unknown event type"; }
	    },
	    imageViewer: {
		bindings: [],
		dispatch: function(event,payload) {
		    $.each(asic.imageViewer.bindings,function(i,funhash) {
			if (funhash[event]) { funhash[event](payload) };
		    });
		},
		bind: function(funhash) { asic.imageViewer.bindings.push(funhash); },
		currentState: function(funs) {
		    if (funs == undefined) { funs = {} };
		    var funObj = $.extend({},{'beforeSend': function() { asic.imageViewer.dispatch("loading"); },
					      'success': function(response) { asic.imageViewer.dispatch("state",response); },
					      'error': function(error) { asic.imageViewer.dispatch("error",error); }},
					 funs);
		    $.ajax(asic.host.url + "image-viewer/current-state",
			   $.extend({},asic.callAttributes,funObj));
		},
		openStudy: function(exam) {
		    var fdata = asic.formatData(exam);
		    asic.imageViewer.currentState({
			'success': function(response) {
			    if (response.data && asic.examInList(exam,response.data)) {
				asic.imageViewer.dispatch("state",response);
				asic.imageViewer.dispatch("study-already-loaded",exam,response.data,true);
			    } else {
				$.ajax(asic.host.url + "image-viewer/open-study",
				       $.extend({},asic.callAttributes,
						{'data': fdata,
						 'success': function() { asic.imageViewer.dispatch('loading'); },
						 'error': function(error) { asic.imageViewer.dispatch('error',error); }}));
			    }
			}
		    });
		}
	    }
	});
	$.harbingerjs.amqp.setup({url: $.cometURL});
	$.harbingerjs.amqp.addCallback('disconnect',function(message) { asic.unload(); });
	$.harbingerjs.amqp.addListener(function(rk,payload) { asic.dispatch(rk,payload); },"asic." + asic.host.id + ".#");
	$.harbingerjs.amqp.bind("asic","asic." + asic.host.id + ".#",
				function(m) { asic.on = true; $.each(asic._readys,function(i,fun) { fun(); }); });
    }


    $(document).ready(function() {
	$.ajax(asic.host.url + "host-id", $.extend({},asic.callAttributes,{success: asic.setup,
									   error: function(eobj,error) {
									       asic.error("Integration setup fail: host query failed with "
											  + error)
									   }}))});

})(jQuery);