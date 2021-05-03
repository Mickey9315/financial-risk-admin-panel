import React, { useCallback } from 'react';
import './ApplicationCreditLimitStep.scss';
import { useDispatch, useSelector } from 'react-redux';
import RadioButton from '../../../../../common/RadioButton/RadioButton';
import Input from '../../../../../common/Input/Input';
import { updateEditApplicationField } from '../../../redux/ApplicationAction';

const ApplicationCreditLimitStep = () => {
  const dispatch = useDispatch();

  const {
    isExtendedPaymentTerms,
    extendedPaymentTermsDetails,
    isPassedOverdueAmount,
    passedOverdueDetails,
    creditLimit,
    note,
    errors,
  } = useSelector(({ application }) => application.editApplication?.creditLimit ?? {});

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

      <div className="credit-limit-amount">
        <span className="font-primary mr-15">Amount*</span>
        <Input
          type="text"
          name="creditLimit"
          placeholder="$00000"
          value={creditLimit}
          onChange={handleInputChange}
        />
      </div>
      {errors?.creditLimit && <div className="ui-state-error">{errors?.creditLimit}</div>}
      <div>
        <div className="f-14 font-primary mb-10">
          Any extended payment terms outside your policy standard terms? *
        </div>
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
          checked={!isExtendedPaymentTerms}
          onChange={handleRadioChange}
        />
        {errors?.isExtendedPaymentTerms && (
          <div className="ui-state-error">{errors?.isExtendedPaymentTerms}</div>
        )}
      </div>
      <div className="if-yes-row">
        <span className="font-primary mr-15">If yes, please provide details</span>
        <Input
          type="text"
          placeholder="Details"
          name="extendedPaymentTermsDetails"
          value={isExtendedPaymentTerms ? extendedPaymentTermsDetails : ''}
          disabled={!isExtendedPaymentTerms}
          onChange={handleInputChange}
        />
        {errors?.extendedPaymentTermsDetails && (
          <div className="ui-state-error">{errors?.extendedPaymentTermsDetails}</div>
        )}
      </div>

      <div>
        <div className="f-14 font-primary mb-10">
          Any overdue amounts passed your maximum extension period / Credit period? *
        </div>
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
          checked={!isPassedOverdueAmount}
          onChange={handleRadioChange}
        />
        {errors?.isPassedOverdueAmount && (
          <div className="ui-state-error">{errors?.isPassedOverdueAmount}</div>
        )}
      </div>

      <div className="if-yes-row">
        <span className="font-primary mr-15">If yes, please provide details</span>
        <Input
          type="text"
          placeholder="Details"
          name="passedOverdueDetails"
          value={isPassedOverdueAmount ? passedOverdueDetails : ''}
          disabled={!isPassedOverdueAmount}
          onChange={handleInputChange}
        />
        {errors?.passedOverdueDetails && (
          <div className="ui-state-error">{errors?.passedOverdueDetails}</div>
        )}
      </div>
      <div className="if-yes-row">
        <span className="font-primary mr-15">Note</span>
        <textarea
          rows={5}
          name="note"
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
