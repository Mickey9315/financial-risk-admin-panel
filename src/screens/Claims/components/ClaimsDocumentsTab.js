import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Pagination from '../../../common/Pagination/Pagination';
import Table from '../../../common/Table/Table';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import Modal from '../../../common/Modal/Modal';
import Input from '../../../common/Input/Input';
import FileUpload from '../../../common/Header/component/FileUpload';
import {
  downloadDocumentFromServer,
  getClaimsDocumentsListData,
  uploadClaimDocument,
} from '../redux/ClaimsAction';
import { downloadAll } from '../../../helpers/DownloadHelper';

const initialClaimDocumentState = {
  description: '',
  fileData: {},
};

const CLAIMS_DOCUMENT_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  UPDATE_SINGLE_DATA: 'UPDATE_SINGLE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function claimsDocumentReducer(state, action) {
  switch (action.type) {
    case CLAIMS_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case CLAIMS_DOCUMENT_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };
    case CLAIMS_DOCUMENT_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialClaimDocumentState };
    default:
      return state;
  }
}
const ClaimsDocumentsTab = () => {
  const [selectedClaimsDocument, dispatchSelectedClaimsDocument] = useReducer(
    claimsDocumentReducer,
    initialClaimDocumentState
  );
  const { description, fileData } = useMemo(
    () => selectedClaimsDocument ?? {},
    [selectedClaimsDocument]
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();

  const [uploadModel, setUploadModel] = useState(false);
  const [fileExtensionErrorMessage, setFileExtensionErrorMessage] = useState(false);

  const toggleUploadModel = useCallback(
    value => setUploadModel(value !== undefined ? value : e => !e),

    [setUploadModel]
  );

  const onChangeDocumentUploadData = useCallback((name, value) => {
    dispatchSelectedClaimsDocument({
      type: CLAIMS_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
      name,
      value,
    });
  }, []);

  const { documentList } = useSelector(({ claims }) => claims?.documents ?? {});

  const { viewClaimUploadDocumentButtonLoaderAction, viewClaimDownloadDocumentButtonLoaderAction } =
    useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, pages, page, limit, docs, headers, isLoading } = useMemo(
    () => documentList ?? {},
    [documentList]
  );

  const getClaimsDocumentsList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getClaimsDocumentsListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const onClickUploadDocument = useCallback(async () => {
    setFileExtensionErrorMessage(false);
    if (!fileData) {
      errorNotification('Select document to upload');
    } else {
      const formData = new FormData();
      formData.append('description', selectedClaimsDocument?.description);
      formData.append('document', fileData);
      formData.append('parentId', id);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      try {
        await dispatch(uploadClaimDocument(formData, config));
        dispatchSelectedClaimsDocument({
          type: CLAIMS_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
        });
        getClaimsDocumentsList();
        toggleUploadModel();
      } catch (e) {
        /**/
      }
    }
  }, [selectedClaimsDocument, fileData, toggleUploadModel, id]);

  const onUploadClick = useCallback(e => {
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
        'csv',
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
        'text,csv',
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
      const checkFileSize = e.target.files[0].size > 10485760;
      if (!(checkExtension || checkMimeTypes)) {
        setFileExtensionErrorMessage(true);
      } else if (checkFileSize) {
        setFileExtensionErrorMessage(false);
        errorNotification('File size should be less than 10MB.');
      } else {
        setFileExtensionErrorMessage(false);
        onChangeDocumentUploadData('fileData', e.target.files[0]);
      }
    }
  }, []);

  const onCloseUploadDocumentButton = useCallback(() => {
    setFileExtensionErrorMessage(false);
    dispatchSelectedClaimsDocument({
      type: CLAIMS_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleUploadModel();
  }, [toggleUploadModel, dispatchSelectedClaimsDocument]);

  const uploadDocumentButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseUploadDocumentButton },
      {
        title: 'Upload',
        buttonType: 'primary',
        onClick: onClickUploadDocument,
        isLoading: viewClaimUploadDocumentButtonLoaderAction,
      },
    ],
    [onCloseUploadDocumentButton, onClickUploadDocument, viewClaimUploadDocumentButtonLoaderAction]
  );

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getClaimsDocumentsList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getClaimsDocumentsList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  const pageActionClick = useCallback(
    newPage => {
      getClaimsDocumentsList({ page: newPage, limit });
    },
    [limit, getClaimsDocumentsList]
  );
  const onSelectLimit = useCallback(
    newLimit => {
      getClaimsDocumentsList({ page: 1, limit: newLimit });
    },
    [getClaimsDocumentsList]
  );

  const downloadClaimDocument = useCallback(async docId => {
    const response = await downloadDocumentFromServer(docId);
    try {
      if (response) downloadAll(response);
    } catch (e) {
      /**/
    }
  }, []);

  const downloadDocument = useMemo(
    () => [
      data => (
        <span
          className="material-icons-round font-primary cursor-pointer"
          onClick={async e => {
            e.stopPropagation();
            if (!viewClaimDownloadDocumentButtonLoaderAction) await downloadClaimDocument(data?.id);
          }}
        >
          cloud_download
        </span>
      ),
    ],
    [viewClaimDownloadDocumentButtonLoaderAction]
  );

  useEffect(() => {
    getClaimsDocumentsList();
  }, [id]);

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
            title="cloud_upload"
            onClick={() => toggleUploadModel()}
          />
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!isLoading && docs ? (
        docs.length > 0 ? (
          <>
            <div className="tab-table-container">
              <Table
                align="left"
                valign="center"
                data={docs}
                headers={headers}
                tableClass="white-header-table"
                refreshData={getClaimsDocumentsList}
                extraColumns={downloadDocument}
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
        )
      ) : (
        <Loader />
      )}
      {uploadModel && (
        <Modal
          header="Upload Documents"
          className="upload-document-modal"
          buttons={uploadDocumentButton}
          hideModal={toggleUploadModel}
        >
          <div className="document-upload-popup-container">
            <span>Please upload your document here</span>
            <div>
              <FileUpload
                isProfile={false}
                fileName={fileData.name ?? 'Browse...'}
                handleChange={onUploadClick}
              />
              {fileExtensionErrorMessage && (
                <div className="ui-state-error">
                  Only jpeg, jpg, png, bmp, gif, tex, xls, xlsx, csv, doc, docx, odt, txt, pdf, png,
                  pptx, ppt or rtf file types are accepted
                </div>
              )}
            </div>
            <span>Description</span>
            <Input
              prefixClass="font-placeholder"
              placeholder="Document description"
              name="description"
              type="text"
              value={description}
              onChange={e => onChangeDocumentUploadData(e?.target?.name, e?.target?.value)}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ClaimsDocumentsTab;
