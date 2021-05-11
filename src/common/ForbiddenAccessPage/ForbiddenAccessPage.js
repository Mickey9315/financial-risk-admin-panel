import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../Button/Button';

const ForbiddenAccessPage = () => {
  const history = useHistory();

  const goBack = useCallback(() => {
    history.replace('/dashboard');
  }, [history]);

  return (
    <div className="forbidden-access-container">
      Forbidden Access
      <Button buttonType="primary" title="Go Back" onClick={goBack} />
    </div>
  );
};

export default ForbiddenAccessPage;
