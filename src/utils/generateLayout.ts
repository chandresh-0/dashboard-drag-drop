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
    xxl: [{ i: id, x: 0, y: 0, w: 4, h: 3, chartType }],
    xl: [{ i: id, x: 0, y: 0, w: 4, h: 3, chartType }],
    lg: [{ i: id, x: 0, y: 0, w: 4, h: 3, chartType }],
    md: [{ i: id, x: 0, y: 0, w: 3, h: 3, chartType }],
    sm: [{ i: id, x: 0, y: 0, w: 4, h: 3, chartType }],
    xs: [{ i: id, x: 0, y: 0, w: 2, h: 3, chartType }],
  };
};
