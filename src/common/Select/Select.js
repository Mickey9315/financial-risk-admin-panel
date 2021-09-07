import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Select = props => {
  const {
    placeholder,
    name,
    options,
    isSearchable,
    value,
    onChange,
    onInputChange,
    isDisabled,
  } = props;

  const handleInputChange = _.debounce(onInputChange, 800);

  return (
    <ReactSelect
      className="react-select-container"
      classNamePrefix="react-select"
      placeholder={placeholder}
      name={name}
      options={options}
      isSearchable={isSearchable}
      value={value}
      onChange={onChange}
      onInputChange={handleInputChange}
      isDisabled={isDisabled}
    />
  );
};

Select.propTypes = {
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
  placeholder: 'Select',
  name: '',
  options: [],
  isSearchable: true,
  value: {},
  onChange: () => {},
  onInputChange: () => {},
  isDisabled: false,
};

export default Select;
