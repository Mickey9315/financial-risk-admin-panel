import React, { useCallback } from 'react';
import './ForbiddenAccessPage.scss';
import { useHistory } from 'react-router-dom';
import Button from '../Button/Button';

const ForbiddenAccessPage = () => {
  const history = useHistory();

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div>
      Forbidden Access
      <Button buttonType="primary" title="Go Back" onClick={goBack} />
    </div>
  );
};

export default ForbiddenAccessPage;
