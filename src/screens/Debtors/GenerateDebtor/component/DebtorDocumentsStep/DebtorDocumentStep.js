import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'rc-tooltip';
import Input from '../../../../../common/Input/Input';
import IconButton from '../../../../../common/IconButton/IconButton';
import Modal from '../../../../../common/Modal/Modal';
import FileUpload from '../../../../../common/Header/component/FileUpload';
import Switch from '../../../../../common/Switch/Switch';
import {
  deleteDebtorDocumentAction,
  getDebtorDocumentDataList,
  getDocumentTypeList,
  uploadDocument,
} from '../../../redux/DebtorsAction';
import { errorNotification } from '../../../../../common/Toast';
import Select from '../../../../../common/Select/Select';

const initialDebtorDocumentState = {
  description: '',
  fileData: '',
  isPublic: false,
  documentType: [],
};
const DEBTOR_DOCUMENT_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  UPDATE_SINGLE_DATA: 'UPDATE_SINGLE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function debtorDocumentReducer(state, action) {
  switch (action.type) {
    case DEBTOR_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case DEBTOR_DOCUMENT_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };
    case DEBTOR_DOCUMENT_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialDebtorDocumentState };
    default:
      return state;
  }
}

const DebtorDocumentStep = () => {
  const { documentTypeList, uploadDocumentDebtorData } = useSelector(
    ({ debtorsManagement }) => debtorsManagement.editDebtor?.documents
  );
  const documentData = useMemo(
    () => uploadDocumentDebtorData,
    [uploadDocumentDebtorData]
  );

  const dispatch = useDispatch();
  const [fileData, setFileData] = useState('');

  const [debtorDocId, setDebtorDocId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );
  const [selectedDebtorDocuments, dispatchSelectedDebtorDocuments] = useReducer(
    debtorDocumentReducer,
    initialDebtorDocumentState
  );

  const { documentType, description, isPublic } = useMemo(
    () => selectedDebtorDocuments,
    [selectedDebtorDocuments]
  );

  const {
    viewDebtorUploadDocumentButtonLoaderAction,
    viewDebtorDeleteDocumentButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const [uploadModel, setUploadModel] = useState(false);
  const [fileExtensionErrorMessage, setFileExtensionErrorMessage] = useState(false);
  const toggleUploadModel = useCallback(
    value => setUploadModel(value !== undefined ? value : e => !e),

    [setUploadModel]
  );

  const documentTypeOptions = useMemo(() => {
    const finalData = documentTypeList ?? [];
    
    try{
      return finalData.map(e => ({
        name: 'documentType',
        label: e.documentTitle,
        value: e._id,
      }));
    }catch(ex) {
      return finalData?.docs.map(e => ({
        name: 'documentType',
        label: e.documentTitle,
        value: e._id,
      }));
    }
  }, [documentTypeList]);

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
          'debtor/pdf',
          'image/bmp',
          'image/gif',
          'text/csv',
          'debtor/x-tex',
          'debtor/vnd.ms-excel',
          'debtor/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'debtor/msword',
          'debtor/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'debtor/vnd.oasis.opendocument.text',
          'text/plain',
          'debtor/vnd.openxmlformats-officedocument.presentationml.presentation',
          'debtor/vnd.ms-powerpoint',
          'debtor/rtf',
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
          setFileData(e.target.files[0]);
          setFileExtensionErrorMessage(false);
          dispatchSelectedDebtorDocuments({
            type: DEBTOR_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
            name: 'fileData',
            value: e.target.files[0],
          });
        }
      }
    },
    [setFileData]
  );

  const onCloseUploadDocumentButton = useCallback(() => {
    setFileExtensionErrorMessage(false);
    dispatchSelectedDebtorDocuments({
      type: DEBTOR_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
    });
    setFileData('');
    toggleUploadModel();
  }, [toggleUploadModel, dispatchSelectedDebtorDocuments]);

  const editDebtor = useSelector(({ debtorsManagement }) => debtorsManagement.editDebtor);
  useEffect(() => {
    if (editDebtor && editDebtor._id) {
      dispatch(getDebtorDocumentDataList(editDebtor._id));
    }
  }, [editDebtor._id]);

  const onClickUploadDocument = useCallback(async () => {
    setFileExtensionErrorMessage(false);
    if (selectedDebtorDocuments?.documentType?.length <= 0) {
      errorNotification('Please select document type');
    } else if (!fileData) {
      errorNotification('Select document to upload');
    } else {
      const formData = new FormData();
      formData.append('description', selectedDebtorDocuments.description);
      formData.append('isPublic', selectedDebtorDocuments.isPublic);
      formData.append('documentType', selectedDebtorDocuments.documentType.value);
      formData.append('document', selectedDebtorDocuments.fileData);
      formData.append('entityId', editDebtor?._id);
      formData.append('documentFor', 'debtor');
      try {
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };
        await dispatch(uploadDocument(formData, config));
      dispatchSelectedDebtorDocuments({
          type: DEBTOR_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
        });
      getDebtorDocumentDataList();
      setFileData('');
      toggleUploadModel();
      } catch (e) {
        /**/
      }
    }
  }, [
    selectedDebtorDocuments,
    fileData,
    dispatchSelectedDebtorDocuments,
    toggleUploadModel,
    editDebtor?.id,
    setFileData,
  ]);

  const uploadDocumentButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => onCloseUploadDocumentButton() },
      {
        title: 'Upload',
        buttonType: 'primary',
        onClick: onClickUploadDocument,
        isLoading: viewDebtorUploadDocumentButtonLoaderAction,
      },
    ],
    [
      onCloseUploadDocumentButton,
      onClickUploadDocument,
      viewDebtorUploadDocumentButtonLoaderAction,
    ]
  );

  useEffect(() => {
    dispatch(getDocumentTypeList());
  }, []);

  const handleDocumentChange = useCallback(
    newValue => {
      dispatchSelectedDebtorDocuments({
        type: DEBTOR_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: newValue.name,
        value: newValue,
      });
    },
    [dispatchSelectedDebtorDocuments]
  );
  const onchangeDocumentDescription = useCallback(
    e => {
      dispatchSelectedDebtorDocuments({
        type: DEBTOR_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: e.target.name,
        value: e.target.value,
      });
    },
    [dispatchSelectedDebtorDocuments]
  );
  const onChangeDocumentSwitch = useCallback(
    e => {
      dispatchSelectedDebtorDocuments({
        type: DEBTOR_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: e.target.name,
        value: e.target.checked,
      });
    },
    [dispatchSelectedDebtorDocuments]
  );

  const callBack = useCallback(() => {
    toggleConfirmationModal();
    dispatch(getDebtorDocumentDataList(editDebtor._id));
  }, [editDebtor._id]);

  const deleteDocumentButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(deleteDebtorDocumentAction(debtorDocId, callBack));
          } catch (e) {
            /**/
          }
        },
        isLoading: viewDebtorDeleteDocumentButtonLoaderAction,
      },
    ],
    [toggleConfirmationModal, debtorDocId, viewDebtorDeleteDocumentButtonLoaderAction]
  );

  const deleteDebtorDocument = useCallback(
    docId => {
      setDebtorDocId(docId);
      setShowConfirmModal(true);
    },
    [showConfirmModal]
  );

  return (
    <>
      {showConfirmModal && (
        <Modal
          header="Delete Document"
          buttons={deleteDocumentButtons}
          hideModal={toggleConfirmationModal}
        >
          <span className="confirmation-message">
            Are you sure you want to delete this document?
          </span>
        </Modal>
      )}
      <div className="font-secondary f-14 mb-10">Upload Documents</div>
      <div className="upload-document-row d-flex align-center">
        <span className="font-primary mr-15">Upload your documents here</span>
        <IconButton buttonType="primary" title="cloud_upload" onClick={() => toggleUploadModel()} />
      </div>
      {documentData?.length > 0 && (
        <table className="documents-table">
          <tbody>
            <tr>
              <th align="left">Document Type</th>
              <th align="left">Description</th>
              <th />
            </tr>
            {documentData?.map((document) => (
              <tr>
                <td>
                  {document?.documentTypeId?.length > 50 ? (
                    <Tooltip
                      mouseEnterDelay={0.5}
                      overlayClassName="tooltip-top-class"
                      overlay={<span>{document.documentTypeId}</span>}
                      placement="top"
                    >
                      <span>{document.documentTypeId}</span>
                    </Tooltip>
                  ) : (
                    <span>{document.documentTypeId}</span>
                  )}
                </td>
                <td>
                  {document?.description?.length > 50 ? (
                    <Tooltip
                      overlayClassName="tooltip-top-class"
                      overlay={<span>{document.description}</span>}
                      placement="top"
                    >
                      <span>{document.description ?? '-'}</span>
                    </Tooltip>
                  ) : (
                    <span>{document.description ?? '-'}</span>
                  )}
                </td>
                <td align="right">
                  <span
                    className="material-icons-round font-danger cursor-pointer"
                    onClick={() => deleteDebtorDocument(document?._id)}
                  >
                    delete_outline
                  </span>{' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <Select
              placeholder="Select"
              options={documentTypeOptions}
              value={documentType}
              onChange={handleDocumentChange}
              isSearchable
            />
            <span>Please upload your documents here</span>
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
              onChange={onchangeDocumentDescription}
            />
            <span>Is Public</span>
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

export default DebtorDocumentStep;
