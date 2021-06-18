import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

export const useUrlParamsUpdate = params => {
  const history = useHistory();

  const dependencies = useMemo(() => Object.values(params), [params]);

  useEffect(() => {
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    history.replace(`${history?.location?.pathname}?${url}`);
  }, [history, ...dependencies]);
};
