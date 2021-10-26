import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '../../../common/Button/Button';
import Modal from '../../../common/Modal/Modal';
import Input from '../../../common/Input/Input';
import {
  addNewSettingDocType,
  deleteSettingDocumentType,
  getDocumentTypeDetailsById,
  getSettingDocumentTypeList,
  resetAddDocType,
  resetPageData,
  resetSettingTabsData,
  updateDocumentFieldStatus,
  updateSettingDocType,
} from '../redux/SettingAction';
import Table from '../../../common/Table/Table';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import Pagination from '../../../common/Pagination/Pagination';
import { errorNotification } from '../../../common/Toast';
import Loader from '../../../common/Loader/Loader';
import Select from '../../../common/Select/Select';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

const documentForOptions = [
  { label: 'Application', value: 'application', name: 'documentFor' },
  { label: 'Client', value: 'client', name: 'documentFor' },
  { label: 'Debtor', value: 'debtor', name: 'documentFor' },
];

const SettingsDocumentTypeTab = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [openAddDocModal, setOpenAddModal] = useState(false);
  const hasSettingsUpdateRight = useModulePrivileges(SIDEBAR_NAMES.SETTINGS).hasWriteAccess;
  const hasDocumentUpdateRight = useModulePrivileges('document').hasWriteAccess;

  const isSettingsDocumentUpdatable = hasSettingsUpdateRight && hasDocumentUpdateRight;
  const toggleAddDocModal = useCallback(
    value => setOpenAddModal(value !== undefined ? value : e => !e),
    [setOpenAddModal]
  );

  const [openEditDocModal, setOpenEditModal] = useState(false);
  const toggleEditDocModal = useCallback(
    value => setOpenEditModal(value !== undefined ? value : e => !e),
    [setOpenEditModal]
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const documentTypeListData = useSelector(
    ({ settingReducer }) => settingReducer?.documentType ?? {}
  );
  const documentTypeAddData = useSelector(
    ({ settingReducer }) => settingReducer?.addDocumentType ?? {}
  );

  const {
    settingAddNewDocumentTypeButtonLoaderAction,
    settingUpdateDocumentTypeButtonLoaderAction,
    settingDeleteDocumentTypeButtonLoaderAction,
    settingDocumentListLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, pages, page, limit, docs, headers } = useMemo(
    () => documentTypeListData ?? {},
    [documentTypeListData]
  );
  const { documentTitle, documentFor } = useMemo(
    () => documentTypeAddData ?? {},
    [documentTypeAddData]
  );

  const [docId, setDocId] = useState(null);

  const getSettingDocumentTypeListByFilter = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getSettingDocumentTypeList(data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getSettingDocumentTypeListByFilter({ page: 1, limit: newLimit });
    },
    [getSettingDocumentTypeListByFilter]
  );

  const pageActionClick = useCallback(
    newPage => {
      getSettingDocumentTypeListByFilter({ page: newPage, limit });
    },
    [dispatch, limit, getSettingDocumentTypeListByFilter]
  );

  const updateDocumentFields = useCallback((name, value) => {
    dispatch(updateDocumentFieldStatus(name, value));
  }, []);

  const handleDocumentTypeChange = useCallback(
    e => {
      updateDocumentFields('documentTitle', e?.target?.value ?? '');
    },
    [updateDocumentFields]
  );

  const handleDocumentForChange = useCallback(
    data => {
      updateDocumentFields(data?.name ?? '', data);
    },
    [updateDocumentFields]
  );

  const callBackOnAdd = useCallback(() => {
    if (openEditDocModal) {
      toggleEditDocModal();
    }
    if (openAddDocModal) {
      toggleAddDocModal();
    }
    getSettingDocumentTypeListByFilter();
  }, [
    toggleAddDocModal,
    toggleEditDocModal,
    getSettingDocumentTypeListByFilter,
    openEditDocModal,
    openAddDocModal,
  ]);
  const callBack = useCallback(() => {
    toggleConfirmationModal();
    getSettingDocumentTypeListByFilter();
  }, [toggleConfirmationModal, getSettingDocumentTypeListByFilter]);

  const addNewDocumentType = useCallback(() => {
    if (!documentTitle || (documentTitle?.trim()?.length ?? -1) < 0) {
      errorNotification('Enter Document Type');
    }
    if (!documentFor || !documentFor?.value) {
      errorNotification('Enter Document For');
    } else {
      try {
        if (openEditDocModal) {
          dispatch(
            updateSettingDocType(
              docId,
              { documentTitle, documentFor: documentFor?.value ?? '' },
              () => callBackOnAdd()
            )
          );
        } else {
          dispatch(
            addNewSettingDocType({ documentTitle, documentFor: documentFor?.value ?? '' }, () =>
              callBackOnAdd()
            )
          );
        }
      } catch {
        /**/
      }
    }
  }, [documentFor, documentTitle, callBackOnAdd]);

const closeAddDocumentType = () => {
  toggleAddDocModal();
  dispatch(resetAddDocType())
}

  const deleteDocument = useCallback(
    data => {
      setDocId(data);
      setShowConfirmModal(true);
    },
    [showConfirmModal]
  );

  const addDocButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: closeAddDocumentType,
      },
      {
        title: 'Add',
        buttonType: 'primary',
        onClick: addNewDocumentType,
        isLoading: settingAddNewDocumentTypeButtonLoaderAction,
      },
    ],
    [toggleAddDocModal, addNewDocumentType, settingAddNewDocumentTypeButtonLoaderAction]
  );

  const editDocButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => toggleEditDocModal(),
      },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: addNewDocumentType,
        isLoading: settingUpdateDocumentTypeButtonLoaderAction,
      },
    ],
    [toggleEditDocModal, addNewDocumentType, settingUpdateDocumentTypeButtonLoaderAction]
  );

  const deleteDocumentButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(deleteSettingDocumentType(docId, () => callBack()));
          } catch (e) {
            /**/
          }
        },
        isLoading: settingDeleteDocumentTypeButtonLoaderAction,
      },
    ],
    [toggleConfirmationModal, docId, settingDeleteDocumentTypeButtonLoaderAction]
  );

  const recordActionClick = useCallback(
    (type, data) => {
      if (type === 'EDIT_ROW') {
        dispatch(getDocumentTypeDetailsById(data));
        toggleEditDocModal();
        setDocId(data);
      }
      if (type === 'DELETE_ROW') {
        deleteDocument(data);
      }
    },
    [toggleEditDocModal, setDocId, deleteDocument]
  );

  const { page: paramPage, limit: paramLimit } = useQueryParams();

  useEffect(() => {
    const params = {
      page: paramPage ?? 1,
      limit: paramLimit ?? 15,
    };

    getSettingDocumentTypeListByFilter(params);
  }, []);

  useEffect(() => {
    const params = {
      page: page ?? 1,
      limit: limit ?? 15,
    };
    const url = Object.entries(params)
      ?.filter(arr => arr[1] !== undefined)
      ?.map(([k, v]) => `${k}=${v}`)
      ?.join('&');

    history.replace(`${history?.location?.pathname}?${url}`);
  }, [history, total, pages, page, limit]);

  useEffect(() => {
    return () => {
      dispatch(resetPageData());
      dispatch(resetSettingTabsData());
    };
  }, []);

  return (
    <>
      {!settingDocumentListLoader ? (
        <>
          <div className="settings-title-row">
            <div className="title">Document Type List</div>
            {isSettingsDocumentUpdatable && (
              <Button buttonType="success" title="Add" onClick={toggleAddDocModal} />
            )}
          </div>
          {docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  tableClass="main-list-table"
                  data={docs}
                  headers={headers}
                  haveActions
                  recordActionClick={recordActionClick}
                />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                pageActionClick={pageActionClick}
                onSelectLimit={onSelectLimit}
              />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          )}
        </>
      ) : (
        <Loader />
      )}

      {(openAddDocModal || openEditDocModal) && (
        <Modal
          header={openEditDocModal ? 'Edit Document Type' : 'Add Document Type'}
          buttons={openEditDocModal ? editDocButtons : addDocButtons}
          className="add-document-modal"
          hideModal={toggleAddDocModal}
        >
          <div className="add-document-modal-body">
            <span>Document Type</span>
            <Input
              type="text"
              placeholder="Enter document type"
              value={documentTitle}
              onChange={handleDocumentTypeChange}
            />
            <span>Document For</span>
            <Select
              placeholder="Select"
              name="Document For"
              searchable={false}
              options={documentForOptions}
              value={documentFor}
              onChange={handleDocumentForChange}
            />
          </div>
        </Modal>
      )}
      {showConfirmModal && (
        <Modal
          header="Delete User"
          buttons={deleteDocumentButtons}
          hideModal={toggleConfirmationModal}
        >
          <span className="confirmation-message">
            Are you sure you want to delete this document?
          </span>
        </Modal>
      )}
    </>
  );
};

export default SettingsDocumentTypeTab;
