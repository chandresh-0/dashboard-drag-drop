import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function EditDatatable() {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="edit-dashboard">Edit Dashboard</Label>
      <Switch id="edit-dashboard" className="custom-switch h-4 w-7" />
    </div>
  )
}
