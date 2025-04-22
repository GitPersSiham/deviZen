"use client"
import Wrapper from "./components/Wrapper";
import { Plus } from "lucide-react";
import { Layers, FileText } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await getInvoicesByEmail(email)
      if (data) {
        setInvoices(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [email])

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
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Mes Factures</h1>
            <p className="text-base-content/70 mt-2">Gérez et créez vos factures en toute simplicité</p>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
          >
            <Plus className="w-4 mr-2" />
            Nouvelle Facture
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center p-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            invoices.map((invoice, index) => (
              <div key={index}>
                <InvoiceComponent invoice={invoice} />
              </div>
            ))
          )}
        </div>

        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4">Nouvelle Facture</h3>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base-content">Nom de la facture</span>
                <span className="label-text-alt text-base-content/70">{invoiceName.length}/60</span>
              </label>
              <input
                type="text"
                placeholder="Entrez le nom de votre facture"
                className="input input-bordered w-full"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
              />
              {!isNameValid && (
                <label className="label">
                  <span className="label-text-alt text-error">Le nom ne peut pas dépasser 60 caractères</span>
                </label>
              )}
            </div>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                disabled={!isNameValid || invoiceName.length === 0}
                onClick={handleCreateInvoice}
              >
                Créer
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </Wrapper>
  );
}