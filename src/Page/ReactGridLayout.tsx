import PageLayout from "../components/PageLayout";
// import "./styles.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface ReactGridLayoutProps {
  children: React.ReactNode;
  layouts: any;
  onLayoutChange?: (layout: any, layouts: any) => void;
}

const ReactGridLayout = ({
  children,
  layouts,
  onLayoutChange,
}: ReactGridLayoutProps) => {
  return (
    <PageLayout
      layouts={layouts}
      onLayoutChange={onLayoutChange}
      className="w-screen h-screen"
    >
      {children}
    </PageLayout>
  );
};

export default ReactGridLayout;
