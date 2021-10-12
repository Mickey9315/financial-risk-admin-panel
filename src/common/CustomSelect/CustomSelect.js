import React, { useCallback, useEffect, useRef, useState } from 'react';
import Tooltip from 'rc-tooltip';
import PropTypes from 'prop-types';
import Input from '../Input/Input';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';

const CustomSelect = props => {
  const {
    options,
    placeholder,
    className,
    onChangeCustomSelect,
    onSearchChange,
    value,
    ...restProps
  } = props;
  const selectClassName = `custom-select ${className}`;
  const customDropdownRef = useRef();
  const [isOpenCustomSelect, setIsOpenCustomSelect] = useState(false);
  const [selectedList, setSelectedList] = useState(value || []);
  const [notSelectedList, setNotSelectedList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedText, setSearchedText] = useState('');
  const [inputVal, setInputVal] = useState('');

  const onItemSelection = useCallback(
    clickedItem => {
      setSelectedList([...selectedList, clickedItem]);
    },
    [selectedList, setSelectedList]
  );

  const onItemUnselect = useCallback(
    clickedItem => {
      setSelectedList(selectedList?.filter(item => item?.value !== clickedItem?.value));
    },
    [selectedList, setSelectedList]
  );
  useOnClickOutside(customDropdownRef, () => {
    setIsOpenCustomSelect(false);
  });

  const onSearchCustomSelect = useCallback(
    e => {
      setSearchedText(e?.target?.value);
      onSearchChange(e?.target?.value);
    },
    [isSearching, onSearchChange, options]
  );

  useEffect(() => {
    const selectedItems = selectedList.map(item => item.value);
    setNotSelectedList(
      options?.filter(
        item =>
          !selectedItems.includes(item.value) &&
          item.label.toLowerCase().includes(searchedText.toString().toLowerCase())
      )
    );
  }, [selectedList, searchedText, options]);

  useEffect(() => {
    if (selectedList !== value) onChangeCustomSelect(selectedList);
  }, [selectedList]);

  useEffect(() => {
    if (isSearching) setInputVal(searchedText);
    else {
      setInputVal((selectedList.length > 0 && selectedList[0].label) || '');
    }
  }, [selectedList, searchedText, isSearching]);

  return (
    <>
      <div className={selectClassName} {...restProps}>
        <div className="custom-select__control" onClick={() => setIsOpenCustomSelect(e => !e)}>
          <Input
            type="text"
            value={inputVal}
            placeholder={placeholder}
            onChange={onSearchCustomSelect}
            onBlur={() => {
              setIsSearching(false);
            }}
            onFocus={() => {
              setIsSearching(true);
              setInputVal('');
            }}
          />
          {selectedList.length > 1 && (
            <Tooltip
              overlayClassName="tooltip-top-class"
              overlay={
                <span>
                  {selectedList
                    ?.filter((record, index) => index !== 0)
                    .map(record => record.label)
                    .join(', ')}
                </span>
              }
              placement="topLeft"
            >
              <div className="more-text">+{selectedList.length - 1} more</div>
            </Tooltip>
          )}
          <span className={`material-icons-round ${isOpenCustomSelect && 'font-field'}`}>
            expand_more
          </span>
        </div>
        <div
          ref={customDropdownRef}
          className={`custom-select-dropdown ${
            isOpenCustomSelect && 'active-custom-select-dropdown'
          }`}
        >
          {selectedList?.length > 0 || notSelectedList?.length > 0 ? (
            <>
              <ul className="selected-list">
                {selectedList?.map(selectedItem => (
                  <li onClick={() => onItemUnselect(selectedItem)}>
                    <>{selectedItem?.label || ''}</>
                    <span className="material-icons-round">task_alt</span>
                  </li>
                ))}
              </ul>
              <ul>
                {notSelectedList?.map(unselectedItem => (
                  <li onClick={() => onItemSelection(unselectedItem)}>{unselectedItem?.label}</li>
                ))}
              </ul>
            </>
          ) : (
            <div className="no-option-text">No options</div>
          )}
        </div>
      </div>
    </>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChangeCustomSelect: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.array.isRequired,
  onSearchChange: PropTypes.string,
};

CustomSelect.defaultProps = {
  className: 'custom-select ',
  onChangeCustomSelect: () => {},
  onSearchChange: () => {},
};

export default CustomSelect;
