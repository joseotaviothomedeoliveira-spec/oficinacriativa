import { Check } from "lucide-react";

interface ProductBenefitsProps {
  benefits: string[];
}

const ProductBenefits = ({ benefits }: ProductBenefitsProps) => {
  return (
    <div className="space-y-2.5">
      <h3 className="text-base font-semibold text-foreground">O que voce recebe</h3>
      <ul className="space-y-2">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductBenefits;
