import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../Input/Input';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';

const CustomSelect = props => {
  const { options, placeholder, className, onChangeCustomSelect, ...restProps } = props;
  const selectClassName = `custom-select ${className}`;
  const customDropdownRef = useRef();
  const [isOpenCustomSelect, setIsOpenCustomSelect] = useState(false);
  const initialVal = [];
  const [selectedList, setSelectedList] = useState(initialVal);
  const [notSelectedList, setNotSelectedList] = useState(options);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedText, setSearchedText] = useState('');

  const onClientSelection = useCallback(
    clickedItem => {
      setSelectedList([...selectedList, clickedItem]);
      setNotSelectedList(notSelectedList?.filter(item => item?._id !== clickedItem?._id));
    },
    [selectedList, notSelectedList, setSelectedList, setSelectedList]
  );

  const onItemUnselect = useCallback(
    clickedItem => {
      setSelectedList(selectedList?.filter(item => item?._id !== clickedItem?._id));
      setNotSelectedList([...notSelectedList, clickedItem]);
    },
    [selectedList, notSelectedList, setSelectedList, setNotSelectedList]
  );
  useOnClickOutside(customDropdownRef, () => setIsOpenCustomSelect(false));

  const onSearchCustomSelect = useCallback(e => {
    setIsSearching(true);
    setSearchedText(e?.target?.value);
  }, []);

  useEffect(() => {
    if (isSearching && searchedText?.toString()?.trim()?.length > 0) {
      const foundClients = notSelectedList?.filter(client =>
        client.name.toLowerCase().includes(searchedText.toString().toLowerCase())
      );
      setNotSelectedList(foundClients);
    }
  }, [searchedText, setNotSelectedList]);

  useEffect(() => {
    setNotSelectedList(options);
  }, [options]);

  useEffect(() => {
    if (selectedList !== initialVal) onChangeCustomSelect(selectedList);
  }, [selectedList]);

  return (
    <>
      <div className={selectClassName} {...restProps}>
        <div className="custom-select__control" onClick={() => setIsOpenCustomSelect(e => !e)}>
          <Input
            type="text"
            value={
              // eslint-disable-next-line no-nested-ternary
              !isSearching ? (selectedList.length > 0 ? selectedList[0].name : '') : searchedText
            }
            placeholder={placeholder}
            onChange={onSearchCustomSelect}
            onBlur={() => {
              setIsSearching(false);
            }}
          />
          {selectedList.length > 1 && (
            <div className="more-text">+{selectedList.length - 1} more</div>
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
          <div>
            <ul className="selected-list">
              {selectedList?.map(selectedItem => (
                <li onClick={() => onItemUnselect(selectedItem)}>
                  <>{selectedItem?.name || ''}</>
                  <span className="material-icons-round">task_alt</span>
                </li>
              ))}
            </ul>
            <ul>
              {notSelectedList?.map(unselectedItem => (
                <li onClick={() => onClientSelection(unselectedItem)}>{unselectedItem?.name}</li>
              ))}
            </ul>
          </div>
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
};

CustomSelect.defaultProps = {
  className: 'custom-select ',
  onChangeCustomSelect: () => {},
};

export default CustomSelect;
