import { Invoice } from '@/type';
import React from 'react';

interface Props {
  invoice : Invoice ;
  setInvoice :(invoice :Invoice ) => void;
}

const VATControl : React.FC<Props> = ({invoice, setInvoice}) => {

  const handleVATChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   setInvoice({...invoice,
     vatActive: e.target.checked,
    vatRate: e.target.checked ? invoice.vatRate : 0,
    });

  }
  const handleVATRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   
    setInvoice({...invoice, vatRate: parseFloat(e.target.value)})
     
 
   }
  return (
    <div className="flex items-center">
      <label className="block
      text-sm font-medium text-white-700">
        TVA (%)
      </label>
        <input 
          type="checkbox" 
          className="toggle toggle-sm ml-2"  
          checked={invoice?.vatActive}
          onChange={handleVATChange}
        />
        {invoice?.vatActive && (
          <div className="ml-4">
    <input type="number" className="input input-sm input-bordered w-16 ml-2" 
    value={invoice.vatRate}
    onChange={handleVATRateChange}
    />
  </div>
)}
    </div>
  )
}

export default VATControl;