import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import './Stepper.scss';
import Button from '../Button/Button';

const Stepper = props => {
  const { steps, children, className, backClick, nextClick, onChangeIndex, ...restProps } = props;
  const [activeStep, setActiveStep] = useState(0);

  const onClickBackButton = useCallback(() => {
    onChangeIndex(activeStep - 1);
    setActiveStep(prevState => prevState - 1);
    backClick();
  }, [activeStep, setActiveStep, backClick]);

  const onClickNextButton = useCallback(() => {
    if (nextClick()) {
      onChangeIndex(activeStep + 1);
      setActiveStep(prevState => prevState + 1);
    }
  }, [activeStep, setActiveStep, nextClick]);

  return (
    <div className={className} {...restProps}>
      <div className="stepper-container">
        {steps.map((step, index) => (
          <div
            className={`step-container ${activeStep === index && 'active-step'} ${
              index < activeStep && 'done-step'
            }`}
          >
            <span className={`material-icons-round arrow ${index < activeStep && 'done-step'}`}>
              keyboard_arrow_right
            </span>
            <div className="step">
              <span className="material-icons-round">
                {index < activeStep ? 'check_circle' : step.icon}
              </span>
              {step.text}
            </div>
          </div>
        ))}
      </div>
      <div className="step-content">{children}</div>
      <div className="stepper-buttons-row">
        <div>
          {steps[activeStep].text === 'Person' && (
            <Button buttonType="secondary" title="Add Director" />
          )}
        </div>
        <div className="d-flex">
          {activeStep > 0 && (
            <Button
              buttonType="outlined-primary"
              title={`Back to ${steps[activeStep - 1].text}`}
              onClick={onClickBackButton}
            />
          )}
          <Button
            className="ml-15"
            buttonType="primary"
            title={`Save${activeStep !== steps.length - 1 ? ' and Next' : ''}`}
            onClick={onClickNextButton}
          />
        </div>
      </div>
    </div>
  );
};

Stepper.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.array.isRequired,
  backClick: PropTypes.func,
  nextClick: PropTypes.func,
  onChangeIndex: PropTypes.func,
  children: PropTypes.element.isRequired,
};

Stepper.defaultProps = {
  className: '',
  onChangeIndex: () => {},
  backClick: () => {},
  nextClick: () => {},
};

export default Stepper;
