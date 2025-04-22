import { Invoice, Totals } from '@/type'
import confetti from 'canvas-confetti'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import { ArrowDownFromLine, Layers } from 'lucide-react'
import React, { useRef } from 'react'

interface FacturePDFProps {
    invoice: Invoice
    totals: Totals
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

const InvoicePDF: React.FC<FacturePDFProps> = ({ invoice, totals }) => {

    const factureRef = useRef<HTMLDivElement>(null)


    const handleDownloadPdf = async () => {
        const element = factureRef.current
        if (element) {
            try {
                const canvas = await html2canvas(element, { 
                    scale: 3, 
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false
                })
                const imgData = canvas.toDataURL('image/png')

                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "A4"
                })

                const pdfWidth = pdf.internal.pageSize.getWidth()
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
                pdf.save(`facture-${invoice.name}.pdf`)

                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    zIndex: 9999
                })

            } catch (error) {
                console.error('Erreur lors de la génération du PDF :', error);
            }
        }
    }

    return (
        <div className='mt-4 hidden lg:block'>
            <div className='border-base-300 border-2 border-dashed rounded-xl p-5 bg-base-200'>

                <button
                    onClick={handleDownloadPdf}
                    className='btn btn-primary btn-sm mb4'>
                    Facture PDF
                    <ArrowDownFromLine className="w-4" />
                </button>

                <div className='p-8 bg-base-100' ref={factureRef}>
                    <div className='flex justify-between items-center text-sm'>
                        <div className='flex flex-col'>
                            <div>
                                <div className='flex items-center'>
                                    <div className='bg-primary/10 text-primary rounded-full p-2'>
                                        <Layers className='h-6 w-6' />
                                    </div>
                                    <div className='ml-3 font-bold text-2xl flex'>
                                        <span className='text-primary'>Devis</span>
                                        <span className='text-base-content ml-1'>Zen</span>
                                    </div>
                                </div>
                            </div>
                            <h1 className='text-7xl font-bold uppercase text-base-content'>Facture</h1>
                        </div>
                        <div className='text-right uppercase'>
                            <p className='badge badge-ghost text-base-content'>
                                Facture ° {invoice.id}
                            </p>
                            <p className='my-2 text-base-content'>
                                <strong>Date </strong>
                                {formatDate(invoice.invoiceDate)}
                            </p>
                            <p className='text-base-content'>
                                <strong>Date d'échéance </strong>
                                {formatDate(invoice.dueDate)}
                            </p>
                        </div>
                    </div>

                    <div className='my-6 flex justify-between'>
                        <div>
                            <p className='badge badge-ghost mb-2 text-base-content'>Émetteur</p>
                            <p className='text-sm font-bold text-base-content'>{invoice.issuerName}</p>
                            <p className='text-sm text-base-content/80 w-52 break-words'>{invoice.issuerAddress}</p>
                        </div>
                        <div className='text-right'>
                            <p className='badge badge-ghost mb-2 text-base-content'>Client</p>
                            <p className='text-sm font-bold text-base-content'>{invoice.clientName}</p>
                            <p className='text-sm text-base-content/80 w-52 break-words'>{invoice.clientAddress}</p>
                        </div>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='table'>
                            <thead>
                                <tr className='bg-base-200'>
                                    <th className='text-base-content'></th>
                                    <th className='text-base-content'>Description</th>
                                    <th className='text-base-content'>Quantité</th>
                                    <th className='text-base-content'>Prix Unitaire</th>
                                    <th className='text-base-content'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.lines.map((ligne, index) => (
                                    <tr key={index + 1} className='hover:bg-base-200'>
                                        <td className='text-base-content'>{index + 1}</td>
                                        <td className='text-base-content'>{ligne.description}</td>
                                        <td className='text-base-content'>{ligne.quantity}</td>
                                        <td className='text-base-content'>{ligne.unitPrice.toFixed(2)} €</td>
                                        <td className='text-base-content'>{(ligne.quantity * ligne.unitPrice).toFixed(2)} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='mt-6 space-y-2 text-md'>
                        <div className='flex justify-between'>
                            <div className='font-bold text-base-content'>
                                Total Hors Taxes
                            </div>
                            <div className='text-base-content'>
                                {totals.totalHT.toFixed(2)} €
                            </div>
                        </div>

                        {invoice.vatActive && (
                            <div className='flex justify-between'>
                                <div className='font-bold text-base-content'>
                                    TVA {invoice.vatRate} %
                                </div>
                                <div className='text-base-content'>
                                    {totals.totalVAT.toFixed(2)} €
                                </div>
                            </div>
                        )}

                        <div className='flex justify-between'>
                            <div className='font-bold text-base-content'>
                                Total Toutes Taxes Comprises
                            </div>
                            <div className='badge badge-primary text-base-content'>
                                {totals.totalTTC.toFixed(2)} €
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoicePDF