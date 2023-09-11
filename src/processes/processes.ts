import {FastifyInstance} from 'fastify'


interface ProcessesProps{
    type: string
    name: string
    details?: string[]
}

const allProcesses: ProcessesProps[] = [];


export default function Processes(fastify: FastifyInstance){

    fastify.post('/processos', async (req, res  )=> {
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
    
    fastify.get('/processos', async (req, res) => {
        try {
            res.status(200).send(allProcesses);
        } 
        catch (error) {
            res.status(500).send({ error: 'Erro interno do servidor.' });
        }
      });
    
    fastify.put<{ Params: { id: string } }>('/processos/:id', async (req, res) => {
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
    fastify.delete<{ Params: { id: string } }>('/processos/:id', async (req, res) => {
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

    //REFERENTE A SUBPROCESSOS

    fastify.post<{ Params: { id: string }, Body: { detail: string } }>('/processos/:id/detalhes', async (req, res) => {
        try {
            const id = Number(req.params.id);
            const { detail } = req.body;

            if (isNaN(id) || id < 0 || id >= allProcesses.length || !detail) {
                res.status(400).send({ error: 'ID não encontrado ou detalhe inválido.' });
                return;
            }

            allProcesses[id].details?.push(detail);

            res.status(201).send(allProcesses[id]);
        } catch (error) {
            res.status(500).send({ error: 'Erro interno do servidor.' });
        }
    });

    fastify.delete<{ Params: { id: string, detailIndex: string } }>('/processos/:id/detalhes/:detailIndex', async (req, res) => {
        try {
            const id = Number(req.params.id);
            const detailIndex = Number(req.params.detailIndex);

            if (isNaN(id) || id < 0 || id >= allProcesses.length || isNaN(detailIndex) || detailIndex < 0 || detailIndex >= allProcesses[id].details.length) {
                res.status(400).send({ error: 'ID ou índice de detalhe inválido.' });
                return;
            }

            const removedDetail = allProcesses[id].details?.splice(detailIndex, 1);
            res.status(200).send(removedDetail);
        } catch (error) {
            res.status(500).send({ error: 'Erro interno do servidor.' });
        }
    });

    fastify.put<{ Params: { id: string, detailIndex: string }, Body: { detail: string } }>('/processos/:id/detalhes/:detailIndex', async (req, res) => {
        try {
            const id = Number(req.params.id);
            const detailIndex = Number(req.params.detailIndex);
            const { detail } = req.body;
    
            if (isNaN(id) || id < 0 || id >= allProcesses.length || isNaN(detailIndex) || detailIndex < 0 || !detail) {
                res.status(400).send({ error: 'ID, índice de detalhe ou detalhe inválido.' });
                return;
            }
    
            const processToUpdate = allProcesses[id];
    
            if (!processToUpdate.details) {
                processToUpdate.details = [];
            }
    
            processToUpdate.details[detailIndex] = detail;
    
            res.status(200).send(processToUpdate);
        } catch (error) {
            res.status(500).send({ error: 'Erro interno do servidor.' });
        }
    });
    
}