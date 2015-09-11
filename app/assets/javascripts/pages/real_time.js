$(function(){
    /* Cometd */
    $.harbingerjs.amqp.addCallback('disconnect', function(message){});
    $.harbingerjs.amqp.addCallback('connect', function(message){
        console.log("Connected");
        $.harbingerjs.amqp.bind("web-application-messages", "progress.notification." + $.employeeId + ".#",
          function(bindMessage){
            console.log(bindMessage);
          }, function(unBoundMessage){
            console.log(unBoundMessage);
          })

        $.harbingerjs.amqp.bind("audit", "rad_reports.insert.#",
          function(bindMessage){
            console.log(bindMessage);
          }, function(unBoundMessage){
            console.log(unBoundMessage);
          })
    })
    $.harbingerjs.amqp.setup({url: harbingerjsCometdURL});
})
