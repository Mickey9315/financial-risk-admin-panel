import { NUMBER_REGEX } from '../../../constants/RegexConstants';
import { addClaim, handleClaimChange } from '../redux/ClaimsAction';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';

export const addClaimsValidations = async (dispatch, history, data) => {
  let validated = true;
  const errors = {};
  let preparedData = {};

  if (!data.accountid || data?.accountid?.length <= 0) {
    validated = false;
    errors.accountid = 'Please select client name';
  }

  if (!data.name || data?.name?.toString()?.trim().length <= 0) {
    validated = false;
    errors.name = 'Please enter claim name';
  }

  if (data?.grossdebtamount && !NUMBER_REGEX.test(data?.grossdebtamount)) {
    validated = false;
    errors.grossdebtamount = 'Amount should be number';
  }

  if (data?.repaymentplanamount && !NUMBER_REGEX.test(data?.repaymentplanamount)) {
    validated = false;
    errors.repaymentplanamount = 'Amount should be number';
  }

  if (data?.instalmentamounts && !NUMBER_REGEX.test(data?.instalmentamounts)) {
    validated = false;
    errors.instalmentamounts = 'Amount should be number';
  }

  if (data?.reimbursementspaid && !NUMBER_REGEX.test(data?.reimbursementspaid)) {
    validated = false;
    errors.reimbursementspaid = 'Amount should be number';
  }

  const {
    accountid,
    name,
    notifiedofcase,
    claimsinforequested,
    claimsinforeviewed,
    datesubmittedtouw,
    podreceived,
    podsenttouw,
    codrequested,
    codreceived,
    grossdebtamount,
    amountpaid,
    receivedlolfromuw,
    claimpaidbyuw,
    reimbursementrequired,
    reimbursementrequested,
    reimbursementreceived,
    description,
    tradinghistory,
    dljustification,
    underwriter,
    stage,
    sector,
    reimbursementspaid,
    repaymentplanamount,
    dateofoldestinvoice,
    instalmentamounts,
    frequency,
    claimsmanager,
    repaymentplanlength,
  } = data;

  preparedData = {
    accountid: accountid?.value,
    name,
    notifiedofcase,
    claimsinforequested: claimsinforequested ?? false,
    claimsinforeviewed: claimsinforeviewed ?? false,
    datesubmittedtouw,
    podreceived: podreceived?.value,
    podsenttouw,
    codrequested,
    codreceived,
    grossdebtamount: grossdebtamount ? parseInt(grossdebtamount, 10) : undefined,
    amountpaid: amountpaid ? parseInt(amountpaid, 10) : undefined,
    receivedlolfromuw,
    claimpaidbyuw,
    reimbursementrequired: reimbursementrequired ?? false,
    reimbursementrequested: reimbursementrequested?.value,
    reimbursementreceived,
    description,
    tradinghistory: tradinghistory ?? false,
    dljustification: dljustification?.value,
    underwriter: underwriter?.value,
    stage: stage?.value,
    sector: sector?.value,
    reimbursementspaid: reimbursementspaid ? parseInt(reimbursementspaid, 10) : undefined,
    repaymentplanamount: repaymentplanamount ? parseInt(repaymentplanamount, 10) : undefined,
    dateofoldestinvoice,
    instalmentamounts: instalmentamounts ? parseInt(instalmentamounts, 10) : undefined,
    frequency,
    claimsmanager: claimsmanager?.value?.toString(),
    repaymentplanlength,
  };

  if (validated) {
    const finalData = { ...preparedData };
    try {
      const response = await dispatch(addClaim(finalData));
      if (response) {
        history.replace(`/claims/view/${response}`);
      }
    } catch (e) {
      displayErrors(e);
    }
  } else {
    dispatch(handleClaimChange('errors', errors));
  }
};
