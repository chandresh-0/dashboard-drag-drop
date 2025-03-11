import { useState, useEffect, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

interface Tab {
  name: string;
  id: string;
  value: string;
}

interface ScrollableTabsProps {
  scrollableTabs: Tab[];
  getActiveTab: (tab: Tab) => void;
}

const Tabs: React.FC<ScrollableTabsProps> = ({
  scrollableTabs,
  getActiveTab,
}) => {
  const defaultTabs: Tab[] = [{ name: "All", id: "None", value: "all" }];
  const tabs = useMemo(
    () => (scrollableTabs.length > 0 ? scrollableTabs : defaultTabs),
    [scrollableTabs],
  );

  // const location = useLocation();
  // const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // useEffect(() => {
  //   const urlTab = new URLSearchParams(location.search).get("tabs");
  //   if (urlTab) {
  //     const formattedTab = urlTab.replace(/-/g, "_");
  //     const index = tabs.findIndex((tab) => tab.value === formattedTab);
  //     if (index !== -1) setActiveIndex(index);
  //   }
  // }, [location.search, tabs]);

  const handleTabClick = (
    event: React.MouseEvent<HTMLDivElement>,
    tab: Tab,
    index: number,
  ) => {
    if (event.ctrlKey) {
      const formattedTab = tab.value.replace(/_/g, "-");
      const newUrl = `${location.pathname}?tabs=${formattedTab}`;
      window.open(newUrl, "_blank");
      return;
    }
    setActiveIndex(index);
    if (tab.id !== "None") {
      getActiveTab(tab);
    }
  };

  return (
    <div className="tabs-container overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="tabs-parent flex  font-interMedium">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            onClick={(event) => handleTabClick(event, tab, index)}
            className={`cursor-pointer pb-[10px] relative hover:bg-[#ededed] dark:hover:bg-[#494949] m-[4px] pt-[12px] px-[14px] rounded-lg ${
              activeIndex === index
                ? "text-light-1200 dark:text-dark-800 font-medium"
                : "text-light-1200 dark:text-dark-800"
            }`}
          >
            {tab.name}
            {activeIndex === index && (
              <div className="absolute left-1/2 bottom-0 w-[80%] h-[3px] bg-[#1279ff] rounded-t-md transform -translate-x-1/2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

/* CSS (in a separate file or inline)
.tabs-container {
  font-size: 13px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
