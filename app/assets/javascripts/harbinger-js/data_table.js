/*
=Harbinger JS: data=

A library for storing data in table structures and updating them with real time and sentinal events

*/

(function($) {
    if ($.harbingerjs == undefined) { $.harbingerjs = {} }

    $.harbingerjs.dataTable = function(key_id,fields,extensions,cube_aggregates) {
	if (extensions == undefined) { extensions = [] };
	var retobj = {
	    create: function(data) {
		if ($.type(data) == "array" && data.length == 0) {
		    var hashed_data = {};
		} else if ($.type(data) == "array" && data.length > 0) {
		    var hashed_data = {};
		    $.each(data, function(index,value) { hashed_data[value[key_id]] = $.harbingerjs.typeCastObject(fields,value) });
		} else if ($.type(data) == "object") {
		    var hashed_data = data;
		} else { throw "Unable to build table: data given must be an array or object" }
		var table_scope = this;
		var instanceobj = {
		    raw_data: data,
		    table_scope: table_scope,
		    data: hashed_data,
		    key_id: key_id,
		    fields: fields,
		    event_listeners: [],
		    cube_aggregates: cube_aggregates,
		    listenWith: function(fun) { this.event_listeners = this.event_listeners.push(fun) },
		    update: function(row) {
			this.data[row[this.key_id]] = $.harbingerjs.typeCastObject(this.fields,row);
			this.sendUpdateEvent(row);
			return this.data;
		    },
		    sendUpdateEvent: function() { $.each(this.event_listeners,function(index,listener) { listener.apply(this,arguments) }) },

		    //Manipulate data and return new data table
		    map: function(fun) {
			var list = this.transform([],function(acc,value) { acc.push(fun(value)); return acc; });
			return table_scope.create(list);
		    },

		    clone: function() {
			return table_scope.create($.map(this.data,function(obj) { return $.extend({},obj); }));
		    },

		    rawClone: function() {
			return table_scope.create($.map(this.raw_data,function(obj) { return $.extend({},obj); }));
		    },

		    split: function(groupFunction) {
			var self = this;
			var grouped_data = this.groupWith(groupFunction);
			return $.map(grouped_data,function(value,key) { return self.table_scope.create(value); });
		    },

		    segregate: function(groupFunction) {
			var self = this;
			var grouped_data = this.groupWith(groupFunction);
			var tableHash = {};
			$.each(grouped_data,function(key,value) { tableHash[key] = self.table_scope.create(value); });
			return tableHash;
		    },

		    //iterate over the data, the given functions return is the new accum
		    groupWith: function(groupFunction) {
			if ($.type(groupFunction) == "string")
			    var fun = function(row) { return row[groupFunction]; }
			else var fun = groupFunction;
			return this.transform({},function(acc,row) {
			    var group = fun(row);
			    if (acc[group] == undefined) { acc[group] = []; }
			    acc[group].push(row);
			    return acc;
			});
		    },

		    transform: function(initial,fun) {
			var accumulator = initial;
			$.each(this.data,function(key,value) { accumulator = fun(accumulator,value); });
			return accumulator;
		    },
		    extreme: function(fun_or_attr,test) {
			var fun = null;
			if ($.type(fun_or_attr) == "function") { fun = fun_or_attr; } else { fun = function(row) { return row[fun_or_attr]; } }
			var extreme = null;
			$.each(this.data,function(key,row) {
			    if (extreme == null) { extreme = fun(row) }
			    else if (test(extreme,fun(row))) { extreme = fun(row) }
			});
			return extreme;
		    },
		    min: function(fun_or_attr) { return this.extreme(fun_or_attr,function(min,current) { return min > current;}) },
		    max: function(fun_or_attr) { return this.extreme(fun_or_attr,function(max,current) { return max < current;}) },
		    cube: function(aggregates) {
			if (aggregates != undefined) return $.harbingerjs.cube(this,aggregates);
			else return $.harbingerjs.cube(this,this.cube_aggregates);
		    },
		}
		$.each(extensions,function(index,extension) { $.extend(instanceobj,extension) });
		return instanceobj;
	    }
	}
	return retobj;
    }

    $.harbingerjs.cube = function(table,aggregates) {
	// aggregates example: {"volume": {type: "sum"}, "turn_around_average": {type: "average", count: "volume"}}
	return {
	    table: table,
	    aggregates: aggregates,
	    group: function(fun_or_attr_list) {
		var self = this;
		var fun = null;

		if ($.type(fun_or_attr_list) != "function") {
		    fun = function(row) {
			var composite = "";
			$.each(fun_or_attr_list,function(i,attr) { composite = composite + " " + row[attr]; });
			return composite;
		    }
		} else { fun = fun_or_attr_list; }

		var grouped_data = this.table.transform({},function(accum,row) {
		    var group = fun(row);
		    if (accum[group] == undefined) { accum[group] = row; }
		    else { accum[group] = self.merge(accum[group],row) }
		    return accum;
		});
		var raw_data = [];
		$.each(grouped_data,function(k,v) { raw_data.push(v); });
		return table.table_scope.create(raw_data);
	    },
	    merge: function() {
		var self = this;
		var args = Array.prototype.slice.call(arguments);
		if (args.length > 1) {
		    var acc_row = args[0];
		    $.each(args.slice(1),function(i,row) {
			$.each(self.aggregates,function(agg,agg_metadata) {
			    acc_row = self.aggregateFunctions[agg_metadata.type](acc_row,row,agg,agg_metadata);
			});
		    });
		    return acc_row;
		}
	    },
	    aggregateFunctions: {
		average: function(acc_row,row,key,metadata) {
		    var acc_weight = acc_row[metadata.count];
		    var row_weight = row[metadata.count];
		    acc_row[key] = ((acc_weight * acc_row[key]) + (row_weight * row[key])) / (acc_weight + row_weight);
		    return acc_row;
		},
		sum: function(acc_row,row,key,metadata) {
		    acc_row[key] = acc_row[key] + row[key];
		    return acc_row;
		},
		count: function() { this.sum.apply(this,arguments);}
	    }
	}
    }
})(jQuery);

(function($) {
    if ($.harbingerjs == undefined) { $.harbingerjs = {} }

    $.harbingerjs.parseDate = function(String) {
	var matcher = /(\d{2,4}[-\/]\d{1,2}[-\/]\d{1,2}[T ]\d{1,2}:\d{1,2}:\d{1,2})([- +])(\d{1,2}):(\d{1,2})/i;
	var parts = null;
	if ($.type(String) == "string" && $.type((parts = String.match(matcher))) == "array") {
	    var date = new Date(Date.parse(parts[0]));
	    return date;
	}
	else if ($.type(String) == "date") {
	    return String;
	}
	else {
	    if (Date.parse(String) != null) { return Date.parse(String) }
	    else { throw "Invalid date given to $.harbingerjs.parseDate" }
	}
    }

    $.harbingerjs.typeCastObject = function(fields,hash) {
	var cast_hash = {};
	$.each(hash, function(key,value) {
	    cast_hash[key] = $.harbingerjs.typeCast(fields[key],value);
	});
	return cast_hash;
    };

    $.harbingerjs.typeCast = function(typehint,value) {
	var matcher = /array_of_(.*)/i;
	var parts = null;
	if ($.type(typehint) == "string" && $.type((parts = typehint.match(matcher))) == "array") {
	    return $.map(value, function(i) { return $.harbingerjs.typeCast(parts[1],i); });
	}
	else if (typehint == "date") {
	    var date = null;
	    try { date = $.harbingerjs.parseDate(value) }
	    catch(error) { return value }
	    date.toUTC = function() { return this.getTime() - this.getTimezoneOffset()*60*1000 };
	    return date;
	}
	else if (typehint == "number") {
	    return Number(value);
	}
	else { return value; }
    }
})(jQuery);
