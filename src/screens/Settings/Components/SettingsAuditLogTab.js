import React from 'react';
import '../Settings.scss';
import IconButton from '../../../common/IconButton/IconButton';

const SettingsAuditLogTab = () => {
  return (
    <>
      <div className="settings-title-row">
        <div className="title">Audit Logs List</div>
        <div className="buttons-row">
          <IconButton buttonType="secondary" title="filter_list" />
          <IconButton buttonType="primary" title="format_line_spacing" />
        </div>
      </div>
    </>
  );
};

export default SettingsAuditLogTab;
