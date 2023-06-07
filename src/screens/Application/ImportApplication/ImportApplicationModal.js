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
import { useQueryParams } from '../../../hooks/GetQueryParamHook';

const ImportApplicationModal = () => {
  const dispatch = useDispatch();
  const { importApplication } = useSelector(({ application }) => application ?? {});
  const { applicationListFilters } = useSelector(
    ({ listFilterReducer }) => listFilterReducer ?? {}
  );
  const activeStep = useMemo(() => importApplication?.activeStep ?? 0, [importApplication]);
  const importId = useMemo(() => importApplication?.importId ?? null, [importApplication]);

  const {
    page: paramPage,
    limit: paramLimit,
    entityType: paramEntityType,
    status: paramStatus,
    minCreditLimit: paramMinCreditLimit,
    maxCreditLimit: paramMaxCreditLimit,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

  const [importApplicationModal, setImportApplicationModal] = useState(false);
  const toggleImportApplicationModal = useCallback(() => {
    setImportApplicationModal(e => !e);
  }, []);
  const oncancelImportApplicationModal = useCallback(() => {
    const params = {
      page: paramPage ?? 1,
      limit: paramLimit ?? 15,
    };
    const filters = {
      entityType:
        (paramEntityType?.trim()?.length ?? -1) > 0
          ? paramEntityType
          : applicationListFilters?.entityType ?? undefined,
      clientId: applicationListFilters?.clientId,
      debtorId: applicationListFilters?.debtorId,

      status:
        (paramStatus?.trim()?.length ?? -1) > 0 ? paramStatus : applicationListFilters?.status,
      minCreditLimit:
        (paramMinCreditLimit?.trim()?.length ?? -1) > 0
          ? paramMinCreditLimit
          : applicationListFilters?.minCreditLimit,
      maxCreditLimit:
        (paramMaxCreditLimit?.trim()?.length ?? -1) > 0
          ? paramMaxCreditLimit
          : applicationListFilters?.maxCreditLimit,
      startDate: paramStartDate || applicationListFilters?.startDate,
      endDate: paramEndDate || applicationListFilters?.endDate,
    };

    if (activeStep >= 2 && activeStep <= 4) dispatch(deleteDumpFromBackend(importId));

    if (activeStep === 4) dispatch(getApplicationsListByFilter({ ...params, ...filters }));
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
