import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div>
      <span>404</span>
      <div>The page you are looking for was not found.</div>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default PageNotFound;
