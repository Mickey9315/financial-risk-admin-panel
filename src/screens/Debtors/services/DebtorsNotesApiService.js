import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorsNotesApiService = {
  getDebtorsNotesList: (id, params) => ApiService.getData(`${DEBTORS_URLS.NOTES.NOTES_LIST}${id}`, { params }),
  addDebtorsNote: data => ApiService.postData(`${DEBTORS_URLS.NOTES.NOTES_LIST}`, data),
  updateDebtorsNote: (id, data) => ApiService.putData(`${DEBTORS_URLS.NOTES.NOTES_LIST}${id}`, data),
  deleteDebtorsNote: id => ApiService.deleteData(`${DEBTORS_URLS.NOTES.NOTES_LIST}${id}`),
};

export default DebtorsNotesApiService;
