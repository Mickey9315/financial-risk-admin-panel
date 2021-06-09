import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RadioButton from '../../../../../common/RadioButton/RadioButton';
import Input from '../../../../../common/Input/Input';
import { updateEditApplicationField } from '../../../redux/ApplicationAction';
import { NumberCommaSeparator } from '../../../../../helpers/NumberCommaSeparator';

const ApplicationCreditLimitStep = () => {
  const dispatch = useDispatch();

  const {
    isExtendedPaymentTerms,
    extendedPaymentTermsDetails,
    isPassedOverdueAmount,
    passedOverdueDetails,
    creditLimit,
    outstandingAmount,
    ordersOnHand,
    note,
    errors,
  } = useSelector(({ application }) => application?.editApplication?.creditLimit ?? {});

  const updateSingleCompanyState = useCallback((name, value) => {
    dispatch(updateEditApplicationField('creditLimit', name, value));
  }, []);

  const handleInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateSingleCompanyState(name, value);
    },
    [updateSingleCompanyState]
  );

  const handleCurrencyChange = useCallback(
    e => {
      const { name, value } = e.target;
      const updatedVal = value?.toString()?.replaceAll(',', '');
      updateSingleCompanyState(name, parseInt(updatedVal, 10));
    },
    [updateSingleCompanyState]
  );

  const handleRadioChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateSingleCompanyState(name, value === 'yes');
    },
    [updateSingleCompanyState]
  );

  return (
    <>
      <div className="f-14 font-secondary mb-10">
        Credit Limit Required covering 3 months of sales
      </div>
      <div className="mb-15">
        <span className="f-14 font-primary">Credit Limit Amount*</span>
        <div>
          <Input
            type="text"
            name="creditLimit"
            placeholder="$00000"
            value={creditLimit ? NumberCommaSeparator(creditLimit) : ''}
            borderClass="mt-5"
            onChange={handleCurrencyChange}
          />
          {errors?.creditLimit && <div className="ui-state-error">{errors?.creditLimit}</div>}
        </div>
      </div>
      <div className="application-credit-limits-grid">
        <div>
          <span className="f-14 font-primary mb-10">Outstanding Amount</span>
          <div>
            <Input
              type="text"
              name="outstandingAmount"
              placeholder="$00000"
              borderClass="mt-5"
              value={outstandingAmount ? NumberCommaSeparator(outstandingAmount) : ''}
              onChange={handleCurrencyChange}
            />

            {errors?.outstandingAmount && (
              <div className="ui-state-error">{errors?.outstandingAmount}</div>
            )}
          </div>
        </div>
        <div>
          <span className="f-14 font-primary">Orders on hand</span>
          <div>
            <Input
              type="text"
              name="ordersOnHand"
              placeholder="$00000"
              value={ordersOnHand ? NumberCommaSeparator(ordersOnHand) : ''}
              borderClass="mt-5"
              onChange={handleCurrencyChange}
            />
            {errors?.ordersOnHand && <div className="ui-state-error">{errors?.ordersOnHand}</div>}
          </div>
        </div>

        <div>
          <div className="f-14 font-primary mb-10">
            Any extended payment terms outside your policy standard terms?*
          </div>
          <div className="d-flex align-center">
            <RadioButton
              id="any-extended-pay-yes"
              name="isExtendedPaymentTerms"
              label="Yes"
              value="yes"
              checked={isExtendedPaymentTerms}
              onChange={handleRadioChange}
            />
            <RadioButton
              id="any-extended-pay-no"
              name="isExtendedPaymentTerms"
              label="No"
              value="no"
              className="ml-10"
              checked={!isExtendedPaymentTerms}
              onChange={handleRadioChange}
            />
            {errors?.isExtendedPaymentTerms && (
              <div className="ui-state-error">{errors?.isExtendedPaymentTerms}</div>
            )}
          </div>
        </div>

        <div>
          <div className="f-14 font-primary mb-10">
            Any overdue amounts passed your maximum extension period / Credit period?*
          </div>
          <div className="d-flex align-center">
            <RadioButton
              id="passed-max-period-yes"
              name="isPassedOverdueAmount"
              label="Yes"
              value="yes"
              checked={isPassedOverdueAmount}
              onChange={handleRadioChange}
            />
            <RadioButton
              id="passed-max-period-no"
              name="isPassedOverdueAmount"
              label="No"
              value="no"
              className="ml-10"
              checked={!isPassedOverdueAmount}
              onChange={handleRadioChange}
            />
            {errors?.isPassedOverdueAmount && (
              <div className="ui-state-error">{errors?.isPassedOverdueAmount}</div>
            )}
          </div>
        </div>

        <div className="if-yes-row">
          <span className="f-14 font-primary">If yes, please provide details</span>
          <textarea
            rows={3}
            placeholder="Details"
            className="mt-5"
            name="extendedPaymentTermsDetails"
            value={isExtendedPaymentTerms ? extendedPaymentTermsDetails : ''}
            disabled={!isExtendedPaymentTerms}
            onChange={handleInputChange}
          />
          {errors?.extendedPaymentTermsDetails && (
            <div className="ui-state-error">{errors?.extendedPaymentTermsDetails}</div>
          )}
        </div>
        <div className="if-yes-row">
          <span className="f-14 font-primary">If yes, please provide details</span>
          <textarea
            rows={3}
            placeholder="Details"
            name="passedOverdueDetails"
            className="mt-5"
            value={isPassedOverdueAmount ? passedOverdueDetails : ''}
            disabled={!isPassedOverdueAmount}
            onChange={handleInputChange}
          />
          {errors?.passedOverdueDetails && (
            <div className="ui-state-error">{errors?.passedOverdueDetails}</div>
          )}
        </div>
      </div>

      <div className="credit-limits-note mt-15">
        <span className="font-primary">Note</span>
        <textarea
          rows={5}
          name="note"
          className="mt-5"
          onChange={handleInputChange}
          placeholder="Note details here"
          value={note}
        />
        {errors?.note && <div className="ui-state-error">{errors?.note}</div>}
      </div>
    </>
  );
};

export default ApplicationCreditLimitStep;
