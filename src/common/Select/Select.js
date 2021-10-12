import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useState } from 'react';

const Select = props => {
  const [IsFocus, setIsFocus] = useState(false);
  const {
    className,
    placeholder,
    name,
    options,
    isSearchable,
    value,
    onChange,
    onInputChange,
    isDisabled,
    ...restProps
  } = props;

  const inputChangeEventHandling = e => {
    if (IsFocus) {
      onInputChange(e);
    }
  };

  const handleInputChange = _.debounce(inputChangeEventHandling, 800);

  return (
    <ReactSelect
      className={`${className} react-select-container`}
      classNamePrefix="react-select"
      placeholder={placeholder}
      name={name}
      options={options}
      isSearchable={isSearchable}
      value={value}
      onChange={onChange}
      onInputChange={handleInputChange}
      isDisabled={isDisabled}
      color={restProps?.color}
      dropdownHandle={restProps?.dropdownHandle}
      keepSelectedInList={restProps?.keepSelectedInList}
      isMulti={restProps?.isMulti}
      menuPlacement={restProps?.menuPlacement}
      dropdownPosition={restProps?.dropdownPosition}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
    />
  );
};

Select.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  isSearchable: PropTypes.bool,
  value: PropTypes.object,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  isDisabled: PropTypes.bool,
};

Select.defaultProps = {
  className: '',
  placeholder: 'Select',
  name: '',
  options: [],
  isSearchable: true,
  value: [],
  onChange: () => {},
  onInputChange: () => {},
  isDisabled: false,
};

export default Select;
