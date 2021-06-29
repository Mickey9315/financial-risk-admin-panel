import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import ReactSelect from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'rc-tooltip';
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
  const { documentTypeList, uploadDocumentApplicationData } = useSelector(
    ({ application }) => application.editApplication?.documents
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
  const [selectedApplicationDocuments, dispatchSelectedApplicationDocuments] = useReducer(
    applicationDocumentReducer,
    initialApplicationDocumentState
  );

  const { documentType, description, isPublic } = useMemo(() => selectedApplicationDocuments, [
    selectedApplicationDocuments,
  ]);

  const {
    GenerateApplicationDocumentUploadButtonLoaderAction,
    generateApplicationDocumentDeleteButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const [uploadModel, setUploadModel] = useState(false);
  const toggleUploadModel = useCallback(
    value => setUploadModel(value !== undefined ? value : e => !e),

    [setUploadModel]
  );

  const documentTypeOptions = useMemo(() => {
    const finalData = documentTypeList?.docs ?? [];
    return finalData.map(e => ({
      name: 'documentType',
      label: e.documentTitle,
      value: e._id,
    }));
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
        // const checkFileSize = e.target.files[0].size > 4194304;

        if (!(checkExtension || checkMimeTypes)) {
          errorNotification('Only image and document type files are allowed');
        }
        // else if (checkFileSize) {
        //   errorNotification('File size should be less than 4 mb');
        // }
        else {
          setFileData(e.target.files[0]);
          dispatchSelectedApplicationDocuments({
            type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
            name: 'fileData',
            value: e.target.files[0],
          });
        }
      }
    },
    [setFileData]
  );

  const onCloseUploadDocumentButton = useCallback(() => {
    dispatchSelectedApplicationDocuments({
      type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
    });
    setFileData('');
    toggleUploadModel();
  }, [toggleUploadModel, dispatchSelectedApplicationDocuments]);

  const editApplication = useSelector(({ application }) => application.editApplication);
  useEffect(() => {
    if (editApplication && editApplication._id) {
      dispatch(getApplicationDocumentDataList(editApplication._id));
    }
  }, [editApplication._id]);

  const onClickUploadDocument = useCallback(async () => {
    if (selectedApplicationDocuments?.documentType?.length <= 0) {
      errorNotification('Please select document type');
    } else if (!fileData) {
      errorNotification('Select document to upload');
    } else {
      const formData = new FormData();
      formData.append('description', selectedApplicationDocuments.description);
      formData.append('isPublic', selectedApplicationDocuments.isPublic);
      formData.append('documentType', selectedApplicationDocuments.documentType.value);
      formData.append('document', selectedApplicationDocuments.fileData);
      formData.append('entityId', editApplication?._id);
      formData.append('documentFor', 'application');
      try {
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };
        await dispatch(uploadDocument(formData, config));
        dispatchSelectedApplicationDocuments({
          type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
        });
        getApplicationDocumentDataList();
        setFileData('');
        toggleUploadModel();
      } catch (e) {
        /**/
      }
    }
  }, [
    selectedApplicationDocuments,
    fileData,
    dispatchSelectedApplicationDocuments,
    toggleUploadModel,
    editApplication?.id,
    setFileData,
  ]);

  const uploadDocumentButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => onCloseUploadDocumentButton() },
      {
        title: 'Upload',
        buttonType: 'primary',
        onClick: onClickUploadDocument,
        isLoading: GenerateApplicationDocumentUploadButtonLoaderAction,
      },
    ],
    [
      onCloseUploadDocumentButton,
      onClickUploadDocument,
      GenerateApplicationDocumentUploadButtonLoaderAction,
    ]
  );

  useEffect(() => {
    dispatch(getDocumentTypeList());
  }, []);

  const handleDocumentChange = useCallback(
    newValue => {
      dispatchSelectedApplicationDocuments({
        type: APPLICATION_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: newValue.name,
        value: newValue,
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
    dispatch(getApplicationDocumentDataList(editApplication._id));
  }, [editApplication._id]);

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
        isLoading: generateApplicationDocumentDeleteButtonLoaderAction,
      },
    ],
    [toggleConfirmationModal, applicationDocId, generateApplicationDocumentDeleteButtonLoaderAction]
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
            {documentData?.map(document => (
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
                    onClick={() => deleteApplicationDocument(document?._id)}
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
            <ReactSelect
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select"
              options={documentTypeOptions}
              value={documentType}
              onChange={handleDocumentChange}
            />
            <span>Please upload your documents here</span>
            <FileUpload
              isProfile={false}
              fileName={fileData.name ?? 'Browse'}
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
