import ApiService from '../../../services/api-service/ApiService';
import { MY_WORK_URL } from '../../../constants/UrlConstants';

const MyWorkApiServices = {
  getTaskListData: params => ApiService.getData(MY_WORK_URL.TASK.TASK_LIST_URL, { params }),
};
export default MyWorkApiServices;
