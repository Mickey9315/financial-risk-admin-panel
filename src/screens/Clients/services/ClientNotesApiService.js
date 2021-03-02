import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientNotesApiService = {
  getClientNotesList: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.NOTES.NOTES_LIST}${id}`, { params }),
};

export default ClientNotesApiService;
