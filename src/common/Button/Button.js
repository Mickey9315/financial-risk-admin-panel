import React from 'react';
import PropTypes from 'prop-types';
import './Button.scss'

const Button = (props) => {
    const {title, buttonType, className, ...restProps} = props;
    const buttonClass = `button ${buttonType}-button ${className}`

    return (
        <button type="button"
                className={buttonClass}
                {...restProps}>
            {title}
        </button>
    )
}

Button.propTypes = {
    title:PropTypes.func.isRequired,
    buttonType: PropTypes.oneOf(['primary', 'secondary', 'outlined-primary', 'outlined-secondary']),
    className:PropTypes.string,
}
export default Button
