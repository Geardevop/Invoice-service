import { error } from "console"
import { InvoicModelInterface } from "../models/interface/invoice.i.model"
import { InvoiceModel } from "../models/invoiceModel"


export const SaveInvoiceData =  async (invoiceData:InvoicModelInterface) =>{
    const createdInvoice = await InvoiceModel.create(invoiceData)
    return createdInvoice
}

export const FindInvoices= (): Promise<InvoicModelInterface[]>=>{
    return new Promise((resolve, reject) => {
        InvoiceModel.find()
            .then(invoices => {
                resolve(invoices);
            })
            .catch(error => {
                reject(error);
            });
    });

}
