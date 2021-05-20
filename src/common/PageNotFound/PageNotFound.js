import React from 'react';
import { Link } from 'react-router-dom';
import errorImage from '../../assets/images/page-not-found.svg';
import { getAuthTokenLocalStorage } from '../../helpers/LocalStorageHelper';
import Button from '../Button/Button';

const PageNotFound = () => {
  const token = getAuthTokenLocalStorage();
  return (
    <div className="error-page-container">
      <img src={errorImage} />
      <div className="page-does-not-exist">The page you are looking for was not found.</div>
      <div className="invalid-url">
        Please check your URL or return to {token ? 'dashboard' : 'login'}.
      </div>
      <Link to="/">
        <Button
          className="button primary-button mt-20"
          title={`Back to ${token ? 'Dashboard' : 'Login'}`}
        />
      </Link>
    </div>
  );
};

export default PageNotFound;
