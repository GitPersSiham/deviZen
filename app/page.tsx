"use client"

import Wrapper from "./components/Wrapper";
import { Layers } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createEmptyInvoice, getInvoicesByEmail } from "./actions";
import { useUser } from "@clerk/nextjs";
import confetti from "canvas-confetti"
import { Invoice } from "@/type";
import InvoiceComponent from "./components/InvoiceComopnent";




export default function Home() {
  const { user } = useUser()
  const [invoiceName, setInvoiceName] = useState("")
  const [isNameValid, setIsNameValid] = useState(true)
  const email = user?.primaryEmailAddress?.emailAddress as string
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchInvoices = useCallback(async () => {
    try {
      const data = await getInvoicesByEmail(email)
      if (data) {
        setInvoices(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
    }
  }, [email])

  useEffect(() => {
    fetchInvoices()
  }, [email, fetchInvoices])

  useEffect(() => {
    setIsNameValid(invoiceName.length <= 60)
  }, [invoiceName])

  const handleCreateInvoice = async () => {
    try {
      if (email) {
        await createEmptyInvoice(email, invoiceName)
      }
      fetchInvoices()
      setInvoiceName("")
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement
      if (modal) {
        modal.close()
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999
      })

    } catch (error) {
      console.error("Erreur lors de la création de la facture :", error);
    }
  }

  return (
    <Wrapper>
      <div className="flex flex-col space-y-4">
        <h1 className="text-lg font-bold">Mes factures</h1>

        <div className=" grid md:grid-cols-3 gap-4">
          <div className="cursor-pointer border border-primary rounded-xl flex flex-col justify-center items-center p-5"
            onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
            <div className="font-bold text-primary">
              Créer une facture
            </div>
            <div className='bg-primary/10 text-primary rounded-full p-2 mt-2'>
              <Layers className='h-6 w-6' />
            </div>
          </div>

          {invoices.length > 0 && (
            invoices.map((invoice, index) => (
              <div key={index}>
                <InvoiceComponent invoice={invoice}  />
              </div>
            ))
          )}
        </div>


        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <h3 className="font-bold text-lg">Nouvelle Facture</h3>

            <input
              type="text"
              placeholder="Nom de la facture (max 60 caractères)"
              className="input input-bordered w-full my-4"
              value={invoiceName}
              onChange={(e) => setInvoiceName(e.target.value)}
            />

            {!isNameValid && <p className="mb-4 text-sm">Le nom ne peut pas dépasser 60 caractères.</p>}

            <button
              className="btn btn-primary"
              disabled={!isNameValid || invoiceName.length === 0}
              onClick={handleCreateInvoice}
            >
              Créer
            </button>

          </div>
        </dialog>

      </div>
    </Wrapper>
  );
}