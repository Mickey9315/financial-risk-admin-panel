import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import Button from '../../../../common/Button/Button';
import { errorNotification } from '../../../../common/Toast';
import { changeApplicationStatus } from '../../redux/ApplicationAction';

const ApplicationClientReferenceAccordion = props => {
  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );

  const dispatch = useDispatch();
  const { index } = props;

  const [clientReferenceText, setClientReferenceText] = useState('');

  const { clientReference, _id } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);

  const saveClientReference = useCallback(async () => {
    if (!clientReferenceText || clientReferenceText?.toString()?.trim()?.length <= 0) {
      errorNotification('Please Enter Client Reference');
    } else {
      const data = {
        update: 'field',
        clientReference: clientReferenceText,
      };
      await dispatch(changeApplicationStatus(_id, data));
    }
  }, [_id, clientReferenceText]);

  useEffect(() => {
    setClientReferenceText(clientReference);
  }, [clientReference]);

  return (
    <>
      <AccordionItem index={index} header="Client Reference" suffix="expand_more">
        <div className="common-accordion-item-content-box">
          <textarea
            rows={3}
            name="clientReference"
            className="mt-5 w-100"
            placeholder="Enter Client Reference"
            value={clientReferenceText}
            onChange={e => setClientReferenceText(e?.target?.value)}
          />

          <div className="d-flex just-end align-center mt-5">
            <Button
              buttonType="primary"
              className="small-button"
              title="save"
              onClick={saveClientReference}
            />
          </div>
        </div>
      </AccordionItem>
    </>
  );
};

export default React.memo(ApplicationClientReferenceAccordion);

ApplicationClientReferenceAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};
