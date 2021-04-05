import React from 'react';

import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';

const DebtorsOverduesTab = () => {
  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Overdues</div>
        <div className="buttons-row">
          <BigInput
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
          />
          <IconButton buttonType="primary" title="format_line_spacing" />
        </div>
      </div>
    </>
  );
};

export default DebtorsOverduesTab;
