import fastify from 'fastify';
const app = fastify();

const port = 8080

interface ProcessesProps{
    type: string
    name: string
    details?: string[]
}

const allProcesses: ProcessesProps[] = [];


app.post('/processos', async (req, res  )=> {
    try{
        const {type, name} : ProcessesProps = req.body as ProcessesProps
        
        if(!type || !name){
            res.status(400).send({error: 'erro ao criar processo'})
            return
        }

        const newProcess = {
            type: type,
            name: name,
            details: []
        }

        allProcesses.push(newProcess);
        res.status(201).send(newProcess);
    }
    catch(error){
        res.status(500).send({error:'Erro interno'})
    }
});

app.get('/processos', async (req, res) => {
    try {
        res.status(200).send(allProcesses);
    } 
    catch (error) {
        res.status(500).send({ error: 'Erro interno do servidor.' });
    }
  });

app.put<{ Params: { id: string } }>('/processos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { type, name }: ProcessesProps = req.body as ProcessesProps;

        if (!type || !name || isNaN(id) || id < 0 || id >= allProcesses.length) {
            res.status(400).send({ error: 'Campos inválidos ou ID não encontrado.' });
            return;
        }
        allProcesses[id] = {
            type,
            name,
            details: [],
        };

        res.status(200).send(allProcesses[id]);
    } catch (error) {
        res.status(500).send({ error: 'Erro interno do servidor.' });
    }
});

// Rota DELETE para excluir um processo por ID
app.delete<{ Params: { id: string } }>('/processos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id) || id < 0 || id >= allProcesses.length) {
            res.status(400).send({ error: 'ID não encontrado.' });
            return;
        }

        const deletedProcess = allProcesses.splice(id, 1);

        res.status(200).send(deletedProcess);
    } catch (error) {
        res.status(500).send({ error: 'Erro interno do servidor.' });
    }
});



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
