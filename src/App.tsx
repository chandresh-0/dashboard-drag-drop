import "react-resizable/css/styles.css";
import { BarComponent } from "./Charts/Bar";
import { PieComponent } from "./Charts/Pie";
import ReactGridLayout from "./Page/ReactGridLayout";
import DropdownMenuCheckboxes from "./components/DropDownComponent";
import { DashboardHeader } from "./components/DashboardHeader";
import { EditDatatable } from "./components/DatatableEditSwitch";
function App() {
  const layoutsKeys = ["l1", "m1", "m2", "r1", "l2", "m3", "r2"];
  const generateRandomVariableName = () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 10); // 0 to 9
    return `${randomLetter}${randomNumber}`;
  };
  const newTickets = () => {
    const newVariableName = generateRandomVariableName();
    layoutsKeys.push(newVariableName);
  };
  return (
    <>
      <DashboardHeader></DashboardHeader>
      <EditDatatable></EditDatatable>
      <DropdownMenuCheckboxes newChart={newTickets} />
      <ReactGridLayout>
        {layoutsKeys.map((id, index) => (
          <div
            key={id}
            className="border hover:cursor-move p-5 "
          >
            {id == "l1" ? <BarComponent /> : <PieComponent />}
          </div>
        ))}
      </ReactGridLayout>
    </>
  );
}

export default App;
