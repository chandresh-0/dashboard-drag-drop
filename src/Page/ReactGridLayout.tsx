import PageLayout from "../components/PageLayout";
// import "./styles.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = ({
  children,
  layouts,
}: {
  children: any;
  layouts: any;
}) => {
  return <PageLayout layouts={layouts}>{children}</PageLayout>;
};

export default ReactGridLayout;
