import { Db, MongoClient } from 'mongodb';
import { EnvironmentService } from '../environment.variables';

/**
 * Class to connect with mongo and get the etd db
 *
 * @export
 */
export class MongoDb {
    private client: MongoClient;
    env = new EnvironmentService('.env');
    private readonly connectionString = 'mongodb://gustavo:12345678@127.0.0.1:27017/my-db'
   // private readonly connectionString =  `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST1}:${process.env.MONGO_PORT1 || 27017}/etd?replicaSet=${process.env.REPLICA_NAME}`;
    //private readonly connectionString = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST1}:${process.env.MONGO_PORT1 || 27017}/etd?authMechanism=SCRAM-SHA-1&authSource=admin`;
    //private readonly dbName = process.env.DB_NAME || 'etd';
    
    /**
     * closes the connection with mongo client
     *
     */
    public close() {
        if (this.client) {
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            this.client.close()
            .then()
            .catch(error => {
                console.error(error);
            });
        } else {
            console.error('close: client is undefined');
        }
    }

    // connects to mongo client
    public async connect() {
        try {
            console.log('**********************************************************');
            if (!this.client) {
                console.log('**********************************************************');
                console.info(`Connection to ${this.connectionString}`);
                this.client = await MongoClient.connect(this.connectionString, { useNewUrlParser: true});
            }
        } catch(error) {
            console.log("------------------------------------------------------error\n");
            console.error(error);
        }
    }

    public getDb(dbName): Db {
        if (this.client) {
            console.info(`getting db ${dbName}`);
            return this.client.db(dbName);
        } else {
            console.error('no db found');
            return undefined;
        }
    }
}