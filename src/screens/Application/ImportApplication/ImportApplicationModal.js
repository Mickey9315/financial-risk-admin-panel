import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../common/IconButton/IconButton';
import Modal from '../../../common/Modal/Modal';
import ImportApplicationStepper from './ImportApplicationStepper';
import {
  deleteDumpFromBackend,
  getApplicationsListByFilter,
  resetImportApplicationStepper,
} from '../redux/ApplicationAction';

const ImportApplicationModal = () => {
  const dispatch = useDispatch();
  const { importApplication } = useSelector(({ application }) => application ?? {});
  const activeStep = useMemo(() => importApplication?.activeStep ?? 0, [importApplication]);
  const importId = useMemo(() => importApplication?.importId ?? null, [importApplication]);

  const [importApplicationModal, setImportApplicationModal] = useState(false);
  const toggleImportApplicationModal = useCallback(() => {
    setImportApplicationModal(e => !e);
  }, []);
  const oncancelImportApplicationModal = useCallback(() => {
    if (activeStep >= 2 && activeStep <= 4) dispatch(deleteDumpFromBackend(importId));
    if (activeStep === 4) dispatch(getApplicationsListByFilter());
    dispatch(resetImportApplicationStepper());
    toggleImportApplicationModal();
  }, [activeStep, importId]);

  return (
    <>
      <IconButton
        buttonType="primary"
        title="cloud_upload"
        className="mr-10"
        buttonTitle="Click to upload applications"
        onClick={toggleImportApplicationModal}
      />
      {importApplicationModal && (
        <Modal
          header="Import Applications"
          className="import-application-modal"
          hideModal={toggleImportApplicationModal}
        >
          <ImportApplicationStepper
            oncancelImportApplicationModal={oncancelImportApplicationModal}
          />
        </Modal>
      )}
    </>
  );
};

export default ImportApplicationModal;
