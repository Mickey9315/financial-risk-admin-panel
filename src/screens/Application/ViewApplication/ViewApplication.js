import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import Accordion from '../../../common/Accordion/Accordion';
import {
  changeApplicationStatus,
  getApplicationDetailById,
  getApplicationModuleList,
  getApplicationNotesList,
  getApplicationReportsListData,
  getApplicationReportsListForFetch,
  getApplicationTaskDefaultEntityDropDownData,
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

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: [],
};

const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
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
  const { applicationDetail, isLoading } = useMemo(() => viewApplicationData, [
    viewApplicationData,
  ]);
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
    applicationId,
    isAllowToUpdate,
    status,
    blockers,
    _id,
    country,
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
    return () => dispatch(resetApplicationDetail());
  }, [id]);

  useEffect(() => {
    if (debtorId?.length > 0 && isAUSOrNZL) {
      dispatch(getApplicationReportsListData(debtorId?.[0]?._id));
      dispatch(getApplicationReportsListForFetch());
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
        data: response.data.data,
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
  const applicationDetails = useMemo(
    () => [
      {
        title: 'Application ID',
        value: applicationId,
        name: '_id',
        type: 'text',
      },
      {
        title: 'Credit Limit',
        value: creditLimit,
        name: 'creditLimit',
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
        title: 'ABN',
        value: abn,
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

  // limit modify

  const [newCreditLimit, setNewCreditLimit] = useState('');
  const [modifyLimitModal, setModifyLimitModal] = useState(false);
  const toggleModifyLimitModal = useCallback(() => {
    setNewCreditLimit(creditLimit);
    setModifyLimitModal(!modifyLimitModal);
  }, [modifyLimitModal, creditLimit]);

  const modifyLimit = useCallback(async () => {
    try {
      if (newCreditLimit?.trim()?.length <= 0) {
        errorNotification('Please provide new credit limit');
      } else if (newCreditLimit && !newCreditLimit.match(NUMBER_REGEX)) {
        errorNotification('Please provide valid credit limit');
      } else {
        const data = {
          creditLimit: newCreditLimit,
          status: statusToChange?.value,
        };
        await dispatch(changeApplicationStatus(id, data));
        toggleModifyLimitModal();
      }
    } catch (e) {
      /**/
    }
  }, [newCreditLimit, toggleModifyLimitModal, statusToChange, id]);

  const modifyLimitButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleModifyLimitModal() },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: modifyLimit,
      },
    ],
    [toggleModifyLimitModal, modifyLimit]
  );

  const handleApplicationStatusChange = useCallback(
    e => {
      if (['CANCELLED', 'DECLINED', 'SURRENDERED', 'WITHDRAWN'].includes(e?.value)) {
        setStatusToChange(e);
        toggleConfirmationModal();
      } else if (['APPROVED'].includes(e?.value)) {
        setStatusToChange(e);
        toggleModifyLimitModal();
      } else {
        dispatch(changeApplicationStatus(_id, { status: e?.value }));
      }
    },
    [toggleConfirmationModal, toggleModifyLimitModal, _id]
  );

  const changeStatusButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Change',
        buttonType: 'danger',
        onClick: async () => {
          await dispatch(changeApplicationStatus(_id, { status: statusToChange?.value }));
          toggleConfirmationModal();
        },
        // isLoading: viewApplicationDeleteTaskButtonLoaderAction,
      },
    ],
    [toggleConfirmationModal, statusToChange, _id]
  );

  return (
    <>
      {!isLoading ? (
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
                <div className="view-application-status">
                  <ReactSelect
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Status"
                    name="applicationStatus"
                    value={status || []}
                    options={applicationDetail?.applicationStatus}
                    isDisabled={!isAllowToUpdate}
                    onChange={handleApplicationStatusChange}
                  />
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
        </>
      ) : (
        <Loader />
      )}
      {showConfirmModal && (
        <Modal
          header="Application Status"
          buttons={changeStatusButton}
          hideModal={toggleConfirmationModal}
        >
          <span className="confirmation-message">
            Are you sure you want to {statusToChange?.label} this application?
          </span>
        </Modal>
      )}
      {modifyLimitModal && (
        <Modal
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
              value={newCreditLimit}
              onChange={e => setNewCreditLimit(e?.target?.value)}
            />
          </div>
        </Modal>
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
    <Drawer header="Contact Details" drawerState={drawerState.visible} closeDrawer={closeDrawer}>
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
  }).isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

TableLinkDrawer.defaultProps = {};
