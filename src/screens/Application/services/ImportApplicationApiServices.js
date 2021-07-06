import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ImportApplicationApiServices = {
  downloadSample: () =>
    ApiService.request({
      url: `${APPLICATION_URLS.IMPORT_APPLICATION_URLS.DOWNLOAD_SAMPLE}`,
      method: 'GET',
      responseType: 'blob',
    }),
  deleteApplicationDump: id =>
    ApiService.deleteData(`${APPLICATION_URLS.IMPORT_APPLICATION_URLS.UPLOAD_DUMP}${id}`),
  uploadApplicationDump: (data, config) =>
    ApiService.postData(APPLICATION_URLS.IMPORT_APPLICATION_URLS.UPLOAD_DUMP, data, config),
  importApplicationSaveAndNext: (id, stepName) =>
    ApiService.putData(
      `${APPLICATION_URLS.IMPORT_APPLICATION_URLS.UPLOAD_DUMP}${id}?stepName=${stepName}`
    ),
};
export default ImportApplicationApiServices;
