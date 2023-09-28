import {Document } from 'mongoose';

export interface InvoicModelInterface extends Document{
    customerDetails: string,
    order:String,
    created_at: { type: Date}
    cost:String
}

