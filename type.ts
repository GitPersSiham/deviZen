import { Invoice as PrismaInvoice } from "@prisma/client";
import { InvoiceLine } from "@prisma/client";

export interface Invoice extends PrismaInvoice {
  id: string;
  status: number;
  lines: InvoiceLine[];
}

export interface Totals {
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
}
