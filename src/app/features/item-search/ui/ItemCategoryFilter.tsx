import { ITEM_CATEGORY_MAP } from "@/shared/config/constants";
import { Button } from "@/shared/ui/button";

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function ItemCategoryFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(ITEM_CATEGORY_MAP).map(([key, label]) => (
        <Button
          key={key}
          variant={value === key ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(value === key ? null : key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
