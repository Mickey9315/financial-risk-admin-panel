import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useRef, useState, useEffect } from 'react';

const Select = props => {
  const isFocus = useRef(false);
  const [isInputChanging, setIsInputChanging] = useState(false);
  const {
    className,
    placeholder,
    name,
    options,
    isSearchable,
    value,
    onChange,
    onInputChange,
    isLoadingNeeded,
    isDisabled,
    ...restProps
  } = props;

  const inputChangeEventHandling = e => {
    if (isFocus.current) {
      onInputChange(e);
    }
  };
useEffect(() => {
  if(options) {
    console.log(true);
  } else {
    console.log(false);
  }
},[options])

const temp = _.debounce(inputChangeEventHandling, 300);

const handleInputChange = (e) => {
  setIsInputChanging(true);
  temp(e)
}

console.log({isInputChanging});

  return (
    <ReactSelect
      className={`${className} react-select-container`}
      classNamePrefix="react-select"
      placeholder={placeholder}
      name={name}
      options={options}
      noOptionsMessage={() => isLoadingNeeded ? 'Loading...' : 'No Options'}
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
      onFocus={() => {isFocus.current = true}}
      onBlur={() => {isFocus.current = false}}
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
  isLoadingNeeded: PropTypes.bool
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
  isLoadingNeeded: false
};

export default Select;
