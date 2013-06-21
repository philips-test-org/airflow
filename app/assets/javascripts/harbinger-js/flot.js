/*
=Harbinger JS: flot=

extentions for turning harbingerjs data structures into flot data

*/


(function($) {
    if ($.harbingerjs == undefined) { $.harbingerjs = {} }
    if ($.harbingerjs.log == undefined) { $.harbingerjs.log = function(level) {
	if (console != undefined && console.log != undefined) {
	    console.log(level,arguments);
	}
    }}

    $.harbingerjs.utils = {
	transformsToFunctions: function(transforms) {
	    var functions = {};
	    $.each(transforms,function(key,fun_or_attribute) {
		if ($.type(fun_or_attribute) != "function") { functions[key] = function(hash) { return hash[fun_or_attribute] } }
		else { functions[key] = fun_or_attribute }
	    });
	    return functions;
	},

	isNull: function() {//takes arguments
	    var inull = false;
	    $.map(arguments,function(value) { if (value == undefined || value == null) { inull = true; }});
	    return inull;
	}
    }

    $.harbingerjs.flot = {
	min_and_max: function(DateString) {
	    if ($.type(DateString) == "date") { var min = DateString; min.clearTime(); }
	    else { var min = Date.parse(DateString); }
	    var utc_min = (min.getTime() - (min.getTimezoneOffset() * 60 * 1000));
	    var utc_max = utc_min + 24*60*60*1000;
	    return {'min': utc_min,
		    'max': utc_max};
	}
    }

    $.harbingerjs.flot.gantt = {
	toSeries: function(data_transformers,series_options) {
	    if (series_options == undefined) { series_options = {} }
	    if (data_transformers["start"] == undefined || data_transformers["stop"] == undefined) {
		throw "Cannot create series without start and stop values"
	    } else {
		var functions = $.harbingerjs.utils.transformsToFunctions(data_transformers);
	    }

	    //Default functions when none are given
	    if (functions["row"] == undefined) { functions["row"] = function(hash) { return 1; } }
	    if (functions["color"] == undefined) { functions["color"] = function(hash) { return null; } }
	    if (functions["filter"] == undefined) { functions["filter"] = function(hash) { return false; } }

	    var list = this.transform([],function(acc,hash) {
		if ($.harbingerjs.utils.isNull(functions["start"](hash),functions["stop"](hash),functions["row"](hash))) {
		    $.harbingerjs.log("user","bad data given",hash);
		} else {
		    if (!functions["filter"](hash)) {
			acc.push([
			    $.harbingerjs.typeCast("date",functions["start"](hash)).toUTC(), //Start time with UTC offset
			    functions["row"](hash), // Row number (equates to Y value)
			    $.harbingerjs.typeCast("date",functions["stop"](hash)).toUTC(), //Stop time with UTC offset
			    hash, // Object passed as the "datapoint" portion of the object given on plot events
			    functions["color"](hash) // Color of the data point
			]);
		    }
		}
		return acc;
	    });

	    return [$.extend({},series_options,{'data':list})];
	},

	swimmingLane: {
	    toSeries: function(data_transformers,series_options) {
		// Defaults color and row
		var self = this;
		var dts = $.extend({},{"row": function(hash) { return 1; },"color": function(hash) { return null; }},data_transformers);
		// Check for clipping errors (overlapping data) and color
		// Bad data points red (#cf061e)

		function findNext(list,current_data,next_index) {
		    if (list[next_index] == undefined) {
			return undefined;
		    } else if (current_data[1] == list[next_index][1]) {
			return list[next_index];
		    } else {
			return findNext(list,current_data,next_index+1);
		    }
		}

		serieses = $.harbingerjs.flot.gantt.toSeries.apply(this,[dts,series_options]);
		$.each(serieses,function(index,series) {
		    series['data'].sort(function(a,b) { return a[0] >= b[0] ? 1 : -1; });
		    $.each(series['data'],function(index,data_point) {
			var next = findNext(series['data'],data_point,index+1);
			if (next != undefined && data_point[2] >= next[0] + 1000*60*5) {//five minute leeway
			    data_point[2] = next[0] - 1000*5; // Set it five seconds back from the next start time
			    data_point[4] = "#cf061e";
			}
		    });
		});
		return serieses;
	    }
	},

	swimmingLaneWithScheduled: {
	    toSeries: function(data_transformers,series_options) {
		var actual_data_transforms = $.extend({},data_transformers,
						      {"filter": function(exam) { return exam.begin_exam == undefined ? true : false },
						       "row": function() { return 2; }});
		var scheduled_data_transforms = $.extend({},data_transformers,
							 {"start": data_transformers["scheduled_start"],"stop":data_transformers["scheduled_stop"],
							  "row": function() { return 1; }});
		var actual = $.harbingerjs.flot.gantt.swimmingLane.toSeries.apply(this,[actual_data_transforms,series_options]);
		var scheduled = $.harbingerjs.flot.gantt.swimmingLane.toSeries.apply(this,[scheduled_data_transforms,series_options]);
		return actual.concat(scheduled);
	    }
	},

	queue: {
	    toSeries: function(data_transformers,series_options) {
		// Defaults color and overrides row
		var dts = $.extend({},{"color": function(hash) { return null; }},data_transformers,{"row": function(hash) { return 1; }});
		var flot_args = $.harbingerjs.flot.gantt.toSeries.apply(this,[dts,series_options]);
		// Replaces the row values with a series
		var index_count = 0;
		var new_flot_args = [];
		$.each(flot_args,function(index,series) {
		    series['data'].sort(function(a,b) { return a[0] >= b[0] ? 1 : -1; });
		    $.each(series['data'],function(i,data_point) { data_point[1] = index_count++; });
		    new_flot_args.push(series);
		});
		return new_flot_args;
	    }
	}
    }

    $.harbingerjs.flot.xy = {
	toSeries: function(transforms,series_options) {
	    if (series_options == undefined) { series_options = {} }
	    if (transforms["x"] == undefined || transforms["y"] == undefined) {
		throw "Cannot create series without x and y transforms"
	    } else {
		var functions = $.harbingerjs.utils.transformsToFunctions(transforms);
	    }
	    var list = this.transform([],function(acc,hash) {
		var data_point = [functions["x"](hash),functions["y"](hash)];
		if (functions["z"] != undefined) { data_point.push(functions["z"](hash)) }
		acc.push(data_point);
		return acc;
	    });
	    return [$.extend({},series_options,{'data':list})];
	}
    }

    $.harbingerjs.flot.histogram = {
	toSeries: function(transforms,sorter) {
	    var functions = $.harbingerjs.utils.transformsToFunctions(transforms);
	    if (functions["x"] == undefined || functions["y"] == undefined)
		throw "Cannot create series without x and y transforms";
	    if (functions["group"] == undefined) { functions["group"] = function(row) { return ""; }; }
	    var groupTables = this.segregate(functions["group"]);
	    var ticks = this.ticks(functions,sorter);
	    var series = [];
	    $.each(groupTables,function(key,table) {
		var data = table.transform([],function(acc,row) { acc.push([ticks.indexOf(functions["x"](row)),functions["y"](row)]); return acc; });
		series.push({data: data, label: key});
	    });
	    var xpoints = [];
	    $.each(ticks, function(i,value) { return xpoints.push([i,value]); });

	    return {series: series, ticks: xpoints};
	},

	ticks: function(functions,sorter) {
	    if (sorter == undefined) { var sorter_args = [] } else { var sorter_args = [sorter] }
	    var set = this.transform({},function(acc,row) { acc[functions["x"](row)] = true; return acc; });
	    var ticks = [];
	    $.each(set,function(key,value) { ticks.push(key); });
	    ticks.sort();
	    return ticks;
	}

    }

    $.harbingerjs.flot.timeHistogram = {
	toSeries: function(min,max,interval,transforms) {
	    if ($.type(min) == "string") { min = $.harbingerjs.typeCast("date",min).toUTC(); }
	    if ($.type(max) == "string") { max = $.harbingerjs.typeCast("date",max).toUTC(); }
	    if (transforms["series"] == undefined) { transforms["series"] = function(series,group,rows) { return series; } }
	    if (transforms["value"] == undefined) { transforms["value"] = function(row) { return 1; } }
	    if (transforms["group"] != undefined && transforms["time"] != undefined) { var functions = $.harbingerjs.utils.transformsToFunctions(transforms); }
	    else {throw "Cannot create series without group and time transforms" }

	    // Create an array of bins based on the max and min time
	    // incrementing by interval and setting the y value to 0
	    var bins = [];
	    var current_bin = min.toUTC();
	    while (current_bin <= max) {
		bins.push([current_bin,0]);
		current_bin += interval*60*1000;
	    }

	    // Loop over each series and with each series
	    // create an interval list build on the time bins created
	    // above. Check to see if the time bin in between the start
	    // and stop time of the row's start and stop times
	    // if it is then increment the y value of the bin by itself
	    // plus the return of the value function of the row
	    grouped_series = this.groupWith(functions["group"]);
	    var series = [];
	    $.each(grouped_series,
		   function(group,rows) {
		       var interval_list = [];
		       $.each(bins,function(i,val) { interval_list.push($.extend([],val)); });
		       $.each(rows,
			      function(index,row) {
				  $.each(interval_list, function(i,timeGroup) {
				      if (functions["time"](timeGroup[0],row)) { timeGroup[1] += functions["value"](row) }
				  })
			       });
		       series.push(functions["series"]({'label': group, 'data': interval_list, 'bars':{show: true}},rows));
		   });
	    return series;
	}
    }

    $.harbingerjs.flot.dateHistogram = {
	toSeries: function(interval,transforms) {
	    if (transforms["group"] != undefined && transforms["date"] != undefined) { var functions = $.harbingerjs.utils.transformsToFunctions(transforms); }
	    else { throw "Cannot create series without group and date transforms" }

	    var min = this.min(functions["date"]);
	    var max = this.max(functions["date"]);
	    var bin_check = function(time,row) {
		return functions["date"](row).toUTC() == time;
	    };
	    return $.harbingerjs.flot.timeHistogram.toSeries.apply(this,[min,max,interval,$.extend({},functions,{"time":bin_check})]);
	}
    }


    $.harbingerjs.flot.timeBin = {
	toSeries: function(start,stop,interval,transforms,series_options) {
	    if ($.type(start) == "string") { start = $.harbingerjs.typeCast("date",start).toUTC(); }
	    if ($.type(stop) == "string") { stop = $.harbingerjs.typeCast("date",stop).toUTC(); }
	    if (series_options == undefined) { series_options = {} }
	    if (transforms["color"] == undefined || transforms["start"] == undefined || transforms["stop"] == undefined) {
		throw "Cannot create series without start, stop and color transforms"
	    } else {
		var functions = $.harbingerjs.utils.transformsToFunctions(transforms);
	    }

	    var bins = [[start,0]];
	    var binval = start;
	    while (binval <= stop) {
		bins.push([binval += interval*60*1000,0]);
	    }

	    var series_by_color = this.transform({},function(accum,row) {
		var color = functions["color"](row);
		if (accum[color] == undefined) { accum[color] = []; }
		accum[color].push(row);
		return accum;
	    });

	    var series = [];
	    $.each(series_by_color,
		   function(color,rows) {
		       var interval_list = [];
		       $.each(bins,function(i,val) { interval_list.push($.extend([],val)); });
		       $.each(rows,function(index,row) {
			   row_start = functions["start"](row).toUTC();
			   row_stop = functions["stop"](row).toUTC();
			   $.each(interval_list, function(i,timeGroup) {
			       if (row_start <= timeGroup[0] && row_stop >= timeGroup[0]) { timeGroup[1] += 1; }
			   })
			       });
		       series.push({'color': "#333333", 'data': interval_list, 'bars':{show: true, fill: true, fillColor: color}});
		   });
	    return series;
	}
    }

})(jQuery);
