import React, { useCallback, useEffect, useReducer } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';

import AccordionItem from '../../../../../../common/Accordion/AccordionItem';
import Input from '../../../../../../common/Input/Input';
import Checkbox from '../../../../../../common/Checkbox/Checkbox';
import RadioButton from '../../../../../../common/RadioButton/RadioButton';
import {
  changeEditApplicationFieldValue,
  changePersonType,
  getApplicationCompanyDataFromABNOrACN,
  searchApplicationCompanyEntityName,
  updatePersonData,
  updatePersonStepDataOnValueSelected,
} from '../../../../redux/ApplicationAction';
import { DRAWER_ACTIONS } from '../../ApplicationCompanyStep/ApplicationCompanyStep';
import Loader from '../../../../../../common/Loader/Loader';
import ApplicationEntityNameTable from '../../components/ApplicationEntityNameTable/ApplicationEntityNameTable';
import Modal from '../../../../../../common/Modal/Modal';

const drawerInitialState = {
  visible: false,
  data: null,
};
const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
      };
    case DRAWER_ACTIONS.HIDE_DRAWER:
      return { ...drawerInitialState };
    case DRAWER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };

    default:
      return state;
  }
};
const PersonIndividualDetail = ({
  itemHeader,
  hasRadio,
  INPUTS,
  COMPANY_INPUT,
  INDIVIDUAL_INPUT,
  index,
}) => {
  const dispatch = useDispatch();
  const updateSinglePersonState = useCallback(
    (name, value) => {
      dispatch(updatePersonData(index, name, value));
    },
    [index]
  );
  const companyState = useSelector(({ application }) => application.editApplication.companyStep);
  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const entityNameSearchDropDownData = useSelector(
    ({ application }) => application.company.entityNameSearch
  );
  const personStep = useSelector(({ application }) => application.editApplication.personStep);
  // const [viewPartner, setViewPartner] = useState([]);

  const viewApplication = useSelector(({ application }) => application.viewApplicationDetails);
  useEffect(() => {
    const hasAddedApplication = viewApplication?.partners?.some(e => {
      return personStep?.some(f => e?._id === f?._id);
    });
    if (
      viewApplication &&
      viewApplication.partners &&
      viewApplication.partners.length !== 0 &&
      !hasAddedApplication
    ) {
      // setViewPartner(viewApplication.partners);
      dispatch(changeEditApplicationFieldValue('personStep', viewApplication.partners));
    }
  }, [viewApplication]);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateSinglePersonState(name, value);
    },
    [updateSinglePersonState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      updateSinglePersonState(data[0]?.name, data);
    },
    [updateSinglePersonState]
  );
  const updatePersonState = useCallback(data => {
    dispatch(updatePersonStepDataOnValueSelected(index, data));
  }, []);

  const handleRadioButton = e => {
    const partner = e.target.value;
    dispatch(changePersonType(index, partner));
  };

  const handleToggleDropdown = useCallback(
    value =>
      dispatchDrawerState({
        type: DRAWER_ACTIONS.UPDATE_DATA,
        data: {
          visible: value !== undefined ? value : e => !e,
        },
      }),
    [dispatchDrawerState]
  );

  const handleEntityNameSelect = useCallback(
    async data => {
      try {
        const params = { clientId: companyState.client[0].value };
        const response = await getApplicationCompanyDataFromABNOrACN(data.abn, params);
        if (response) {
          updatePersonState(response);
          handleToggleDropdown();
        }
      } catch (err) {
        /**/
      }
      handleToggleDropdown(false);
    },
    [companyState, updatePersonState, handleToggleDropdown]
  );

  const handleEntityNameSearch = useCallback(
    e => {
      if (e.key === 'Enter') {
        dispatchDrawerState({
          type: DRAWER_ACTIONS.SHOW_DRAWER,
          data: null,
        });
        const params = { clientId: companyState.client[0].value };
        dispatch(searchApplicationCompanyEntityName(e.target.value, params));
      }
    },
    [companyState, dispatchDrawerState, updatePersonState]
  );
  const handleSearchTextInputKeyDown = useCallback(
    async e => {
      if (e.key === 'Enter') {
        const params = { clientId: companyState.client[0].value };
        const response = await getApplicationCompanyDataFromABNOrACN(e.target.value, params);

        if (response) {
          updatePersonState(response);
        }
      }
    },
    [companyState, updatePersonState]
  );

  const handleCheckBoxEvent = useCallback(
    e => {
      const checkBoxName = e.target.name;
      const value = e.target.checked;
      updateSinglePersonState(checkBoxName, value);
    },
    [updateSinglePersonState]
  );
  const onChangeDate = useCallback(
    (name, date) => {
      updateSinglePersonState(name, date);
    },
    [updateSinglePersonState]
  );
  const handleEmailChange = useCallback(
    e => {
      const email = e.target.name;
      const { value } = e.target;
      updateSinglePersonState(email, value);
    },
    [updateSinglePersonState]
  );

  const getConfirmationComponentFromType = useCallback(detail => {
    switch (detail.type) {
      case 'text':
        return (
          <>
            <span>{detail.title}</span>
            <span className="detail-value">{detail.value}</span>
          </>
        );
      case 'ifYesText':
        return (
          <>
            <span>{detail.title}</span>
            <span className="long-text">{detail.value}</span>
          </>
        );
      case 'title':
        return (
          <>
            <span className="title">{detail.title}</span>
          </>
        );
      case 'radio':
        return (
          <>
            <span className="radio-title">{detail.title}</span>
            <span className="radio-buttons">
              <RadioButton
                disabled
                id={`${detail.id}-yes`}
                name={detail.name}
                label="Yes"
                value
                checked={detail.value}
              />
              <RadioButton
                disabled
                id={`${detail.id}-no`}
                name={detail.name}
                label="No"
                value={false}
                checked={!detail.value}
              />
            </span>
          </>
        );
      case 'checkbox':
        return (
          <>
            <Checkbox className="grid-checkbox" title={detail.title} />
          </>
        );
      case 'main-title':
        return (
          <>
            <div className="main-title">{detail.title}</div>
          </>
        );
      case 'line':
        return <div className="horizontal-line" />;
      case 'blank':
        return (
          <>
            <div />
            <div />
          </>
        );
      case 'array':
        return detail.data.map(elem => elem.map(f => getConfirmationComponentFromType(f)));
      default:
        return null;
    }
  }, []);
  console.log('personStep[index].isDisabled', personStep[index].isDisabled);
  const getComponentFromType = useCallback(
    input => {
      let component = null;
      switch (input.type) {
        case 'text':
          component = (
            <Input
              type="text"
              placeholder={input.placeholder}
              name={input.name}
              value={personStep[index][input.name]}
              onChange={handleTextInputChange}
              disabled={personStep[index].isDisabled || false}
            />
          );
          break;
        case 'email':
          component = (
            <Input
              type="email"
              placeholder={input.placeholder}
              name={input.name}
              onChange={handleEmailChange}
              disabled={personStep[index].isDisabled || false}
            />
          );
          break;
        case 'search':
          component = (
            <Input
              type="text"
              name={input.name}
              placeholder={input.placeholder}
              value={personStep[index][input.name]}
              onKeyDown={handleSearchTextInputKeyDown}
              disabled={personStep[index].isDisabled || false}
            />
          );
          break;
        case 'select':
          component = (
            <ReactSelect
              placeholder={input.placeholder}
              name={input.name}
              options={input.data}
              values={
                (personStep && personStep[index][input.name] && personStep[index][input.name]) || []
              }
              searchable={false}
              onChange={handleSelectInputChange}
              disabled={personStep[index].isDisabled || false}
            />
          );
          break;
        case 'checkbox':
          component = (
            <Checkbox
              className="grid-checkbox"
              name={input.name}
              title={input.label}
              onChange={handleCheckBoxEvent}
              disabled={personStep[index].isDisabled || false}
            />
          );
          break;
        case 'entityName':
          component = (
            <Input
              type="text"
              placeholder={input.placeholder}
              onKeyDown={handleEntityNameSearch}
              disabled={personStep[index].isDisabled || false}
            />
          );
          break;
        case 'radio':
          component = (
            <div className="radio-container">
              {input.data.map(radio => (
                <RadioButton
                  className="mb-5"
                  id={radio.id + index.toString()}
                  name={radio.name}
                  value={radio.value}
                  checked={personStep[index].type === radio.value}
                  label={radio.label}
                  onChange={handleRadioButton}
                  disabled={personStep[index].isDisabled || false}
                />
              ))}
            </div>
          );
          break;
        case 'main-title':
          component = <div className="main-title">{input.label}</div>;
          break;
        case 'blank':
          component = (
            <>
              <span />
              <span />
            </>
          );
          break;
        case 'date':
          component = (
            <div className="date-picker-container">
              <DatePicker
                placeholderText={input.placeholder}
                value={
                  personStep[index].dateOfBirth
                    ? moment(personStep[index].dateOfBirth).format('MM/DD/YYYY')
                    : ''
                }
                onChange={date => onChangeDate(input.name, moment(date).format('MM/DD/YYYY'))}
                disabled={personStep[index].isDisabled || false}
              />
              <span className="material-icons-round">event_available</span>
            </div>
          );
          break;
        default:
          return null;
      }

      /* if (viewPartner) {
        return component;
      } */

      const finalComponent = (
        <>
          {component}
          {personStep && personStep[index] ? (
            <div className="ui-state-error">
              {personStep && personStep[index] && personStep[index].errors
                ? personStep[index]?.errors[input?.name]
                : ''}
            </div>
          ) : (
            ''
          )}
        </>
      );

      return (
        <>
          {!['main-title', 'checkbox', 'blank', 'radio'].includes(input.type) && (
            <span>{input.label}</span>
          )}
          {['main-title', 'radio', 'blank', 'checkbox'].includes(input.type) ? (
            finalComponent
          ) : (
            <div>{finalComponent}</div>
          )}
        </>
      );
    },
    [
      INPUTS,
      COMPANY_INPUT,
      INDIVIDUAL_INPUT,
      index,
      personStep,
      onChangeDate,
      handleEntityNameSearch,
      handleCheckBoxEvent,
      handleSelectInputChange,
      handleEmailChange,
      handleTextInputChange,
      viewApplication.partners,
    ]
  );

  return (
    <>
      {drawerState.visible && (
        <Modal
          hideModal={handleToggleDropdown}
          className="application-entity-name-modal"
          header="Search Results"
          closeIcon="cancel"
          closeClassName="font-secondary"
        >
          {entityNameSearchDropDownData.isLoading ? (
            <Loader />
          ) : (
            <ApplicationEntityNameTable
              data={entityNameSearchDropDownData.data}
              handleEntityNameSelect={handleEntityNameSelect}
            />
          )}
        </Modal>
      )}

      {/*  {viewPartner && viewPartner.length > 0 && (
        <AccordionItem
          className="application-person-step-accordion"
          header={itemHeader || 'Director Details'}
          prefix="expand_more"
          suffix="delete_outline"
          suffixClass="material-icons-round font-danger cursor-pointer"
          suffixClick={e => e.stopPropagation()}
        >
          <div className="application-person-step-accordion-item">
            {VIEW_STEP_DETAILS.map(getConfirmationComponentFromType)}
          </div>
        </AccordionItem>
      )} */}

      <AccordionItem
        className="application-person-step-accordion"
        header={itemHeader || 'Director Details'}
        prefix="expand_more"
        suffix="delete_outline"
        suffixClass="material-icons-round font-danger cursor-pointer"
        suffixClick={e => e.stopPropagation()}
      >
        <div className="application-person-step-accordion-item">
          {hasRadio && INPUTS.map(getComponentFromType)}
          {personStep[index] &&
            (hasRadio && personStep[index].type === 'company'
              ? COMPANY_INPUT.map(getComponentFromType)
              : INDIVIDUAL_INPUT.map(getComponentFromType))}
        </div>
      </AccordionItem>
    </>
  );
};
PersonIndividualDetail.propTypes = {
  itemHeader: PropTypes.string.isRequired,
  hasRadio: PropTypes.bool,
  INPUTS: PropTypes.arrayOf(PropTypes.object).isRequired,
  COMPANY_INPUT: PropTypes.arrayOf(PropTypes.object).isRequired,
  INDIVIDUAL_INPUT: PropTypes.arrayOf(PropTypes.object).isRequired,
  index: PropTypes.number.isRequired,
};
PersonIndividualDetail.defaultProps = {
  hasRadio: false,
};

export default PersonIndividualDetail;
