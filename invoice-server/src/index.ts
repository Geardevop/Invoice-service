import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import { SaveInvoiceData, FindInvoices } from './service/invoice.service';
import { InvoiceModel } from './models/invoiceModel';
import specs from './swagger';
import { setup, serve } from 'swagger-ui-express';
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
/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       required:
 *         - customerDetails
 *         - order
 *         - created_at
 *         - cost
 *       properties:
 *         customerDetails:
 *           type: string
 *           description: Customer details
 *         order:
 *           type: string
 *           description: Order details
 *         cost:
 *           type: string
 *           description: Cost of the order
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the invoice was created
 *       example:
 *         customerDetails: "gear"
 *         order: "Sample Order"
 *         cost: "100.00"
 *         created_at: "2023-09-29T12:00:00.000Z"
 */

  
app.use('/api-docs', serve, setup(specs ,{ explorer: true }));

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
/**
 * @swagger
 * tags:
 *  name: Invoice
 *  description: managing API
 * /getAllInvoice:
 *   get:
 *     summary: Get all invoices
 *     description: Retrieve a list of all invoices.
 *     responses:
 *       '200':
 *         description: A list of invoices.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Invoice'
 * /createInvoice:
 *   post:
 *     summary: return invoice that create and save in mongoDB
 *     description: Retrieve invoice.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerDetails:
 *                 type: string
 *                 description: Customer details
 *               order:
 *                 type: string
 *                 description: Order details
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time the invoice was created
 *               cost:
 *                 type: string
 *                 description: Cost of the order
 *             required:
 *               - customerDetails
 *               - order
 *               - created_at
 *               - cost
 *     responses:
 *       '201':
 *         description: The created invoice.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice' 
 */
app.get("/getAllInvoice", async (req: Request, res: Response) => {
  const resInvoice = await FindInvoices()
  res.status(201).send(resInvoice)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});