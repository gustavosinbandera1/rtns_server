import { Controller } from '@nestjs/common';
import { RedisStoreService } from './redis-store.service';
import chalk from 'chalk';
@Controller('redis-store')
export class RedisStoreController {
    constructor(private readonly redisStore:RedisStoreService){
        // this.redisStore.writeKey("key","value").then(()=>{
        //     console.log(chalk.yellow("se escribio en el server de redis la clave"));
        // });

       

       this.redisStore.redisClient.on("connect", ()=>{
           console.log(chalk.yellow(">>>>>>>>>>>>>coronamos"));

        this.read().then(key =>{
            console.log(chalk.red("leimsos la key bien leida"));
            console.log(key);
        });
       })
    }

    read(){
        return new Promise(resolve => {
            this.redisStore.getKey("hola", function(err,data){
                console.log("porfin la data:" + data);
                resolve(data);
            });

        });
    }

    write(){
      let res = this.redisStore.writeKey("key","value");
    }
}
