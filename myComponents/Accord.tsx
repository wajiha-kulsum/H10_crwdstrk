import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export default function ProfessionalAccord() {
    return (
      <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl shadow-lg">
        <h1 className="text-slate-800 text-4xl font-copernicusMedium mb-8 text-center">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full space-y-4">
       
        </Accordion>
      </div>
    )
  }
  