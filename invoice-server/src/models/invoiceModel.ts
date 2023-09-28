import { InvoicModelInterface } from "./interface/invoice.i.model";
import {Model, model, Schema} from "mongoose"

const invoiceSchema = new Schema<InvoicModelInterface>({
    customerDetails:String,
    order:String,
    created_at:{type:Date},
    cost:String,
})

export const InvoiceModel: Model<InvoicModelInterface> = model<InvoicModelInterface>('Invoice', invoiceSchema);
    