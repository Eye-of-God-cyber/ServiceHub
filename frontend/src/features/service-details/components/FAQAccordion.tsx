import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import type { ServiceFAQ } from "../mock/serviceDetailsData";

interface FAQAccordionProps {
  faqs: ServiceFAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border rounded-2xl p-6 md:p-8">
      <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
        <HelpCircle className="h-6 w-6 text-primary" /> Frequently Asked Questions
      </h3>
      <Accordion className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className={index === faqs.length - 1 ? "border-b-0" : ""}>
            <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
