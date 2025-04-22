import { Invoice } from '@/type';
import React from 'react';
import VATControl from './VATControl';

interface Props {
  invoice: Invoice | null;
  setInvoice: (invoice: Invoice) => void;
}

const defaultInvoice: Invoice = {
  id: '',
  name: '',
  issuerName: '',
  issuerAddress: '',
  clientName: '',
  clientAddress: '',
  invoiceDate: '',
  dueDate: '',
  vatActive: false,
  vatRate: 20,
  status: 1,
  lines: [],
  userId: ''
};

const InvoiceInfo: React.FC<Props> = ({
  invoice = defaultInvoice,
  setInvoice
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (invoice) {
      setInvoice({...invoice, [name]: value});
    }
  };

  if (!invoice) {
    return null;
  }

  console.log('Invoice details:', JSON.stringify(invoice, null, 2));

  return (
    <div className="flex flex-col h-fit bg-base-200 p-5 rounded-xl mb-4 md:mb-0
    ">
      <div className="space-y-4">
        <h2 className='badge badge-primary'>Emétteur</h2>
        <input 
          className='input input-bordered w-full resize-none' 
          type="text" 
          name="issuerName"
          value={invoice.issuerName} 
          onChange={handleInputChange}
          placeholder="Nom de l'entreprise émitrice"
          required
        />  
        <textarea 
          className='textarea textarea-bordered w-full resize-none h-40'
          name="issuerAddress"
          value={invoice.issuerAddress}
          placeholder="Adresse de l'entreprise émitrice"
          onChange={handleInputChange}
          aria-rowcount={5}
          required
        ></textarea>
        <h2 className='badge badge-primary'>Client</h2>
        <input 
          className='input input-bordered w-full resize-none' 
          type="text" 
          name="clientName"
          value={invoice.clientName} 
          onChange={handleInputChange}
          placeholder="Nom de l'entreprise cliente"
          required
        />  
        <textarea 
          className='textarea textarea-bordered w-full resize-none h-40'
          name="clientAddress"
          value={invoice.clientAddress}
          placeholder="Adresse de l'entreprise cliente"
          onChange={handleInputChange}
          aria-rowcount={5}
          required
        ></textarea>
        <h2 className='badge badge-primary'>Date de la facture</h2>
        <input 
          className='input input-bordered w-full resize-none' 
          type="date" 
          name="invoiceDate"
          value={invoice.invoiceDate} 
          onChange={handleInputChange}
          required
        />  
        <h2 className='badge badge-primary'>Date d'échéance</h2>
        <input 
          className='input input-bordered w-full resize-none' 
          type="date" 
          name="dueDate"
          value={invoice.dueDate} 
          onChange={handleInputChange}
          required
        /> 

      </div>
    </div>
  );
}

export default InvoiceInfo;
