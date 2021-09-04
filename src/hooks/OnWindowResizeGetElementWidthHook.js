import { useLayoutEffect, useState } from 'react';

export const useWindowResizeGetElementWidth = element => {
  const [width, setWidth] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateWidth() {
      setWidth([element?.scrollWidth, element?.offsetWidth]);
    }
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, [element]);
  return width;
};
