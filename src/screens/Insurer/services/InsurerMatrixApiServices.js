import ApiService from '../../../services/api-service/ApiService';
import { INSURER_URLS } from '../../../constants/UrlConstants';

const InsurerMatrixApiServices = {
  getInsurerMatrixData: id => ApiService.getData(`${INSURER_URLS.MATRIX.MATRIX_DATA}${id}`),
};

export default InsurerMatrixApiServices;
