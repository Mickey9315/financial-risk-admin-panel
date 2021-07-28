import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import { ALERT_TYPE_ROW, ALERT_TYPE_ROW_ICON } from '../../../../constants/AlertConstants';
import Modal from '../../../../common/Modal/Modal';
import Loader from '../../../../common/Loader/Loader';
import {
  clearApplicationAlertDetails,
  getApplicationAlertsDetail,
} from '../../redux/ApplicationAction';

const ApplicationAlertsAccordion = props => {
  const dispatch = useDispatch();
  const [isAlertModal, setIsAlertModal] = useState(false);

  const { alertsList, alertDetail } = useSelector(
    ({ application }) => application?.viewApplication?.alerts || {}
  );
  const { index } = props;

  const { applicationAlertDetailsLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  console.log(alertDetail);

  const onSelectAlert = useCallback(alertId => {
    dispatch(getApplicationAlertsDetail(alertId));
    setIsAlertModal(true);
  }, []);

  const onCloseAlertModal = useCallback(() => {
    setIsAlertModal(false);
    dispatch(clearApplicationAlertDetails());
  }, []);

  const alertModalButtons = useMemo(
    () => [{ title: 'Close', buttonType: 'primary-1', onClick: onCloseAlertModal }],
    []
  );

  return (
    <>
      <AccordionItem
        index={index}
        header="Alerts"
        count={alertsList?.length < 10 ? `0${alertsList?.length}` : alertsList?.length}
        suffix="expand_more"
      >
        {alertsList?.length > 0 ? (
          alertsList?.map(alert => (
            <div
              className="common-accordion-item-content-box cursor-pointer"
              style={{ backgroundColor: `${ALERT_TYPE_ROW[alert?.alertPriority]}` }}
              onClick={() => onSelectAlert(alert?._id)}
            >
              <div className="alert-title-row">
                <Tooltip
                  overlayClassName="tooltip-left-class"
                  overlay={<span>Alert Priority</span>}
                  placement="left"
                >
                  <div className={`f-12 f-bold ${ALERT_TYPE_ROW_ICON[alert?.alertPriority]}`}>
                    {alert?.alertPriority}
                  </div>
                </Tooltip>
              </div>
              <div className="date-owner-row">
                <span className="title mr-5">Date:</span>
                <span className="details">{moment(alert?.createdAt).format('DD-MM-YYYY')}</span>
                <span className="title mr-5">Type:</span>
                <div className="details">{alert?.alertType}</div>
              </div>
              <div className="font-field">Alert Category:</div>
              <div className="view-application-accordion-description">{alert?.alertCategory}</div>
            </div>
          ))
        ) : (
          <div className="no-record-found">Nothing To Show</div>
        )}
        {isAlertModal && (
          <Modal header="Alerts" buttons={alertModalButtons} className="alert-details-modal">
            {!applicationAlertDetailsLoader ? (
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
                        <div
                          className={`f-16 f-bold ${ALERT_TYPE_ROW_ICON[alertDetail?.priority]}`}
                        >
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
      </AccordionItem>
    </>
  );
};
export default ApplicationAlertsAccordion;

ApplicationAlertsAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};
