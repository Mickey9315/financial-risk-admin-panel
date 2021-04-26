import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactSelect from 'react-dropdown-select';
import './clientTabs.scss';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Pagination from '../../../common/Pagination/Pagination';
import Table from '../../../common/Table/Table';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import {
  changeClientDocumentsColumnListStatus,
  deleteClientDocumentAction,
  downloadDocuments,
  getClientDocumentsColumnNamesList,
  getClientDocumentsListData,
  getDocumentTypeList,
  saveClientDocumentsColumnListName,
  uploadDocument,
} from '../redux/ClientAction';
import { errorNotification } from '../../../common/Toast';
import Modal from '../../../common/Modal/Modal';
import Switch from '../../../common/Switch/Switch';
import Input from '../../../common/Input/Input';
import FileUpload from '../../../common/Header/component/FileUpload';
import { downloadAll } from '../../../helpers/DownloadHelper';

const initialClientDocumentState = {
  description: '',
  fileData: '',
  isPublic: false,
  documentType: [],
};

const CLIENT_DOCUMENT_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  UPDATE_SINGLE_DATA: 'UPDATE_SINGLE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function clientDocumentReducer(state, action) {
  switch (action.type) {
    case CLIENT_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case CLIENT_DOCUMENT_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };
    case CLIENT_DOCUMENT_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialClientDocumentState };
    default:
      return state;
  }
}
const ClientDocumentsTab = () => {
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );
  const [selectedClientDocument, dispatchSelectedClientDocument] = useReducer(
    clientDocumentReducer,
    initialClientDocumentState
  );
  const { documentType, isPublic, description } = useMemo(() => selectedClientDocument, [
    selectedClientDocument,
  ]);
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();

  const [uploadModel, setUploadModel] = useState(false);
  const [selectedCheckBoxData, setSelectedCheckBoxData] = useState([]);
  const [pageLimit, setPageLimit] = useState('');
  const toggleUploadModel = useCallback(
    value => setUploadModel(value !== undefined ? value : e => !e),

    [setUploadModel]
  );
  const [fileData, setFileData] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );
  const [deleteDocumentData, setDeleteDocumentData] = useState('');

  const onchangeDocumentDescription = useCallback(e => {
    dispatchSelectedClientDocument({
      type: CLIENT_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
      name: e.target.name,
      value: e.target.value,
    });
  }, []);

  const onChangeDocumentSwitch = useCallback(e => {
    dispatchSelectedClientDocument({
      type: CLIENT_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
      name: e.target.name,
      value: e.target.checked,
    });
  }, []);

  const clientDocumentsList = useSelector(
    ({ clientManagement }) => clientManagement.documents.documentsList
  );
  const documentTypeList = useSelector(
    ({ clientManagement }) => clientManagement?.documents?.documentTypeList
  );
  const clientDocumentsColumnList = useSelector(
    ({ clientManagement }) => clientManagement.documents.columnList
  );
  const { total, pages, page, limit, docs, headers } = useMemo(() => clientDocumentsList, [
    clientDocumentsList,
  ]);

  const { defaultFields, customFields } = useMemo(
    () => clientDocumentsColumnList || { defaultFields: [], customFields: [] },
    [clientDocumentsColumnList]
  );

  const documentTypeOptions = useMemo(() => {
    const finalData = documentTypeList;
    return finalData?.map(e => ({
      name: 'documentType',
      label: e.documentTitle,
      value: e._id,
    }));
  }, [documentTypeList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientDocumentsColumnListName({ isReset: true }));
    dispatch(getClientDocumentsListData(id));
    toggleCustomField();
  }, [dispatch, toggleCustomField]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveClientDocumentsColumnListName({ clientDocumentsColumnList }));
      dispatch(getClientDocumentsListData(id, { limit: pageLimit }));
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [dispatch, toggleCustomField, clientDocumentsColumnList]);

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleCustomField() },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [onClickResetDefaultColumnSelection, toggleCustomField, onClickSaveColumnSelection]
  );
  const getClientDocumentsList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getClientDocumentsListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const onClickUploadDocument = useCallback(async () => {
    if (selectedClientDocument.documentType.length === 0) {
      errorNotification('Please select document type');
    } else if (!selectedClientDocument.description) {
      errorNotification('Description is required');
    } else if (!fileData) {
      errorNotification('Select document to upload');
    } else {
      const formData = new FormData();
      formData.append('description', selectedClientDocument.description);
      formData.append('isPublic', selectedClientDocument.isPublic);
      formData.append('documentType', selectedClientDocument.documentType);
      formData.append('document', fileData);
      formData.append('entityId', id);
      formData.append('documentFor', 'client');
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      await dispatch(uploadDocument(formData, config));
      dispatchSelectedClientDocument({
        type: CLIENT_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
      });
      getClientDocumentsList();
      setFileData('');
      toggleUploadModel();
    }
  }, [
    selectedClientDocument,
    fileData,
    setFileData,
    dispatchSelectedClientDocument,
    toggleUploadModel,
  ]);

  const onUploadClick = useCallback(
    e => {
      // e.persist();
      if (e.target.files && e.target.files.length > 0) {
        const fileExtension = [
          'jpeg',
          'jpg',
          'png',
          'bmp',
          'gif',
          'tex',
          'xls',
          'xlsx',
          'doc',
          'docx',
          'odt',
          'txt',
          'pdf',
          'png',
          'pptx',
          'ppt',
          'rtf',
        ];
        const mimeType = [
          'image/jpeg',
          'image/png',
          'application/pdf',
          'image/bmp',
          'image/gif',
          'application/x-tex',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.oasis.opendocument.text',
          'text/plain',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.ms-powerpoint',
          'application/rtf',
        ];
        const checkExtension =
          fileExtension.indexOf(e.target.files[0].name.split('.').splice(-1)[0]) !== -1;
        const checkMimeTypes = mimeType.indexOf(e.target.files[0].type) !== -1;
        const checkFileSize = e.target.files[0].size > 4194304;

        if (!(checkExtension || checkMimeTypes)) {
          errorNotification('Only image and document type files are allowed');
        } else if (checkFileSize) {
          errorNotification('File size should be less than 4 mb');
        } else {
          setFileData(e.target.files[0]);
        }
      }
    },
    [setFileData]
  );

  const onCloseUploadDocumentButton = useCallback(() => {
    dispatchSelectedClientDocument({
      type: CLIENT_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
    });
    setFileData('');
    toggleUploadModel();
  }, [toggleUploadModel, dispatchSelectedClientDocument, setFileData]);

  const uploadDocumentButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseUploadDocumentButton },
      { title: 'Upload', buttonType: 'primary', onClick: onClickUploadDocument },
    ],
    [onCloseUploadDocumentButton, onClickUploadDocument]
  );
  const deleteDocument = useCallback(
    data => {
      // console.log(data);
      setDeleteDocumentData(data);
      setShowConfirmModal(true);
    },
    [showConfirmModal]
  );
  const deleteDocumentAction = useMemo(
    () => [
      data => (
        <span
          className="material-icons-round font-danger cursor-pointer"
          onClick={() => deleteDocument(data)}
        >
          delete_outline
        </span>
      ),
    ],
    [deleteDocument]
  );
  const callBack = () => {
    toggleConfirmationModal();
    getClientDocumentsList();
  };

  const deleteDocumentButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(deleteClientDocumentAction(deleteDocumentData.id, () => callBack()));
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, deleteDocumentData]
  );

  const onClickDownloadButton = useCallback(async () => {
    if (clientDocumentsList.docs.length !== 0) {
      if (selectedCheckBoxData.length !== 0) {
        const docsToDownload = selectedCheckBoxData.map(e => e.id);
        const res = await downloadDocuments(docsToDownload);
        downloadAll(res);
      } else {
        errorNotification('Please select at least one document to download');
      }
    } else {
      errorNotification('You have no documents to download');
    }
  }, [clientDocumentsList, selectedCheckBoxData]);
  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeClientDocumentsColumnListStatus(data));
    },
    [dispatch]
  );

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (searchKeyword.trim().toString().length === 0 && e.key !== 'Enter') {
      getClientDocumentsList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getClientDocumentsList({ search: searchKeyword.trim().toString() });
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const pageActionClick = useCallback(
    newPage => {
      getClientDocumentsList({ page: newPage, limit });
    },
    [limit, getClientDocumentsList]
  );
  const onSelectLimit = useCallback(
    newLimit => {
      setPageLimit(newLimit);
      getClientDocumentsList({ page: 1, limit: newLimit });
    },
    [getClientDocumentsList]
  );
  useEffect(() => {
    getClientDocumentsList();
    dispatch(getClientDocumentsColumnNamesList());
    dispatch(getDocumentTypeList());
  }, []);

  const handleDocumentChange = useCallback(
    newValue => {
      dispatchSelectedClientDocument({
        type: CLIENT_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: newValue[0].name,
        value: newValue[0].value,
      });
    },
    [dispatchSelectedClientDocument]
  );

  return (
    <>
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
      <div className="tab-content-header-row">
        <div className="tab-content-header">Documents</div>
        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            onKeyUp={checkIfEnterKeyPressed}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={() => toggleCustomField()}
          />
          <IconButton
            buttonType="primary"
            title="cloud_upload"
            onClick={() => toggleUploadModel()}
          />
          <IconButton
            buttonType="primary-1"
            title="cloud_download"
            onClick={onClickDownloadButton}
          />
        </div>
      </div>
      {docs ? (
        <>
          <div className="tab-table-container">
            <Table
              align="left"
              valign="center"
              data={docs}
              headers={headers}
              tableClass="white-header-table"
              extraColumns={deleteDocumentAction}
              refreshData={getClientDocumentsList}
              showCheckbox
              onChangeRowSelection={data => setSelectedCheckBoxData(data)}
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
        <Loader />
      )}
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={buttons}
          toggleCustomField={toggleCustomField}
        />
      )}
      {uploadModel && (
        <Modal
          header="Upload Documents"
          className="upload-document-modal"
          buttons={uploadDocumentButton}
          hideModal={toggleUploadModel}
        >
          <div className="document-upload-popup-container">
            <span>Document Type</span>
            <ReactSelect
              placeholder="Select"
              options={documentTypeOptions}
              value={documentType}
              onChange={handleDocumentChange}
              searchable={false}
            />
            <span>Please upload your documents here</span>
            <FileUpload
              isProfile={false}
              fileName={fileData.name || 'Browse'}
              handleChange={onUploadClick}
            />
            <span>Description</span>
            <Input
              prefixClass="font-placeholder"
              placeholder="Document description"
              name="description"
              type="text"
              value={description}
              onChange={onchangeDocumentDescription}
            />
            <span>Private/Public</span>
            <Switch
              id="document-type"
              name="isPublic"
              checked={isPublic}
              onChange={onChangeDocumentSwitch}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ClientDocumentsTab;
