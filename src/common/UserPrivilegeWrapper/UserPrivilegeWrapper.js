import './SideMenu.scss';
import PropTypes from 'prop-types';
import { useModulePrivileges } from '../../hooks/userPrivileges/useModulePrivilegesHook';

const UserPrivilegeWrapper = props => {
  const { moduleName, children } = props;

  const { hasWriteAccess, hasFullAccess } = useModulePrivileges(moduleName);

  if (hasWriteAccess || hasFullAccess) {
    return children;
  }

  return null;
};

UserPrivilegeWrapper.propTypes = {
  moduleName: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default UserPrivilegeWrapper;
