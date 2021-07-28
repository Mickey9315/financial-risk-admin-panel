import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Accordion from '../../../common/Accordion/Accordion';
import {
  changeApplicationStatus,
  getApplicationAlertsListData,
  getApplicationDetailById,
  getApplicationModuleList,
  getApplicationNotesList,
  getApplicationReportsListData,
  getApplicationReportsListForFetch,
  getApplicationTaskDefaultEntityDropDownData,
  getApplicationTaskList,
  getAssigneeDropDownData,
  getViewApplicationDocumentTypeList,
  resetApplicationDetail,
} from '../redux/ApplicationAction';
import TableApiService from '../../../common/Table/TableApiService';
import Drawer from '../../../common/Drawer/Drawer';
import ApplicationReportAccordion from './component/ApplicationReportAccordion';
import ApplicationTaskAccordion from './component/ApplicationTaskAccordion';
import ApplicationNotesAccordion from './component/ApplicationNotesAccordion';
import ApplicationAlertsAccordion from './component/ApplicationAlertsAccordion';
import ApplicationDocumentsAccordion from './component/ApplicationDocumentsAccordion';
import ApplicationLogsAccordion from './component/ApplicationLogsAccordion';
import { errorNotification } from '../../../common/Toast';
import Loader from '../../../common/Loader/Loader';
import Modal from '../../../common/Modal/Modal';
import { NUMBER_REGEX } from '../../../constants/RegexConstants';
import Input from '../../../common/Input/Input';
import Button from '../../../common/Button/Button';
import Switch from '../../../common/Switch/Switch';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: [],
  drawerHeader: '',
};

const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
        drawerHeader: action.drawerHeader,
      };
    case DRAWER_ACTIONS.HIDE_DRAWER:
      return { ...drawerInitialState };

    default:
      return state;
  }
};

const ViewApplication = () => {
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const viewApplicationData = useSelector(({ application }) => application?.viewApplication ?? {});
  const { applicationDetail } = useMemo(() => viewApplicationData, [viewApplicationData]);

  const { viewApplicationPageLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  // status logic
  const [isApprovedOrDeclined, setIsApprovedOrDeclined] = useState(false);
  const [declinedNoteData, setDeclinedNoteData] = useState({ description: '', isPublic: false });
  const [showConfirmModal, setShowConfirmationModal] = useState(false);
  const [statusToChange, setStatusToChange] = useState({});
  const toggleConfirmationModal = useCallback(() => {
    setShowConfirmationModal(!showConfirmModal);
  }, [showConfirmModal]);
  const {
    tradingName,
    entityType,
    entityName,
    abn,
    debtorId,
    clientId,
    creditLimit,
    outstandingAmount,
    orderOnHand,
    applicationId,
    isAllowToUpdate,
    status,
    blockers,
    _id,
    country,
    registrationNumber,
    acn,
  } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);

  const [isAUSOrNZL, setIsAUZOrNZL] = useState(false);

  useEffect(() => {
    if (['AUS', 'NZL'].includes(country)) {
      setIsAUZOrNZL(true);
    }
  }, [country]);

  useEffect(() => {
    dispatch(getApplicationDetailById(id));
    dispatch(getAssigneeDropDownData());
    dispatch(getApplicationTaskDefaultEntityDropDownData({ entityName: 'application' }));
    dispatch(getApplicationNotesList(id));
    dispatch(getApplicationModuleList(id));
    dispatch(getViewApplicationDocumentTypeList());
    dispatch(getApplicationTaskList(id));
    dispatch(getApplicationAlertsListData(id));
    return () => dispatch(resetApplicationDetail());
  }, [id]);

  useEffect(() => {
    if (debtorId?.length > 0 && isAUSOrNZL) {
      dispatch(getApplicationReportsListData(debtorId?.[0]?._id));
      dispatch(getApplicationReportsListForFetch(debtorId?.[0]?._id));
    }
  }, [debtorId, isAUSOrNZL]);

  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const handleDrawerState = useCallback(async (idDrawer, headers) => {
    try {
      const response = await TableApiService.tableActions({
        url: headers[0].request.url,
        method: headers[0].request.method,
        id: idDrawer,
      });

      dispatchDrawerState({
        type: DRAWER_ACTIONS.SHOW_DRAWER,
        data: response.data.data.response,
        drawerHeader: response.data.data.header,
      });
    } catch (e) {
      errorNotification('Something went wrong.');
    }
  }, []);
  const closeDrawer = useCallback(() => {
    dispatchDrawerState({
      type: DRAWER_ACTIONS.HIDE_DRAWER,
    });
  }, []);

  const backToApplicationList = () => {
    history.replace('/applications');
  };
  const INPUTS = useMemo(
    () => [
      {
        title: 'Application ID',
        value: applicationId,
        name: '_id',
        type: 'text',
      },
      {
        title: 'Credit Limit',
        value: creditLimit ? NumberCommaSeparator(creditLimit) : '',
        name: 'creditLimit',
        type: 'text',
      },
      {
        title: 'Outstanding Amount',
        value: outstandingAmount ? NumberCommaSeparator(outstandingAmount) : '',
        name: 'outstandingAmount',
        type: 'text',
      },
      {
        title: 'Order on Hand',
        value: orderOnHand,
        name: 'orderOnHand',
        type: 'text',
      },
      {
        title: 'Client Name',
        value: clientId?.[0],
        name: 'clientId',
        type: 'link',
      },
      {
        title: 'Debtor Name',
        value: debtorId?.[0],
        name: 'debtorId',
        type: 'link',
      },
      {
        title: 'ABN/NZBN',
        value: abn,
        name: 'abn',
        type: 'text',
      },
      {
        title: 'ACN/NCN',
        value: acn,
        name: 'abn',
        type: 'text',
      },
      {
        title: 'Entity Name',
        value: entityName,
        name: 'entityName',
        type: 'text',
      },
      {
        title: 'Entity Type',
        value: entityType,
        name: 'entityType',
        type: 'text',
      },
      {
        title: 'Trading Name',
        value: tradingName,
        name: 'tradingName',
        type: 'text',
      },
    ],
    [tradingName, entityType, entityName, abn, debtorId, clientId, creditLimit, applicationId]
  );

  const applicationDetails = useMemo(() => {
    if (['AUS', 'NZL'].includes(country)) {
      return [...INPUTS];
    }
    const filteredData = [...INPUTS];
    filteredData.splice(6, 2, {
      title: 'Company Registration No.*',
      type: 'text',
      name: 'registrationNumber',
      value: registrationNumber,
    });
    return filteredData;
  }, [registrationNumber, INPUTS, country]);

  // limit modify

  const [newCreditLimit, setNewCreditLimit] = useState('');
  const [modifyLimitModal, setModifyLimitModal] = useState(false);
  const [isLimitNote, setIsLimitNote] = useState(false);
  const [approveNoteData, setApproveNoteData] = useState({ description: '', isPublic: false });
  const toggleModifyLimitModal = useCallback(() => {
    setModifyLimitModal(!modifyLimitModal);
  }, [modifyLimitModal]);

  const onChangeCreditLimit = useCallback(
    e => {
      const val = e?.target?.value?.toString()?.replaceAll(',', '');
      setNewCreditLimit(val);
      if (val < creditLimit) {
        setIsLimitNote(true);
      } else {
        setIsLimitNote(false);
      }
    },
    [creditLimit]
  );

  const modifyLimit = useCallback(async () => {
    if (newCreditLimit?.toString()?.trim().length <= 0) {
      errorNotification('Please provide credit limit');
    } else if (newCreditLimit && !newCreditLimit?.toString()?.trim()?.match(NUMBER_REGEX)) {
      errorNotification('Please provide valid credit limit');
    } else if (newCreditLimit > creditLimit) {
      errorNotification("Can't approve more credit limit than requested");
    } else {
      try {
        if (!isLimitNote) {
          const data = {
            creditLimit: newCreditLimit?.toString()?.trim(),
            status: statusToChange?.value,
          };
          await dispatch(changeApplicationStatus(id, data, statusToChange));
          toggleModifyLimitModal();
        } else if (isLimitNote) {
          if (approveNoteData?.description?.trim()?.length > 0) {
            const data = {
              creditLimit: newCreditLimit?.toString()?.trim(),
              description: approveNoteData?.description,
              isPublic: approveNoteData?.isPublic,
              status: statusToChange?.value,
            };
            await dispatch(changeApplicationStatus(id, data, statusToChange));
            dispatch(getApplicationNotesList(id));
            toggleModifyLimitModal();
          } else {
            errorNotification('Please Enter Description');
          }
        }
      } catch (e) {
        /**/
      }
    }
  }, [
    newCreditLimit,
    toggleModifyLimitModal,
    statusToChange,
    id,
    creditLimit,
    approveNoteData,
    isLimitNote,
  ]);

  const modifyLimitButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          toggleModifyLimitModal();
          setNewCreditLimit(creditLimit);
          setApproveNoteData({ description: '', isPublic: false });
          setIsLimitNote(false);
        },
      },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: modifyLimit,
      },
    ],
    [toggleModifyLimitModal, modifyLimit, creditLimit]
  );

  const handleApplicationStatusChange = useCallback(
    async e => {
      if (['CANCELLED', 'SURRENDERED', 'WITHDRAWN'].includes(e?.value)) {
        setStatusToChange(e);
        toggleConfirmationModal();
      } else {
        try {
          await dispatch(changeApplicationStatus(_id, { status: e?.value }, e));
        } catch (err) {
          /**/
        }
      }
    },
    [toggleConfirmationModal, _id, setStatusToChange, statusToChange]
  );

  const handleDeclinedStatusWithNote = useCallback(async () => {
    try {
      if (declinedNoteData?.description?.trim()?.length > 0) {
        const data = {
          description: declinedNoteData?.description,
          isPublic: declinedNoteData?.isPublic,
          status: statusToChange?.value,
        };
        await dispatch(changeApplicationStatus(id, data, statusToChange));
        dispatch(getApplicationNotesList(id));
        toggleConfirmationModal();
      } else {
        errorNotification('Please Enter Description');
      }
    } catch (e) {
      /**/
    }
  }, [declinedNoteData, statusToChange?.value, id, toggleConfirmationModal]);

  const changeStatusButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Save',
        buttonType: 'danger',
        onClick: async () => {
          try {
            if (statusToChange?.value !== 'DECLINED') {
              await dispatch(
                changeApplicationStatus(_id, { status: statusToChange?.value }, statusToChange)
              );
              toggleConfirmationModal();
            } else {
              await handleDeclinedStatusWithNote();
            }
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, statusToChange, _id, handleDeclinedStatusWithNote]
  );

  useEffect(() => {
    setNewCreditLimit(creditLimit);
  }, [creditLimit]);

  useEffect(() => {
    if (['APPROVED', 'DECLINED'].includes(status?.value)) setIsApprovedOrDeclined(true);
    else {
      setIsApprovedOrDeclined(false);
    }
  }, [status]);

  const rightSideStatusButtons = useMemo(() => {
    if (!['DECLINED', 'APPROVED'].includes(status?.value)) {
      return (
        <div className="right-side-status">
          <Button
            buttonType="success"
            className="small-button"
            title="Approve"
            onClick={() => {
              setStatusToChange({ label: 'Approved', value: 'APPROVED' });
              toggleModifyLimitModal();
            }}
          />
          <Button
            buttonType="danger"
            className="small-button"
            title="Decline"
            onClick={() => {
              setStatusToChange({ label: 'Declined', value: 'DECLINED' });
              toggleConfirmationModal();
            }}
          />
        </div>
      );
    }

    return <></>;
  }, [status, toggleModifyLimitModal, setStatusToChange, toggleConfirmationModal]);

  return (
    <>
      {!viewApplicationPageLoader ? (
        (() =>
          !_.isEmpty(applicationDetail) ? (
            <>
              <div className="breadcrumb mt-10">
                <span onClick={backToApplicationList}>Application List</span>
                <span className="material-icons-round">navigate_next</span>
                <span>View Application</span>
              </div>
              <TableLinkDrawer drawerState={drawerState} closeDrawer={closeDrawer} />
              <div className="view-application-container">
                <div className="view-application-details-left">
                  <div className="common-white-container">
                    <div className="">Status</div>
                    <div className="application-status-grid">
                      <div>
                        <div className="view-application-status">
                          {isApprovedOrDeclined ? (
                            <div>
                              {['APPROVED'].includes(status?.value) && (
                                <div className="application-status approved-application-status">
                                  {status?.label}
                                </div>
                              )}
                              {['DECLINED'].includes(status?.value) && (
                                <div className="application-status declined-application-status">
                                  {status?.label}
                                </div>
                              )}
                            </div>
                          ) : (
                            <ReactSelect
                              className="react-select-container"
                              classNamePrefix="react-select"
                              placeholder="Select Status"
                              name="applicationStatus"
                              value={!isApprovedOrDeclined ? status : []}
                              options={applicationDetail?.applicationStatus}
                              isDisabled={!isAllowToUpdate || isApprovedOrDeclined}
                              onChange={handleApplicationStatusChange}
                            />
                          )}

                          {!isAllowToUpdate && !isApprovedOrDeclined && (
                            <div className="ui-state-error">
                              You don&apos;t have access to approve application, please contact
                              admin that.
                            </div>
                          )}
                        </div>
                      </div>
                      {isAllowToUpdate && rightSideStatusButtons}
                    </div>
                    <div className="application-details-grid">
                      {applicationDetails?.map(detail => (
                        <div>
                          <div className="font-field mb-5">{detail?.title}</div>
                          {detail?.type === 'text' && (
                            <div className="detail">{detail.value || '-'}</div>
                          )}
                          {detail?.type === 'link' && (
                            <div
                              style={{
                                textDecoration: detail?.value?.value && 'underline',
                                cursor: 'pointer',
                              }}
                              className="detail"
                              onClick={() => {
                                handleDrawerState(
                                  detail?.value?._id,
                                  applicationDetail?.headers?.filter(
                                    header => header?.name === detail?.name
                                  )
                                );
                              }}
                            >
                              {detail?.value?.value || '-'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {blockers?.length > 0 && (
                      <>
                        <div className="blockers-title">Blockers</div>

                        {blockers.map(blocker => (
                          <div className="guideline" key={Math.random()}>
                            {blocker}
                          </div>
                        ))}
                      </>
                    )}
                    <div className="current-business-address-title">Current Business Address</div>
                    <div className="current-business-address">
                      <div className="font-field mr-15">Address</div>
                      <div className="font-primary">{applicationDetail?.address || '-'}</div>
                    </div>
                    <div className="view-application-question">
                      Any extended payment terms outside your policy standard terms?
                    </div>
                    <div className="view-application-answer">
                      {applicationDetail?.isExtendedPaymentTerms
                        ? applicationDetail?.extendedPaymentTermsDetails
                        : ' No'}
                    </div>
                    <div className="view-application-question">
                      Any overdue amounts passed your maximum extension period / Credit period?
                    </div>
                    <div className="view-application-answer">
                      {applicationDetail?.isPassedOverdueAmount
                        ? applicationDetail?.passedOverdueDetails
                        : ' No'}
                    </div>
                  </div>
                </div>
                <div className="view-application-details-right">
                  <div className="common-white-container">
                    <Accordion className="view-application-accordion">
                      {isAUSOrNZL && (
                        <ApplicationReportAccordion debtorId={debtorId?.[0]?._id} index={0} />
                      )}
                      <ApplicationTaskAccordion applicationId={id} index={1} />
                      <ApplicationNotesAccordion applicationId={id} index={2} />
                      <ApplicationAlertsAccordion index={3} />
                      <ApplicationDocumentsAccordion applicationId={id} index={4} />
                      <ApplicationLogsAccordion index={5} />
                    </Accordion>
                  </div>
                </div>
              </div>
              {showConfirmModal && (
                <Modal
                  className="add-to-crm-modal"
                  header="Application Status"
                  buttons={changeStatusButton}
                  hideModal={toggleConfirmationModal}
                >
                  {statusToChange?.value !== 'DECLINED' ? (
                    <span className="confirmation-message">
                      Are you sure you want to {statusToChange?.label} this application? Dont forget
                      to put add a Note.
                    </span>
                  ) : (
                    <>
                      <div className="font-field mb-30">
                        Are you sure you want to decline this application?
                      </div>
                      <div className="add-notes-popup-container">
                        <span>Description</span>
                        <Input
                          prefixClass="font-placeholder"
                          placeholder="Note description"
                          name="description"
                          type="text"
                          value={declinedNoteData?.description}
                          onChange={e => {
                            setDeclinedNoteData({
                              ...declinedNoteData,
                              description: e?.target?.value,
                            });
                          }}
                        />
                        <span>Private/Public</span>
                        <Switch
                          id="selected-note"
                          name="isPublic"
                          checked={declinedNoteData.isPublic}
                          onChange={e => {
                            setDeclinedNoteData({
                              ...declinedNoteData,
                              isPublic: e.target.checked,
                            });
                          }}
                        />
                      </div>
                    </>
                  )}
                </Modal>
              )}
              {modifyLimitModal && (
                <Modal
                  className="add-to-crm-modal"
                  header="Approve Application"
                  buttons={modifyLimitButtons}
                  hideModal={toggleModifyLimitModal}
                >
                  <div className="modify-credit-limit-container align-center">
                    <span>Credit Limit</span>
                    <Input
                      prefixClass="font-placeholder"
                      placeholder="New Credit Limit"
                      name="creditLimit"
                      type="text"
                      value={newCreditLimit ? NumberCommaSeparator(newCreditLimit) : ''}
                      onChange={onChangeCreditLimit}
                    />
                  </div>
                  {isLimitNote && (
                    <div className="add-notes-popup-container mt-15">
                      <span>Description</span>
                      <Input
                        prefixClass="font-placeholder"
                        placeholder="Note description"
                        name="description"
                        type="text"
                        value={approveNoteData?.description}
                        onChange={e => {
                          setApproveNoteData({
                            ...approveNoteData,
                            description: e?.target?.value,
                          });
                        }}
                      />
                      <span>Private/Public</span>
                      <Switch
                        id="selected-note"
                        name="isPublic"
                        checked={approveNoteData.isPublic}
                        onChange={e => {
                          setApproveNoteData({
                            ...approveNoteData,
                            isPublic: e.target.checked,
                          });
                        }}
                      />
                    </div>
                  )}
                </Modal>
              )}
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ViewApplication;

function TableLinkDrawer(props) {
  const { drawerState, closeDrawer } = props;
  const checkValue = row => {
    switch (row.type) {
      case 'dollar':
        return row.value ? `$ ${row.value}` : '-';
      case 'percent':
        return row.value ? `${row.value} %` : '-';
      case 'date':
        return row.value ? moment(row.value).format('DD-MMM-YYYY') : '-';
      default:
        return row.value || '-';
    }
  };

  return (
    <Drawer
      header={drawerState.drawerHeader}
      drawerState={drawerState.visible}
      closeDrawer={closeDrawer}
    >
      <div className="contacts-grid">
        {drawerState?.data?.map(row => (
          <>
            <div className="title" key={Math.random()}>
              {row.label}
            </div>
            <div>{checkValue(row)}</div>
          </>
        ))}
      </div>
    </Drawer>
  );
}

TableLinkDrawer.propTypes = {
  drawerState: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    drawerHeader: PropTypes.string.isRequired,
  }).isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

TableLinkDrawer.defaultProps = {};
