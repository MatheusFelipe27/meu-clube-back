import fastify from 'fastify';
import {FastifyInstance} from 'fastify'
import Processes from './processes/processes';

const app: FastifyInstance = fastify();

Processes(app)
const port = 8080

const start = async () => {
  try {
    await app.listen(port);
    console.log('API está rodando em http://localhost:8080');
  } catch (err) {
    console.error('Erro ao iniciar a API:', err);
    process.exit(1);
  }
};

start();