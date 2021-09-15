import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export const useModulePrivileges = moduleName => {
  const userPrivilegesData = useSelector(({ userPrivileges }) => userPrivileges);

  const foundModule = useMemo(
    () => userPrivilegesData.find(module => module.name === moduleName),
    [userPrivilegesData, moduleName]
  );

  const access = {
    hasWriteAccess: false,
    hasReadAccess: false,
    hasFullAccess: false,
  };

  if (foundModule && foundModule.accessTypes) {
    foundModule.accessTypes.forEach(e => {
      switch (e) {
        case 'read':
          access.hasReadAccess = true;
          break;
        case 'write':
          access.hasWriteAccess = true;
          break;
        case 'full-access':
          access.hasFullAccess = true;
          break;
        default:
          break;
      }
    });
  }

  return access;
};
