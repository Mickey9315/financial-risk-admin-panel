import ApiService from '../../services/api-service/ApiService';
import { BASE_URL } from '../../constants/UrlConstants';

const TableApiService = {
  tableActions: ({ url, id, method, params = {} }) => {
    console.log(`${BASE_URL}${url}/${id}`);
    return ApiService.request({ url: `${BASE_URL}${url}/${id}`, method, params });
  },
};

export default TableApiService;
