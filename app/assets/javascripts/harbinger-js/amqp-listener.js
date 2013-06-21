/*
=AMQP Listener=

An abstraction layer for listening to amqp messages and binding to exchanges built on jquery and the cometd library

*/

(function($) {
    var cometd = $.cometd;
    if ($.harbingerjs == undefined) { $.harbingerjs = {} }
    $.harbingerjs.amqp = {};
    var amqp = $.harbingerjs.amqp;
    function blankCallbacks() {
	return {
	    handshake: [],
	    connect: [],
	    disconnect: [],
	    message: [],
	    bound: [],
	    unbound: []
	};
    }

    $.extend(amqp,{
	cometd: $.cometd,
	_connected: false,
	bindings: [],
	callbacks: blankCallbacks(),
	message_parser: JSON.parse,
	setMessageParser: function(fun) {
	    $.harbingerjs.amqp.message_parser = fun;
	    return fun;
	},
	matchRoutingKey: function (match,key) {
	    if (match == "" && key == "") { return true; }
	    var match_list = match.split(".");
	    var match_token = match_list[0];
	    var match_rest = match_list.slice(1);
	    var key_list = key.split(".");
	    var key_token = key_list[0];
	    var key_rest = key_list.slice(1);
	    if (match_token == "#") { return true; }
	    else if (match_token == "*" && key_token != undefined) { return amqp.matchRoutingKey(match_rest.join("."),key_rest.join(".")); }
	    else if (match_token == key_token) { return amqp.matchRoutingKey(match_rest.join("."),key_rest.join(".")); }
	    else if (match_token != key_token) { return false; }
	    else { throw "Unexpected condition in match routing key" }
	},
	addCallback: function(callback_type,fun,matcher,exchange,name) {
	    if (callback_type == 'message') {
		if (matcher == undefined) { var matcher = "#"; }
		amqp.callbacks[callback_type].push({'fun': fun,'matcher': matcher,'exchange': exchange,'name': name});
		return [callback_type,fun,matcher,name];
	    } else {
		amqp.callbacks[callback_type].push(fun);
		return [callback_type,fun];
	    }
	},
	removeCallback: function(callback_type,matcher,exchange,name) {
	    var old_size = amqp.callbacks[callback_type].length;
	    if (callback_type == 'message') {
		var matchFun = function(cb) { return (cb.matcher == matcher && cb.exchange == exchange && cb.name == name); }
	    } else {
		var matchFun = function(cb) { return (cb.routing_key == matcher && cb.exchange == exchange && cb.name == name); }
	    }
	    var replacement = $.grep(amqp.callbacks[callback_type],matchFun,true);
	    amqp.callbacks[callback_type] = replacement;
	    return amqp.callbacks[callback_type].length < old_size;
	},
	addListener: function(fun,matcher,exchange,name) {
	    return amqp.addCallback('message', fun, matcher, exchange, name);
	},
	removeListener: function(matcher,exchange,name) {
	    return amqp.removeCallback('message', matcher, exchange, name);
	},
	runCallback: function(callback_type,message) {
	    $.each(amqp.callbacks[callback_type],function(index,fun) { fun(message) });
	},
	runBindCallback: function(callback_type,message) {
	    var exchange = message.data[callback_type].exchange;
	    var routing_key = message.data[callback_type].routing_key;
	    $.each(amqp.callbacks[callback_type],function(index,cb) {
		if (exchange == cb.exchange && routing_key == cb.routing_key) {
		    cb.fun(message);
		}
	    });
	},
	runListener: function(message) {
	    if (message.data.bound != undefined) { amqp.runBindCallback('bound',message); }
	    else if (message.data.unbound != undefined) { amqp.runBindCallback('unbound',message); }
	    else {
		$.each(amqp.callbacks['message'],function(index,funobj) {
		    if ($.harbingerjs.amqp.matchRoutingKey(funobj.matcher, message.data.message.routing_key) &&
			(funobj.exchange == undefined || funobj.exchange == message.data.message.exchange)) {
			var payload = message.data.message.payload;
			try { payload = $.harbingerjs.amqp.message_parser(message.data.message.payload); } catch(err) { }
			funobj.fun(message.data.message.routing_key,payload,message.data.message.exchange);
		    }
		});
	    }
	},
	bind: function(exchange,routing_key,bindingCallback,unbindingCallback) {
	    var bindingObj = {'exchange':exchange,'routing_key':routing_key};
	    amqp.bindings.push(bindingObj);
	    if (bindingCallback != undefined) { amqp.addCallback('bound',$.extend({},bindingObj,{fun: bindingCallback})); }
	    if (unbindingCallback != undefined) { amqp.addCallback('unbound',$.extend({},bindingObj,{fun: unbindingCallback})); }
	    cometd.batch(function() {
		cometd.publish('/service/amqp',{'bind': {'exchange':exchange,'routing_key':routing_key}})
	    });
	},
	unbind: function(exchange,routing_key,unbindingCallback) {
	    var bindingObj = {'exchange':exchange,'routing_key':routing_key};
	    var new_bindings = $.grep(amqp.bindings,function(binding,i) {
		return (binding.exchange == bindingObj.exchange && binding.routing_key == bindingObj.routing_key);
	    },true);
	    amqp.bindings = new_bindings;
	    if (unbindingCallback != undefined) { amqp.addCallback('unbound',$.extend({},bindingObj,{fun: unbindingCallback})); }
	    cometd.batch(function() {
		cometd.publish('/service/amqp',{'unbind': {'exchange':exchange,'routing_key':routing_key}})
	    });
	},

	clearCallbacks: function() {
	    amqp.callbacks = blankCallbacks();
	},

	_metaConnect: function(message) {
            if (cometd.isDisconnected() || message.failure) {
                this._connected = false;
                this.runCallback('disconnect',message); //Connection Closed
                return;
            }

            var wasConnected = this._connected;
            this._connected = message.successful === true;
            if (!wasConnected && this._connected)
            {
                this.runCallback('connect',message); //Connection Successful
            }
            else if (wasConnected && !this._connected)
            {
                this.runCallback('disconnect',message) //Connection Broken
            }
        },
	_metaHandshake: function(handshake) {
	    if (handshake.successful === true) {
                cometd.batch(function() {
		    cometd.subscribe('/amqp', amqp.runListener);
		});
            }
	},
	connect: function(options) {
	    var self = this;
	    if (harbingerjsCometdURL) { var cometURL = harbingerjsCometdURL }
	    else { var cometURL = location.protocol + "//" + location.hostname + ":8080/cometd-amqp/cometd"; }
	    var config = {url: cometURL, logLevel: 'warn'};
	    $.extend(config,options);
	    if (config.logLevel == "amqp-debug") {
		config.logLevel = 'warn';
		amqp.addCallback('message',function(routing_key,payload) {
		    console.log("Received new message...");
		    console.log(routing_key);
		    console.log(payload);
		});
	    }
	    cometd.configure(config);
	    cometd.addListener('/meta/handshake', function(message) { self._metaHandshake.apply(self,[message]); });
	    cometd.addListener('/meta/connect', function(message) { self._metaConnect.apply(self,[message]); });
	    cometd.handshake();
	},
	disconnect: function() { cometd.disconnect(true) },
	setup: function(options) {
	    $(window).unload(function() { amqp.disconnect() });
	    this.connect(options);
	}
    });
})(jQuery);
