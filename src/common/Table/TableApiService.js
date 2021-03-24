import ApiService from '../../services/api-service/ApiService';
import { BASE_URL } from '../../constants/UrlConstants';

const TableApiService = {
  tableActions: ({ url, id, method, params = {}, data }) =>
    ApiService.request({ url: `${BASE_URL}${url}/${id}`, method, params, data }),
  viewDocument: ({ url, id, method }) =>
    ApiService.request({ url: `${BASE_URL}${url}${id}`, method }),
};

export default TableApiService;
