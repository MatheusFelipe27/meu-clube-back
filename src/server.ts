import fastify from 'fastify';
import {FastifyInstance} from 'fastify'
import Processes from './processes/processes';

const cors = require("@fastify/cors")

const corsOptions = {
  credentials: true,
  origin: "http://localhost:8080"
}

const app: FastifyInstance = fastify();

app.register(cors, corsOptions)

Processes(app)
const port = 8080

  const start = async () => {
    try {
      await app.listen(port, '0.0.0.0');
      console.log('API está rodando em http://localhost:8080');
    } catch (err) {
      console.error('Erro ao iniciar a API:', err);
      process.exit(1);
    }
  };

start();