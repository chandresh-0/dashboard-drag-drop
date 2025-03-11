/**
 * Generates a responsive grid layout for different screen sizes
 *
 * @param {number} count - Number of items to generate
 * @param {string} chartType - The type of chart to use for all items
 * @return {Object} Object with layouts for different breakpoints
 */
export function generateResponsiveGridLayout(
  count: number,
  chartType: string,
  id: string,
) {
  const generateGrid = (cols: number, rowHeight: number) => {
    const layout = [];
    let x = 0,
      y = 0;

    for (let i = 1; i <= count; i++) {
      layout.push({ i: id, x, y, w: 4, h: 3, chartType });
      x += 4;
      if (x > cols) {
        x = 0;
        y += rowHeight;
      }
    }
    return layout;
  };

  const generateTwoColumnGrid = () => {
    const layout = [];
    let x = 0,
      y = 0;

    for (let i = 1; i <= count; i++) {
      layout.push({ i: id, x, y, w: 4, h: 3, chartType });
      x = x === 0 ? 4 : 0;
      if (i % 2 === 0) y += 2;
    }
    return layout;
  };

  const generateStackedGrid = (width = 2) => {
    const layout = [];
    let y = 0;

    for (let i = 1; i <= count; i++) {
      let h = i % 2 === 1 ? 3 : 2;
      layout.push({ i: id, x: 0, y, w: width, h, chartType });
      y += h;
    }
    return layout;
  };

  return {
    xxl: generateGrid(12, 4),
    xl: generateGrid(12, 4),
    lg: generateTwoColumnGrid(),
    md: generateStackedGrid(3).slice(0, count),
    sm: generateStackedGrid(4),
    xs: generateStackedGrid(2),
  };
}
