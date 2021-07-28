import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import {
  clearAlertDetails,
  getDebtorAlertsDetail,
  getDebtorsAlertsListData,
} from '../redux/DebtorsAction';
import Modal from '../../../common/Modal/Modal';
import { ALERT_TYPE_ROW, ALERT_TYPE_ROW_ICON } from '../../../constants/AlertConstants';

const DebtorsAlertsTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();

  const [isAlertModal, setIsAlertModal] = useState(false);

  const { alertsList, alertDetail } = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.alerts ?? {}
  );
  const { debtorAlertListLoader, debtorAlertDetailsLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const { total, headers, pages, docs, page, limit } = useMemo(() => alertsList ?? {}, [
    alertsList,
  ]);

  const getDebtorAlertsList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getDebtorsAlertsListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getDebtorAlertsList({ page: 1, limit: newLimit });
    },
    [getDebtorAlertsList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getDebtorAlertsList({ page: newPage, limit });
    },
    [limit, getDebtorAlertsList]
  );

  const onSelectRecord = useCallback(
    alertId => {
      dispatch(getDebtorAlertsDetail(alertId));
      setIsAlertModal(true);
    },
    [id]
  );

  const onCloseAlertModal = useCallback(() => {
    setIsAlertModal(false);
    dispatch(clearAlertDetails());
  }, []);

  const alertModalButtons = useMemo(
    () => [{ title: 'Close', buttonType: 'primary-1', onClick: onCloseAlertModal }],
    []
  );

  useEffect(() => {
    getDebtorAlertsList();
  }, [id]);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getDebtorAlertsList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getDebtorAlertsList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  console.log(alertDetail?.alertPriority);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Alerts</div>
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
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!debtorAlertListLoader && docs ? (
        docs.length > 0 ? (
          <>
            <div className="tab-table-container">
              <Table
                align="left"
                valign="center"
                tableClass="white-header-table"
                data={docs}
                headers={headers}
                rowClass="cursor-pointer"
                recordSelected={onSelectRecord}
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
      {isAlertModal && (
        <Modal header="Alerts" buttons={alertModalButtons} className="alert-details-modal">
          {!debtorAlertDetailsLoader ? (
            (() =>
              !_.isEmpty(alertDetail) ? (
                <>
                  <div
                    className="alert-type"
                    style={{ backgroundColor: `${ALERT_TYPE_ROW[alertDetail?.priority]}` }}
                  >
                    <span
                      className={`material-icons-round ${
                        ALERT_TYPE_ROW_ICON[alertDetail?.priority]
                      } f-h2`}
                    >
                      warning
                    </span>
                    <div className="alert-type-right-texts">
                      <div className={`f-16 f-bold ${ALERT_TYPE_ROW_ICON[alertDetail?.priority]}`}>
                        {alertDetail?.priority}
                      </div>
                      <div className="font-primary f-14">{alertDetail?.name}</div>
                    </div>
                  </div>
                  {alertDetail?.generalDetails?.length > 0 && (
                    <div className="alert-details-wrapper">
                      <span className="font-primary f-16 f-bold">General Details</span>
                      <div className="alert-general-details">
                        {alertDetail?.generalDetails?.map(detail => (
                          <>
                            <span>{detail?.label}</span>
                            <div className="alert-detail-value-field">{detail?.value}</div>
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                  {alertDetail?.alertDetails?.length > 0 && (
                    <div className="alert-details-wrapper">
                      <span className="font-primary f-16 f-bold">Alert Details</span>
                      <div className="alert-detail">
                        {alertDetail?.alertDetails?.map(detail => (
                          <>
                            <span>{detail?.label}</span>
                            <div className="alert-detail-value-field">{detail?.value}</div>
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-record-found">No record found</div>
              ))()
          ) : (
            <Loader />
          )}
        </Modal>
      )}
    </>
  );
};

export default DebtorsAlertsTab;
