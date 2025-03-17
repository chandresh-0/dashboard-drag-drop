/**
 * Generates a responsive grid layout for different screen sizes
 *
 * @param {number} count - Number of items to generate
 * @param {string} chartType - The type of chart to use for all items
 * @return {Object} Object with layouts for different breakpoints
 */
export const generateResponsiveGridLayout = (
  index: number,
  chartType: string,
  id: string,
) => {
  return {
    xxl: [{ i: id, x: 0, y: 0, w: 4, h: 3, chartType, minW: 2, minH: 2 }],
    xl: [{ i: id, x: 0, y: 0, w: 4, h: 3, chartType, minW: 2, minH: 2 }],
    lg: [{ i: id, x: 0, y: 0, w: 4, h: 3, chartType, minW: 2, minH: 2 }],
    md: [{ i: id, x: 0, y: 0, w: 3, h: 3, chartType, minW: 2, minH: 2 }],
    sm: [{ i: id, x: 0, y: 0, w: 4, h: 3, chartType, minW: 2, minH: 2 }],
    xs: [{ i: id, x: 0, y: 0, w: 2, h: 3, chartType, minW: 2, minH: 2 }],
  };
};
