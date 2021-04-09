import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import './ApplicationDocumentStep.scss';
import ReactSelect from 'react-dropdown-select';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../common/Input/Input';
import IconButton from '../../../../../common/IconButton/IconButton';
import Modal from '../../../../../common/Modal/Modal';
import FileUpload from '../../../../../common/Header/component/FileUpload';
import Switch from '../../../../../common/Switch/Switch';
import {
  deleteApplicationDocumentAction,
  getApplicationDocumentDataList,
  getDocumentTypeList,
  uploadDocument,
} from '../../../redux/ApplicationAction';
import { errorNotification } from '../../../../../common/Toast';

const initialApplicationDocumentState = {
  description: '',
  fileData: '',
  isPublic: false,
  documentType: [],
};
const APPLICATION_DOCUMENT_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  UPDATE_SINGLE_DATA: 'UPDATE_SINGLE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function applicationDocumentReducer(state, action) {
  switch (action.type) {
    case APPLICATION_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case APPLICATION_DOCUMENT_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };
    case APPLICATION_DOCUMENT_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialApplicationDocumentState };
    default:
      return state;
  }
}

const ApplicationDocumentStep = () => {
  /* const documents = [
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
  ]; */
  const { documentTypeList, uploadDocumentApplicationData } = useSelector(
    ({ application }) => application.editApplication.documentStep
  );
  const documentData = useMemo(() => uploadDocumentApplicationData, [
    uploadDocumentApplicationData,
  ]);

  const dispatch = useDispatch();
  const [fileData, setFileData] = useState('');

  const [applicationDocId, setApplicationDocId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  /* const documentTypeList = useSelector(
    ({ application }) => application.editApplication.documentStep.documentTypeList
  );
*/
  const [selectedApplicationDocuments, dispatchSelectedApplicationDocuments] = useReducer(
    applicationDocumentReducer,
    initialApplicationDocumentState
  );

  const { documentType, description, isPublic } = useMemo(() => selectedApplicationDocuments, [
    selectedApplicationDocuments,
  ]);

  const [uploadModel, setUploadModel] = useState(false);
  const toggleUploadModel = useCallback(
    value => setUploadModel(value !== undefined ? value : e => !e),

    [setUploadModel]
  );

  const documentTypeOptions = useMemo(() => {
    const finalData = documentTypeList.docs;
    return finalData.map(e => ({
      name: 'documentType',
      label: e.documentTitle,
      value: e._id,
    }));
  }, [documentTypeList.docs]);

  const onUploadClick = e => {
    e.persist();
    if (e.target.files && e.target.files.length > 0) {
      const fileExtension = ['jpeg', 'jpg', 'png'];
      const mimeType = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
      ];
      const checkExtension =
        fileExtension.indexOf(e.target.files[0].name.split('.').splice(-1)[0]) !== -1;
      const checkMimeTypes = mimeType.indexOf(e.target.files[0].type) !== -1;
      if (!(checkExtension || checkMimeTypes)) {
        errorNotification('Only image and document types file allowed');
        setFileData('');
      }
      const checkFileSize = e.target.files[0].size > 4194304;
      if (checkFileSize) {
        errorNotification('File size should be less than 4 mb');
      } else {
        setFileData(e.target.files[0]);
        dispatchSelectedApplicationDocuments({
          type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
          name: 'fileData',
          value: e.target.files[0],
        });
      }
    }
  };

  const onCloseUploadDocumentButton = useCallback(() => {
    dispatchSelectedApplicationDocuments({
      type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
    });
    setFileData('');
    toggleUploadModel();
  }, [toggleUploadModel, dispatchSelectedApplicationDocuments]);

  const editApplication = useSelector(({ application }) => application.editApplication);
  // console.log('editApplication', editApplication.applicationId);
  useEffect(() => {
    if (editApplication && editApplication.applicationId) {
      dispatch(getApplicationDocumentDataList(editApplication.applicationId));
    }
  }, [editApplication.applicationId]);

  const onClickUploadDocument = useCallback(async () => {
    if (selectedApplicationDocuments.documentType.length === 0) {
      errorNotification('Please select document type');
    } else if (!selectedApplicationDocuments.fileData) {
      errorNotification('Please select any document');
    } else if (!selectedApplicationDocuments.description) {
      errorNotification('Description is required');
    } else {
      const formData = new FormData();
      formData.append('description', selectedApplicationDocuments.description);
      formData.append('isPublic', selectedApplicationDocuments.isPublic);
      formData.append('documentType', selectedApplicationDocuments.documentType);
      formData.append('document', selectedApplicationDocuments.fileData);
      formData.append('entityId', editApplication.applicationId);
      formData.append('documentFor', 'application');
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      await dispatch(uploadDocument(formData, config));
      dispatchSelectedApplicationDocuments({
        type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
      });
      setFileData('');
      toggleUploadModel();
    }
  }, [
    selectedApplicationDocuments,
    dispatchSelectedApplicationDocuments,
    toggleUploadModel,
    editApplication.applicationId,
  ]);

  const uploadDocumentButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => onCloseUploadDocumentButton() },
      { title: 'Upload', buttonType: 'primary', onClick: onClickUploadDocument },
    ],
    [onCloseUploadDocumentButton, onClickUploadDocument]
  );

  useEffect(() => {
    dispatch(getDocumentTypeList());
  }, []);

  const handleDocumentChange = useCallback(
    newValue => {
      dispatchSelectedApplicationDocuments({
        type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: newValue[0].name,
        value: newValue[0].value,
      });
    },
    [dispatchSelectedApplicationDocuments]
  );
  const onchangeDocumentDescription = useCallback(
    e => {
      dispatchSelectedApplicationDocuments({
        type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: e.target.name,
        value: e.target.value,
      });
    },
    [dispatchSelectedApplicationDocuments]
  );
  const onChangeDocumentSwitch = useCallback(
    e => {
      dispatchSelectedApplicationDocuments({
        type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: e.target.name,
        value: e.target.checked,
      });
    },
    [dispatchSelectedApplicationDocuments]
  );

  const callBack = useCallback(() => {
    toggleConfirmationModal();
    dispatch(getApplicationDocumentDataList(editApplication.applicationId));
  }, [editApplication.applicationId]);

  const deleteDocumentButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(deleteApplicationDocumentAction(applicationDocId, callBack));
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, applicationDocId]
  );

  const deleteApplicationDocument = useCallback(
    docId => {
      setApplicationDocId(docId);
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
      <div className="if-yes-row">
        <span className="font-primary mr-15">Upload your documents here</span>
        <IconButton buttonType="primary" title="cloud_upload" onClick={() => toggleUploadModel()} />
      </div>
      <table className="documents-table">
        <tbody>
          <tr>
            <th align="left">Document Type</th>
            <th align="left">Description</th>
            <th />
          </tr>
          {documentData &&
            documentData.map(document => (
              <tr>
                <td>{document.documentTypeId}</td>
                <td>{document.description}</td>
                <td align="right">
                  <span
                    className="material-icons-round font-danger cursor-pointer"
                    onClick={() => deleteApplicationDocument(document._id)}
                  >
                    delete_outline
                  </span>{' '}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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

export default ApplicationDocumentStep;
