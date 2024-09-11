import axios from 'axios';

const RequestInterceptor = async (config: any) => {

  config.headers.ContentType = 'application/json';
  return config;
};

const TeddyApi = axios.create({
  baseURL: 'https://644060ba792fe886a88de1b9.mockapi.io/v1/test/partners',
});

TeddyApi.interceptors.request.use(RequestInterceptor);

export default TeddyApi;
