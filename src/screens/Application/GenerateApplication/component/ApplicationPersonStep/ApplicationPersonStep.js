import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '../../../../../common/Accordion/Accordion';
import PersonIndividualDetail from './personIndividualDetail/PersonIndividualDetail';
import {
  addPersonDetail,
  getApplicationCompanyDropDownData,
} from '../../../redux/ApplicationAction';

const ApplicationPersonStep = () => {
  const dispatch = useDispatch();

  const personState = useSelector(
    ({ application }) => application?.editApplication?.partners ?? []
  );

  const entityType = useSelector(
    ({ application }) => application?.editApplication?.company?.entityType ?? []
  );

  const entityTypeFromCompany = useMemo(() => entityType?.value ?? '', [entityType]);

  useEffect(() => {
    if (
      personState?.length < 1 &&
      ['PARTNERSHIP', 'TRUST', 'SOLE_TRADER'].includes(entityTypeFromCompany)
    ) {
      dispatch(addPersonDetail('individual'));
    }
  }, []);

  useEffect(() => {
    // dispatch(getApplicationFilter());
    dispatch(getApplicationCompanyDropDownData());
  }, []);

  const getAccordionAccordingEntityType = useCallback(
    (person, index) => {
      let itemHeader = 'Director Details';

      switch (entityTypeFromCompany) {
        case 'PARTNERSHIP':
          itemHeader = 'Partner Details';
          break;
        case 'TRUST':
          itemHeader = 'Trustee Details';
          break;
        case 'SOLE_TRADER':
          itemHeader = 'Person Details';
          break;
        default:
          break;
      }
      return (
        <PersonIndividualDetail
          itemHeader={itemHeader}
          index={index}
          entityTypeFromCompany={entityTypeFromCompany}
          activePersonStep={personState?.length}
        />
      );
    },
    [entityTypeFromCompany, personState?.length]
  );

  return (
    <>
      <Accordion>{personState ? personState?.map(getAccordionAccordingEntityType) : ''}</Accordion>
    </>
  );
};

export default ApplicationPersonStep;
