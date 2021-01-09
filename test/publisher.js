var redis = require('redis');
var publisher = redis.createClient({
    host:'localhost',
    port:7210,
});
//const redisClient = redis.createClient({host:"localhost", port: process.env.redisPort||7210});
/* publisher.publish('notification-comlink', '{\”message\”:\”Hello world from Comlink!\”}', function(){
 process.exit(0);
}); */
setInterval(function(){
    publisher.publish('comlink_test1', '{\”message\”:\”Hello world from Comlink!\”}', function(){
    
    });
},1000);  

setInterval(function(){
    publisher.publish('comlink_test2', '{\”message\”:\”Hello world from Comlink!\”}', function(){
    
    });
},1000); 

setInterval(function(){
    publisher.publish('comlink_test3', '{\”message\”:\”Hello world from Comlink!\”}', function(){
    
    });
},1000); 
 setInterval(function(){
   publisher.publish('etd_test', '{\”message\”:\”Hello world from Etd!\”}', function(){
   // process.exit(0);
   });
},1000);


