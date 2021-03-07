import React from 'react';
import './ApplicationCreditLimitStep.scss';
import RadioButton from '../../../../../common/RadioButton/RadioButton';
import Input from '../../../../../common/Input/Input';

const ApplicationCreditLimitStep = () => {
  return (
    <>
      <div className="f-14 font-primary mb-10">
        Any extended payment terms outside your policy standard terms? *
      </div>
      <RadioButton id="any-extended-pay-yes" label="Yes" />
      <RadioButton id="any-extended-pay-no" label="No" />

      <div className="if-yes-row">
        <span className="font-primary mr-15">If yes, please provide details</span>
        <Input type="text" placeholder="Details" />
      </div>

      <div className="f-14 font-primary mb-10">
        Any overdue amounts passed your maximum extension period / Credit period? *
      </div>
      <RadioButton id="passed-max-period-yes" label="Yes" />
      <RadioButton id="passed-max-period-no" label="No" />

      <div className="if-yes-row">
        <span className="font-primary mr-15">If yes, please provide details</span>
        <Input type="text" placeholder="Details" />
      </div>

      <div className="f-14 font-secondary mb-10">
        Credit Limit Required covering 3 months of sales
      </div>

      <div className="credit-limit-amount">
        <span className="font-primary mr-15">Amount*</span>
        <Input type="text" placeholder="$00000" />
      </div>
    </>
  );
};

export default ApplicationCreditLimitStep;
