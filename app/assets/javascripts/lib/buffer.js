if (typeof application == "undefined") { application = {} }

function convertTimeAttrs(attrs) {
  $.each(attrs,function(k,v) {
    if ($.type(v) == "string" && v.match(/^\d{4}-\d{2}-\d{2}/) != null) {
      attrs[k] = moment(v).unix()*1000;
    }
  });
  return attrs;
}

function getOrderInfo(table,id) {
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
                if (application.data.orderHash[o.id] == undefined) {
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
}

application.buffer = {
  create: function(flusher,flush_timeout) {
    if (flush_timeout == undefined) flush_timeout = 1000;
    var self = {
      queue: [], // Used to accumualte incoming messages
      buffer: [], // Copy of queue at a given instant for processing
      flusher: flusher,
      flush_timeout: flush_timeout
    };
    self.push = function(rk,payload,exchange) {
      var tokens = rk.split("."),
          table = tokens[0],
          id = tokens[2];
      // Get correct attribute values for payload
      if (payload.pre_and_post.post != undefined) {
        attrs = payload.pre_and_post.post;
      } else {
        attrs = payload.pre_and_post.pre;
      }

      convertTimeAttrs(attrs);

      if (table == "orders") {
        var parent_table = null;
        var parent_id = null;
      } else if (table == "rad_exams") {
        var parent_table = "orders"
        var parent_id = attrs.order_id;
      } else {
        var parent_table = "rad_exams"
        var parent_id = attrs.rad_exam_id;
      }
      self.queue.push({
        table: table,
        id: id,
        parent_table: parent_table,
        parent_id: parent_id,
        attrs: attrs,
        pre_and_post: payload.pre_and_post
      });
    };

    self.flush_interval_function = setInterval(function() {
      self.buffer = self.queue.slice(0);
      self.queue = [];
      if (self.buffer.length > 0) { self.flusher(self.buffer); }
    },flush_timeout);

    return self;
  }
}

application.auditBuffer = application.buffer.create(function(buffer) {
  var orders = {};
  var rad_exams = {};
  var others = [];

  $.each(buffer,function(i,message) {
    if (message.table == "orders") orders[message.id] = message;
    else if (message.table == "rad_exams") rad_exams[message.id] = message;
    else others.push(message);
  });

  $.each(others,function(i,message) {
    if (rad_exams[message.parent_id] != undefined) {
      if (message.table == "rad_exam_times") var attr_name = "rad_exam_time";
      else var attr_name = message.table;
      rad_exams[message.parent_id].attrs[attr_name] = message.attrs;
    }
  });

  $.each(rad_exams,function(id,message) {
    if (orders[message.parent_id] != undefined) {
      orders[message.parent_id].attrs["rad_exam"] = message.attrs; // associate with order
      delete rad_exams[id]; // delete from rad exams
    }
  });

  $.each(orders,function(id,message) {
    var order = message.attrs;
    if (application.data.findOrder(order.id) ||
        (application.data.resource(order) && (application.data.orderStartTime(order) == null || moment(application.data.orderStartTime(order)).startOf('day').unix()*1000 == application.data.startDate))) {
      getOrderInfo("orders",id);
    }
  });

  $.each(rad_exams,function(id,message) {
    var order = {id: message.attrs.order_id, rad_exam: message.attrs};
    if (application.data.findOrder(order.id) ||
        (application.data.resource(order) &&
         (application.data.orderStartTime(order) == null ||
          moment(application.data.orderStartTime(order)).startOf('day').unix()*1000 == application.data.startDate))) {
      getOrderInfo("rad_exams",id);
    }
  });
});
