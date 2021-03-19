import React, { useState, useCallback } from 'react';
import '../Settings.scss';
import ReactSelect from 'react-dropdown-select';
import Button from '../../../common/Button/Button';
import Modal from '../../../common/Modal/Modal';
import Input from '../../../common/Input/Input';

const SettingsDocumentTypeTab = () => {
  const [openAddDocModal, setOpenAddModal] = useState(false);
  const toggleAddDocModal = useCallback(
    value => setOpenAddModal(value !== undefined ? value : e => !e),
    [setOpenAddModal]
  );
  const addDocButtons = [
    {
      title: 'Close',
      buttonType: 'primary-1',
      onClick: toggleAddDocModal,
    },
    {
      title: 'Add',
      buttonType: 'primary',
    },
  ];
  return (
    <>
      <div className="settings-title-row">
        <div className="title">Document Type List</div>
        <Button buttonType="success" title="Add" onClick={toggleAddDocModal} />
      </div>
      {openAddDocModal && (
        <Modal
          header="Add Document Type"
          buttons={addDocButtons}
          className="add-document-modal"
          hideModal={toggleAddDocModal}
        >
          <div className="add-document-modal-body">
            <span>Document Type</span>
            <Input type="text" placeholder="Enter document type" />
            <span>Document For</span>
            <ReactSelect placeholder="Select" name="Document For" searchable={false} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default SettingsDocumentTypeTab;
