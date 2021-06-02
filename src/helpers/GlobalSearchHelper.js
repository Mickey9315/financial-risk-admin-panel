import { errorNotification } from '../common/Toast';
import { setViewInsurerActiveTabIndex } from '../screens/Insurer/redux/InsurerAction';
import { setViewClientActiveTabIndex } from '../screens/Clients/redux/ClientAction';
import { setViewDebtorActiveTabIndex } from '../screens/Debtors/redux/DebtorsAction';
import { setSettingActiveTabIndex } from '../screens/Settings/redux/SettingAction';

const ClientTabMapper = {
  contacts: 0,
  creditLimit: 1,
  application: 2,
  overdues: 3,
  claims: 4,
  tasks: 5,
  policies: 6,
  documents: 7,
  notes: 8,
};
const DebtorsTabMapper = {
  creditLimit: 0,
  stakeHolder: 1,
  application: 2,
  overdues: 3,
  claims: 4,
  tasks: 5,
  documents: 6,
  notes: 7,
  reports: 8,
};

const InsurerTabMapper = {
  policies: 0,
  contacts: 1,
  matrix: 2,
};

const handleSearchWithSubModules = (path, module, isSubModule, subModuleName, history) => {
  if (isSubModule) {
    switch (module) {
      case 'client':
        setViewClientActiveTabIndex(ClientTabMapper?.[subModuleName]);
        break;
      case 'debtor':
        setViewDebtorActiveTabIndex(DebtorsTabMapper?.[subModuleName]);
        break;
      case 'insurer':
        setViewInsurerActiveTabIndex(InsurerTabMapper?.[subModuleName]);
        break;
      case 'setting':
        setSettingActiveTabIndex(1);
        break;
      default:
        break;
    }
  }
  history.push(path);
};

export const handleGlobalSearchSelect = (data, history) => {
  try {
    const { module, _id, isSubModuleTab, subModule } = data;
    switch (module) {
      case 'my-work':
        handleSearchWithSubModules(
          `/my-work/view/${_id}`,
          module,
          isSubModuleTab,
          subModule,
          history
        );
        break;
      case 'application':
        handleSearchWithSubModules(
          `/applications/detail/view/${_id}`,
          module,
          isSubModuleTab,
          subModule,
          history
        );
        break;
      case 'client':
        handleSearchWithSubModules(
          `/clients/client/view/${_id}`,
          module,
          isSubModuleTab,
          subModule,
          history
        );
        break;
      case 'debtor':
        handleSearchWithSubModules(
          `/debtors/debtor/view/${_id}`,
          module,
          isSubModuleTab,
          subModule,
          history
        );
        break;
      case 'insurer':
        handleSearchWithSubModules(
          `/insurer/view/${_id}`,
          module,
          isSubModuleTab,
          subModule,
          history
        );
        break;
      case 'user':
        handleSearchWithSubModules(
          `/users/user/view/${_id}`,
          module,
          isSubModuleTab,
          subModule,
          history
        );
        break;

      default:
        history.push('/dashboard');
    }
  } catch (e) {
    errorNotification(e);
  }
};
