if (typeof application == "undefined") { application = {} }

application.buffer = {
    create: function(initial_state,flush_timeout,reducer,flusher) {
	var self = {
	    state: initial_state,
	    flusher: flusher,
	    reducer: reducer
	};
	self.queue = function(rk,payload,exchange) {
	    self.state = self.reducer(self.state,rk,payload,exchange);
	},
	self.flush_interval_function = setInterval(function() {
	    self.flusher(self.state);
	},flush_timeout);
	return self;
    }
}

application.auditBuffer = application.buffer.create({rad_exams: {}, orders: {}},
						    1000,
						    function(state,rk,payload,exchange) {
							var tokens = rk.split("."),
							    table = tokens[0],
							    id = tokens[2];
							// Get correct attribute values for payload
							if (payload.pre_and_post.post != undefined) {
							    attrs = payload.pre_and_post.post;
							} else {
							    attrs = payload.pre_and_post.pre;
							}

							if (table == "orders") {
							    // Set the state with the order id
							    state[table][id] = id;
							} else if (table == "rad_exams" && (attrs.order_id != null || attrs.order != undefined)) {
							    // Check if there is an order id and then set the state to include the order id
							    // and note that there is an order id for that rad exam's id
							    state["orders"][attrs.order_id];
							    state[table][id] = "has order";
							} else if (table == "rad_exams") {
							    // Set the rad exam id
							    state[table][id] = id;
							} else {
							    // Set the rad exam id unless it's already there
							    table = "rad_exams";
							    id = attrs.rad_exam_id;
							    if (state[table][id] == undefined) { state[table][id] = id; }
							}
							// Using object as a set because no sets in js (come on ecmascript6)
							return state;
						    },
						    function(state) {
							$.each(state,function(k,v) {
							    var table = k;
							    $.each(v,function(id,idalso) {
								// Short circuit if the rad exam has an order
								if (table == "rad_exams" && idalso == "has order") {
								    delete state[table][id];
								    return null;
								}
								//Clean the state
								delete state[table][id];

								$.ajax($.harbingerjs.core.url("/exam_info"),
								       {data: {id: id,
									       table: table},
									beforeSend: function() {
									    //application.notification.flash("sending exam query for: " + rk);
									},
									success: function(orders) {
									    $.each(orders,function(i,o) {
										var r = application.data.resource(o);
										if (r != undefined && application.data.resourceHash[r.id] != undefined) {
										    if (application.data.orderGroups[application.data.orderGroupIdent(o)] == undefined) {
											application.data.insert(o);
											application.view.redrawCard(o);
										    } else {
											application.data.update(o.id,function(order,rollback_id) {
											    $.extend(order,o);
											    return order;
											},["order-update","modal-update"]);
										    }
										}
									    });
									    //application.notification.flash({type: 'info', message: (operation + " exam " +  exams[0].id)});
									}});
							    });
							});
						    });
