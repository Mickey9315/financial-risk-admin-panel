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
  stakeholder: 1,
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

const handleSearchWithSubModules = (path, module, hasSubModule, subModule, history) => {
  if (hasSubModule) {
    switch (module) {
      case 'client':
        setViewClientActiveTabIndex(ClientTabMapper?.[subModule]);
        break;
      case 'debtors':
        setViewDebtorActiveTabIndex(DebtorsTabMapper?.[subModule]);
        break;
      case 'insurer':
        setViewInsurerActiveTabIndex(InsurerTabMapper?.[subModule]);
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

export const handleGlobalSearchSelect = (history, module, id, hasSubModule, subModule, status) => {
  try {
    switch (module) {
      case 'task':
        handleSearchWithSubModules(`/my-work/view/${id}`, module, hasSubModule, subModule, history);
        break;
      case 'application':
        if (status === 'DRAFT') history.push(`/applications/generate/?applicationId=${id}`);
        else history.push(`/applications/detail/view/${id}`);
        break;
      case 'client':
        handleSearchWithSubModules(
          `/clients/client/view/${id}`,
          module,
          hasSubModule,
          subModule,
          history
        );
        break;
      case 'debtors':
        handleSearchWithSubModules(
          `/debtors/debtor/view/${id}`,
          module,
          hasSubModule,
          subModule,
          history
        );
        break;
      case 'insurer':
        handleSearchWithSubModules(`/insurer/view/${id}`, module, hasSubModule, subModule, history);
        break;
      case 'user':
        handleSearchWithSubModules(
          `/users/user/view/${id}`,
          module,
          hasSubModule,
          subModule,
          history
        );
        break;
      case 'claim':
        handleSearchWithSubModules(`/claims/view/${id}`, module, hasSubModule, subModule, history);
        break;

      default:
        history.push('/dashboard');
    }
  } catch (e) {
    errorNotification(e);
  }
};
