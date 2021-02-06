import React from 'react';
import PropTypes from "prop-types";
import './Checkbox.scss';

const Checkbox = (props) => {
    const {checked, value, ...restProps} = props;
    return (
        <>
            <label className="checkbox-container">{value}
                <input type="checkbox" checked={checked} {...restProps}/>
                    <span className="checkmark"></span>
            </label>
        </>
)
}

Checkbox.propTypes = {
    value: PropTypes.string
}

export default Checkbox;
