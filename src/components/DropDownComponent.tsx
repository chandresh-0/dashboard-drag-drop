import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
interface DropdownMenuCheckboxesProps {
  newChart: () => void;
}
interface BtnArrayItemType {
  label: string;
}
function DropdownMenuCheckboxes({ newChart }: DropdownMenuCheckboxesProps) {
  const [btnArray] = useState<BtnArrayItemType[]>([
    { label: "Add Bar" },
    { label: "Add Pie Chart" },
  ]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Add Chart</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[500px] max-w-[500px]">
        <DropdownMenuLabel>Select Chart Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-wrap">
          {btnArray.map((item: BtnArrayItemType, index: number) => (
            <DropdownMenuItem
              className="w-1/2"
              onClick={newChart}
              key={index}
            >
              <Button
                key={index}
                variant="ghost"
                className="w-full"
              >
                {item.label}
              </Button>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownMenuCheckboxes;
