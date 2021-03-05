import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Stepper.scss';

const Stepper = props => {
  const { steps, children, className, ...restProps } = props;
  const [activeStep, setActiveStep] = useState(0);
  return (
    <div className={className} {...restProps}>
      <div className="stepper-container">
        {steps.map((step, index) => (
          <div
            className={`step-container ${activeStep === index && 'active-step'}`}
            onClick={() => setActiveStep(index)}
          >
            <div className="step">
              <span className="material-icons-round">{step.icon}</span>
              {step.text}
            </div>
            <span className="material-icons-round arrow">keyboard_arrow_right</span>
          </div>
        ))}
      </div>
      <div className="step-content">{children}</div>
    </div>
  );
};

Stepper.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.array.isRequired,
  children: PropTypes.element.isRequired,
};

Stepper.defaultProps = {
  className: '',
};

export default Stepper;
