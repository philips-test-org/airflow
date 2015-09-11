$(function(){
    /* Cometd */
    $.harbingerjs.amqp.addCallback('disconnect', function(message){});
    $.harbingerjs.amqp.addCallback('connect', function(message){
        $.harbingerjs.amqp.bind("audit", "rad_reports.insert.#",
          function(bindMessage){
            console.log(bindMessage);
          }, function(unBoundMessage){
            console.log(unBoundMessage);
          })
    })
    $.harbingerjs.amqp.setup({url: harbingerjsCometdURL});

    $.harbingerjs.amqp.addListener(function(message, payload){
      console.log(payload);
      console.log('Got a new rad_report notification: ' + message);
    }, "rad_reports.insert.#", "audit");
})
