import { EnvironmentService } from '../environment.variables';
import { extractKey } from '../utilities/keys';

let environmentService = new EnvironmentService('.env');
/**
 *  Creamos la interface IEnvironmentConfig la cual obtendrá todas 
 *  las propiedades de nuestro entorno de trabajo.
 */
interface IEnvironmentConfig {
  rootPath: string;
  db: string;
  httpPort: number;
  wsPort: number;
  jwtSecret: string;
  domain: string;
  httpProtocol: string;
  wsProtocol: string;
  awsKey: string;
  awsSecret: string;
}

/**
 *  Creamos una interface "IConfig", la cual contendrá a IEnvironmentConfig
 *  Estos objetos tipados implementan la interfaz IEnvironmentConfig con los
 *  Entornos de desarrollo y produccion (según se implemente);
 */
interface IConfig {
  [key: string]: IEnvironmentConfig;
  development: IEnvironmentConfig;
  production: IEnvironmentConfig;
}

/**
 *  Seteamos la variable rootPath, para saber la ruta en la cual se encuentra el servidor.
 */
const rootPath = process.cwd();

/**
 *  En la constante jwtSecret asignamos la llave creada en /keys/jwt.private.key
 */
const jwtSecret = extractKey(`${rootPath}/keys/jwt.private.key`);

/**
 *  Definimos los valores para local y produccion
 */
const Config: IConfig = {
  development: {
    rootPath,
    db: `mongodb://${environmentService.get("MONGO_USERNAME")}:${environmentService.get("MONGO_PASSWORD")}@${environmentService.get("MONGO_HOST1")}:${environmentService.get("MONGO_PORT1") || 27017}/my-db?authMechanism=SCRAM-SHA-1&authSource=admin`,//to work with local docker database
    //db: `mongodb://gustavo:12345678@127.0.0.1:27017/my-db`,
    httpPort: 1337,
    wsPort: 1338,
    jwtSecret,
    domain: 'localhost',
    httpProtocol: 'http',
    wsProtocol: 'ws',
    awsKey: process.env.AWS_KEY,
    awsSecret: process.env.AWS_SECRET
  },
  production: {
    rootPath,
    //db: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST1}:${process.env.MONGO_PORT1 || 27017}/etd?authMechanism=SCRAM-SHA-1&authSource=admin`,
    db: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST1}:${process.env.MONGO_PORT1 || 27017}/etd?replicaSet=${process.env.REPLICA_NAME}`,
    httpPort: + process.env.HTTP_SERVER_PORT,
    wsPort: + process.env.WS_PORT,
    jwtSecret,
    domain: process.env.DOMAIN,
    httpProtocol: process.env.HTTP_PROTOCOL,
    wsProtocol: process.env.WS_PROTOCOL,
    awsKey: process.env.AWS_KEY,
    awsSecret: process.env.AWS_SECRET
  }
};

export {
  IEnvironmentConfig,
  IConfig,
  Config
};
