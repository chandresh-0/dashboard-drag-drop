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
  newChart: (chartType: string) => void;
}
interface BtnArrayItemType {
  label: string;
  value: string;
}
function DropdownMenuCheckboxes({ newChart }: DropdownMenuCheckboxesProps) {
  const [btnArray] = useState<BtnArrayItemType[]>([
    { label: "Add Bar", value: "bar" },
    { label: "Add Pie ", value: "pie" },
    { label: "Add Line ", value: "line" },
    { label: "Add Stack Column", value: "stackColumn" },
    { label: "Add Donut", value: "donut" },
    { label: "Add Semi Donut", value: "semiDonut" },
    { label: "Add Bar Race", value: "barRace" },
    { label: "Add Heat Map", value: "heatMap" },
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
              onClick={() => newChart(item.value)}
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
