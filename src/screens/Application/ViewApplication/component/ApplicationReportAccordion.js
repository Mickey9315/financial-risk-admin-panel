import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import ReactSelect from 'react-select';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import Button from '../../../../common/Button/Button';
import Modal from '../../../../common/Modal/Modal';
import { errorNotification } from '../../../../common/Toast';
import {
  fetchSelectedReportsForApplication,
  getApplicationReportsListData,
} from '../../redux/ApplicationAction';

const ApplicationReportAccordion = props => {
  const { index, debtorId } = props;
  const dispatch = useDispatch();
  const { reportList, reportsListForFetch } = useSelector(
    ({ application }) => application?.viewApplication?.reports ?? {}
  );

  const { viewApplicationFetchReportButtonLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const reportListData = useMemo(() => reportList?.docs ?? [], [reportList]);

  // fetch report

  const [fetchReportsModal, setFetchReportsModal] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  const toggleFetchReportsModal = useCallback(() => {
    setFetchReportsModal(e => !e);
  }, []);

  const OnClickFetchReportButton = useCallback(async () => {
    if (selectedReports?.length <= 0) {
      errorNotification('Please select reports to fetch');
    } else {
      try {
        const selectedProductCodes =
          selectedReports?.value; /* selectedReports?.map(report => report?.value); */
        const data = {
          debtorId,
          productCode: selectedProductCodes,
        };
        await dispatch(fetchSelectedReportsForApplication(data));
        dispatch(getApplicationReportsListData(debtorId));
        setSelectedReports([]);
        toggleFetchReportsModal();
      } catch (e) {
        /**/
      }
    }
  }, [debtorId, selectedReports, toggleFetchReportsModal]);

  const fetchReportsButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: toggleFetchReportsModal },
      {
        title: `Fetch`,
        buttonType: 'primary',
        onClick: OnClickFetchReportButton,
        isLoading: viewApplicationFetchReportButtonLoaderAction,
      },
    ],
    [
      toggleFetchReportsModal,
      OnClickFetchReportButton,
      viewApplicationFetchReportButtonLoaderAction,
    ]
  );

  const handleOnReportSelect = useCallback(value => {
    setSelectedReports(value);
  }, []);

  return (
    <>
      {fetchReportsModal && (
        <Modal header="Fetch Report" className="fetch-report-modal" buttons={fetchReportsButtons}>
          <div className="fetch-report-popup-container">
            <span>Report</span>
            <ReactSelect
              // isMulti
              name="role"
              className="react-select-container"
              classNamePrefix="react-select"
              // color="#003A78"
              placeholder="Select Reports"
              dropdownHandle={false}
              // keepSelectedInList={false}
              options={reportsListForFetch}
              value={selectedReports}
              onChange={handleOnReportSelect}
            />
          </div>
        </Modal>
      )}
      <AccordionItem index={index} header="Reports" suffix="expand_more">
        <Button
          buttonType="primary-1"
          title="Fetch Report"
          className="add-note-button"
          onClick={toggleFetchReportsModal}
        />
        {reportListData?.length > 0 ? (
          reportListData?.map(report => (
            <div className="common-accordion-item-content-box" key={report?._id}>
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
