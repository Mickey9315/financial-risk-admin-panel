import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Accordion from '../../../common/Accordion/Accordion';
import {
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
import ApplicationNotesAccordion from './component/applicationNotesAccordion/ApplicationNotesAccordion';
import ApplicationAlertsAccordion from './component/ApplicationAlertsAccordion';
import ApplicationDocumentsAccordion from './component/ApplicationDocumentsAccordion';
import ApplicationLogsAccordion from './component/ApplicationLogsAccordion';
import { errorNotification } from '../../../common/Toast';
import Loader from '../../../common/Loader/Loader';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';
import ViewApplicationStatusComponent from './component/ViewApplicationStatusComponent';
import ViewApplicationEditableRowComponent from './component/ViewApplicationEditableRowComponent';
import ApplicationClientReferenceAccordion from './component/ApplicationClientReferenceAccordion';
import ApplicationCommentAccordion from './component/ApplicationCommentAccordion';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

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
  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );

  const { viewApplicationPageLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );
  const isClientReadable = useModulePrivileges(SIDEBAR_NAMES.CLIENT).hasReadAccess;
  const isDebtorReadable = useModulePrivileges(SIDEBAR_NAMES.DEBTOR).hasReadAccess;
  // status logic
  const [isApprovedOrDeclined, setIsApprovedOrDeclined] = useState(false);
  const [isApprovedOrdDeclineButtonClicked, setIsApprovedOrdDeclineButtonClicked] = useState(false);
  const userPrivilegesData = useSelector(({ userPrivileges }) => userPrivileges);

  const checkAccess = useCallback(
    accessFor => {
      const availableAccess =
        userPrivilegesData.filter(module => module.accessTypes.length > 0) ?? [];
      const isAccessible = availableAccess.filter(module => module?.name === accessFor);
      return isAccessible?.length > 0;
    },
    [userPrivilegesData]
  );

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
    status,
    blockers,
    country,
    registrationNumber,
    acn,
    clientReference,
    comments,
  } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);

  const [isAUSOrNZL, setIsAUZOrNZL] = useState(false);

  useEffect(() => {
    if (['AUS', 'NZL'].includes(country)) {
      setIsAUZOrNZL(true);
    }
  }, [country]);

  useEffect(() => {
    dispatch(getApplicationDetailById(id));
    if (checkAccess('note')) {
      dispatch(getApplicationNotesList(id));
    }
    dispatch(getApplicationModuleList(id));
    if (checkAccess('document')) {
      dispatch(getViewApplicationDocumentTypeList());
    }
    if (checkAccess('task')) {
      dispatch(getApplicationTaskList(id));
      dispatch(getAssigneeDropDownData());
      dispatch(getApplicationTaskDefaultEntityDropDownData({ entityName: 'application' }));
    }
    return () => dispatch(resetApplicationDetail());
  }, [id, checkAccess]);

  useEffect(() => {
    if (debtorId?.length > 0 && isAUSOrNZL && checkAccess('credit-report')) {
      dispatch(getApplicationReportsListData(debtorId?.[0]?._id));
      dispatch(getApplicationReportsListForFetch(debtorId?.[0]?._id));
    }
  }, [debtorId, isAUSOrNZL, checkAccess]);

  useEffect(() => {
    if (debtorId?.length > 0) {
      dispatch(getApplicationAlertsListData(debtorId?.[0]?._id));
    }
  }, [debtorId]);

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
        title: 'Credit Limit Amount',
        value: NumberCommaSeparator(creditLimit),
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
        value: isClientReadable ? clientId?.[0] : clientId?.[0]?.value,
        name: 'clientId',
        type: isClientReadable ? 'link' : 'text',
      },
      {
        title: 'Debtor Name',
        value: isDebtorReadable ? debtorId?.[0] : debtorId?.[0]?.value,
        name: 'debtorId',
        type: isDebtorReadable ? 'link' : 'text',
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
    [
      tradingName,
      entityType,
      entityName,
      abn,
      debtorId,
      clientId,
      creditLimit,
      applicationId,
      isClientReadable,
      isDebtorReadable,
    ]
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
    console.log('Filter', filteredData);
    return filteredData;
  }, [registrationNumber, INPUTS, country]);

  useEffect(() => {
    if (['APPROVED', 'DECLINED'].includes(status?.value)) setIsApprovedOrDeclined(true);
    else {
      setIsApprovedOrDeclined(false);
    }
  }, [status]);

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
                    <div className="font-field">Status</div>
                    <ViewApplicationStatusComponent isApprovedOrDeclined={isApprovedOrDeclined}  
                    setIsApprovedOrdDeclineButtonClicked={setIsApprovedOrdDeclineButtonClicked}
                    />
                    <ViewApplicationEditableRowComponent
                      isApprovedOrDeclined={isApprovedOrDeclined}
                      isApprovedOrdDeclineButtonClicked={isApprovedOrdDeclineButtonClicked}
                    />
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
                    {/* <div className="current-business-address-title">Current Business Address</div> */}
                    <div className="application-comment">
                      <div className="font-field mr-15">Comment</div>
                      <div className="font-primary">{comments || '-'}</div>
                    </div>
                    <div className="client-reference">
                      <div className="font-field mr-15">Client reference</div>
                      <div className="font-primary">{clientReference || '-'}</div>
                    </div>
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
                      {isAUSOrNZL && checkAccess('credit-report') && (
                        <ApplicationReportAccordion debtorId={debtorId?.[0]?._id} index={0} />
                      )}
                      {checkAccess('task') && (
                        <ApplicationTaskAccordion applicationId={id} index={1} />
                      )}
                      {checkAccess('note') && (
                        <ApplicationNotesAccordion applicationId={id} index={2} />
                      )}
                      <ApplicationAlertsAccordion index={3} />
                      {checkAccess('document') && (
                        <ApplicationDocumentsAccordion applicationId={id} index={4} />
                      )}
                      <ApplicationLogsAccordion index={5} />
                      <ApplicationClientReferenceAccordion index={6} />
                      <ApplicationCommentAccordion index={7} />
                    </Accordion>
                  </div>
                </div>
              </div>
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
