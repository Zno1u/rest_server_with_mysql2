import express from 'express';
import { pool, testConnection } from './conf/dbConnection';
import routes from './routes';

export class Server {
    public app: express.Application;
    public port: number | string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.app.use(express.json());
        this.app.use('/api/v1/products', routes);
        this.app.use((req, res) => {
            res.status(404).json({ message: 'Ruta no encontrada' });
        });
    }
    
    async listen() {
        await testConnection();

        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto: ${this.port}`);
        });
    }

    async close() {
        await pool.end();
    }
}