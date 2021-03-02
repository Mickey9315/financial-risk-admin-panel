import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientNotesApiService = {
  getClientNotesList: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.NOTES.NOTES_LIST}${id}`, { params }),
  addClientNote: data => ApiService.postData(`${CLIENT_URLS.NOTES.NOTES_LIST}`, data),
  updateClientNote: (id, data) => ApiService.putData(`${CLIENT_URLS.NOTES.NOTES_LIST}${id}`, data),
  deleteClientNote: id => ApiService.deleteData(`${CLIENT_URLS.NOTES.NOTES_LIST}${id}`),
};

export default ClientNotesApiService;
