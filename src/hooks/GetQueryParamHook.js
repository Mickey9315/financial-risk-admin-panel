import { useLocation } from 'react-router-dom';

export const useQueryParams = () => {
  const search = new URLSearchParams(useLocation().search);
  const params = {};
  Array.from(search.entries()).forEach(([k, v]) => {
    params[`${k}`] = v;
  });

  return params;
};
