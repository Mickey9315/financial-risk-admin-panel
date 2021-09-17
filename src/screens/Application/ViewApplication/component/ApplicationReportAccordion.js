import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import Button from '../../../../common/Button/Button';
import Modal from '../../../../common/Modal/Modal';
import { errorNotification } from '../../../../common/Toast';
import {
  downloadSelectedReportForApplication,
  fetchSelectedReportsForApplication,
  getApplicationReportsListData,
} from '../../redux/ApplicationAction';
import Select from '../../../../common/Select/Select';
import { useModulePrivileges } from '../../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../../constants/SidebarConstants';
import { downloadAll } from '../../../../helpers/DownloadHelper';

const ApplicationReportAccordion = props => {
  const { index, debtorId } = props;
  const dispatch = useDispatch();
  const { reportList, reportsListForFetch, partners } = useSelector(
    ({ application }) => application?.viewApplication?.reports ?? {}
  );

  const { viewApplicationFetchReportButtonLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const reportListData = useMemo(() => reportList?.docs ?? [], [reportList]);

  // fetch report

  const [fetchReportsModal, setFetchReportsModal] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [selectedStakeHolder, setSelectedStakeHolder] = useState([]);
  const isReportUpdatable =
    useModulePrivileges(SIDEBAR_NAMES.APPLICATION).hasWriteAccess &&
    useModulePrivileges('credit-report').hasWriteAccess;
  const toggleFetchReportsModal = useCallback(() => {
    setFetchReportsModal(e => !e);
  }, []);

  const partnersWithCompany = useMemo(() => {
    return partners?.filter(partner => partner?.type === 'company') ?? [];
  }, [partners]);

  const OnClickFetchReportButton = useCallback(async () => {
    if (partners?.length > 0 && selectedStakeHolder?.length <= 0) {
      errorNotification('Please select Stake Holder');
    } else if (selectedReports?.length <= 0) {
      errorNotification('Please select reports to fetch');
    } else {
      try {
        const data = {
          debtorId,
          productCode: selectedReports?.value,
        };
        if (partners?.length > 0) {
          data.stakeholderId = selectedStakeHolder?.value;
        }
        await dispatch(fetchSelectedReportsForApplication(data));
        dispatch(getApplicationReportsListData(debtorId));
        setSelectedReports([]);
        setSelectedStakeHolder([]);
        toggleFetchReportsModal();
      } catch (e) {
        /**/
      }
    }
  }, [debtorId, selectedReports, toggleFetchReportsModal, selectedStakeHolder, partners?.length]);

  const fetchReportsButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: toggleFetchReportsModal },
      {
        title: `Fetch`,
        buttonType: 'primary',
        onClick: OnClickFetchReportButton,
        isLoading: viewApplicationFetchReportButtonLoaderAction,
        isDisabled:
          (partners?.length > 0 && partnersWithCompany?.length <= 0) ||
          reportsListForFetch?.length <= 0,
      },
    ],
    [
      toggleFetchReportsModal,
      OnClickFetchReportButton,
      viewApplicationFetchReportButtonLoaderAction,
      partners,
      partnersWithCompany,
    ]
  );

  const handleOnReportSelect = useCallback(value => {
    setSelectedReports(value);
  }, []);
  const handleOnStakeHolderSelect = useCallback(value => {
    setSelectedStakeHolder(value);
  }, []);

  const onReportDownloadClick = useCallback(
    async id => {
      const response = await downloadSelectedReportForApplication(id);
      if (response) {
        downloadAll(response);
      }
    },
    [downloadAll]
  );

  return (
    <>
      {fetchReportsModal && (
        <Modal header="Fetch Report" className="fetch-report-modal" buttons={fetchReportsButtons}>
          <div className="fetch-report-popup-container">
            {partners?.length > 0 && (
              <>
                <span>Stake Holder</span>
                <Select
                  name="role"
                  placeholder={
                    partners?.length > 0 && partnersWithCompany?.length <= 0
                      ? '-'
                      : 'Select Stake Holder'
                  }                  dropdownHandle={false}
                  options={partnersWithCompany}
                  value={selectedStakeHolder}
                  onChange={handleOnStakeHolderSelect}
                  isDisabled={partnersWithCompany?.length <= 0}
                />
              </>
            )}
            {reportsListForFetch?.length > 0 && (
              <>
              {' '}
              <span>Report</span>
            <Select
              name="role"
              placeholder={
                (partners?.length > 0 && partnersWithCompany?.length <= 0) ||
                reportsListForFetch?.length <= 0
                  ? '-'
                  : 'Select Reports'
              }              dropdownHandle={false}
              options={reportsListForFetch}
              value={selectedReports}
              onChange={handleOnReportSelect}
              isDisabled={
                (partners?.length > 0 && partnersWithCompany?.length <= 0) ||
                reportsListForFetch?.length <= 0
              }            />
              </>
            )}
            {partners?.length > 0 && partnersWithCompany?.length <= 0 && (
              <>
                <span />
                <div className="font-danger">
                  All stake holders are individual so reports cannot be fetched.
                </div>
              </>
            )}
          </div>
          {reportsListForFetch?.length <= 0 && (
            <div className="ui-state-error w-100 text-center">
              Applicant is individual so report cannot be fetched.
            </div>
          )}
        </Modal>
      )}
      <AccordionItem
        index={index}
        header="Reports"
        count={
          reportList?.docs?.length < 10 ? `0${reportList?.docs?.length}` : reportList?.docs?.length
        }
        suffix="expand_more"
      >
        {isReportUpdatable && (
          <Button
            buttonType="primary-1"
            title="Fetch Report"
            className="add-note-button"
            onClick={toggleFetchReportsModal}
          />
        )}
        {reportListData?.length > 0 ? (
          reportListData?.map(report => (
            <div className="common-accordion-item-content-box" key={report?._id}>
              <div className="d-flex just-end">
                <span
                  className="material-icons-round font-primary cursor-pointer"
                  title="Download this report"
                  onClick={() => onReportDownloadClick(report?._id)}
                >
                  cloud_download
                </span>
              </div>
              <div className="report-row">
                <span className="title">Name:</span>
                <Tooltip
                  overlayClassName="tooltip-left-class"
                  overlay={report?.name || 'No report title added'}
                  placement="left"
                >
                  <span className="details">{report?.name ?? '-'}</span>
                </Tooltip>
                <span className="title">Report Provider:</span>
                <Tooltip
                  overlayClassName="tooltip-left-class"
                  overlay={report?.reportProvider || 'No report title added'}
                  placement="left"
                >
                  <span className="details">{report?.reportProvider ?? '-'}</span>
                </Tooltip>
                <span className="title">Expiry Date:</span>
                <span className="details">{moment(report?.expiryDate).format('DD-MMM-YYYY')}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-record-found">Nothing To Show</div>
        )}
      </AccordionItem>
    </>
  );
};
export default ApplicationReportAccordion;

ApplicationReportAccordion.propTypes = {
  index: PropTypes.number.isRequired,
  debtorId: PropTypes.string.isRequired,
};
