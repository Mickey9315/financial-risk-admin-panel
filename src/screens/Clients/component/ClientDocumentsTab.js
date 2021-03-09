import React, { useCallback, useEffect, useState, useMemo, useReducer, useRef } from 'react';
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

  const [uploadModel, setUploadModel] = useState(false);
  const [selectedCheckBoxData, setSelectedCheckBoxData] = useState([]);
  const toggleUploadModel = useCallback(
    value => setUploadModel(value !== undefined ? value : e => !e),

    [setUploadModel]
  );
  const [fileData, setFileData] = useState('');

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

  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();

  const clientDocumentsList = useSelector(
    ({ clientManagement }) => clientManagement.documents.documentsList
  );

  const documentTypeList = useSelector(
    ({ clientManagement }) => clientManagement.documents.documentTypeList
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
    const finalData = documentTypeList.docs;
    return finalData.map(e => ({
      name: 'documentType',
      label: e.documentTitle,
      value: e._id,
    }));
  }, [documentTypeList.docs]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientDocumentsColumnListName({ isReset: true }));
    dispatch(getClientDocumentsListData(id));
    toggleCustomField();
  }, [dispatch, toggleCustomField]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveClientDocumentsColumnListName({ clientDocumentsColumnList }));
      dispatch(getClientDocumentsListData(id));
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
  }, [selectedClientDocument, fileData, dispatchSelectedClientDocument, toggleUploadModel]);

  const onUploadClick = e => {
    e.persist();
    const file = e.target.files[0];
    setFileData(file);
  };

  const onCloseUploadDocumentButton = useCallback(() => {
    dispatchSelectedClientDocument({
      type: CLIENT_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleUploadModel();
  }, [toggleUploadModel, dispatchSelectedClientDocument]);

  const uploadDocumentButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => onCloseUploadDocumentButton() },
      { title: 'Upload', buttonType: 'primary', onClick: onClickUploadDocument },
    ],
    [onCloseUploadDocumentButton, onClickUploadDocument]
  );

  const onClickDownloadButton = () => {
    if (selectedCheckBoxData.length !== 0) {
      const docsToDownload = selectedCheckBoxData.map(e => e.id);
      dispatch(downloadDocuments(docsToDownload));
    } else {
      errorNotification('Please select at least one document to download');
    }
  };
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
          <div className="common-list-container">
            <Table
              align="left"
              valign="center"
              data={docs}
              headers={headers}
              // recordActionClick={onSelectUserRecordActionClick}
              refreshData={getClientDocumentsList}
              haveActions
              showCheckbox
              onChageRowSelection={data => {
                console.log(310, { data });
                setSelectedCheckBoxData(data);
              }}
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
        />
      )}
      {uploadModel && (
        <Modal
          header="Upload Documents"
          className="upload-document-modal"
          buttons={uploadDocumentButton}
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
              className="document-upload-input"
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
