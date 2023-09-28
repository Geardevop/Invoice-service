import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import { SaveInvoiceData, FindInvoices } from './service/invoice.service';
import { InvoiceModel } from './models/invoiceModel';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGOOSE_URI as string
const dbName = process.env.DB_NAME as string
mongoose.connect(mongoURI,{
  dbName: dbName,
  },
)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('Connected to MongoDB :' +db.name);
});
app.use(express.json())
app.get('/', async (req: Request, res: Response) => {
  res.send('Invoice Server');
});
app.post('/createInvoice', async (req:Request, res:Response)=>{
  const { customerDetails, order, created_at, cost} = req.body
  const invoice = new InvoiceModel({
    customerDetails, order, created_at, cost
  })
  const resCreatedInvoice  = await SaveInvoiceData(invoice)
  res.status(201).send(resCreatedInvoice)
})

app.get("/getAllInvoice", async (req: Request, res: Response) => {
  const resInvoice = await FindInvoices()
  res.status(201).send(resInvoice)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});