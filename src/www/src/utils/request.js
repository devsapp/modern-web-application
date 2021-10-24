import axios from 'axios'
import qs from 'qs'
import _ from 'loadsh';

export default async function request(path, data, callback) {
  return {}
}

export async function get(path, data) {
  const result = await axios.get(`/api/${path}`, {
    params: data
  });
  return result.data;
}


export async function post(path, data) {
  const result = await axios.post(`/api/${path}`, {
    content: data
  })
  return result.data;
}



// // 请求拦截器
// axios.interceptors.request.use(config => {
//   if (Object.prototype.toString.call(config.data) !== '[object FormData]') {
//     config.data = qs.stringify(config.data);
//   }
//   return config
// })

// // 响应拦截器
// axios.interceptors.response.use(response => {
//   const { Error } = response.data;
//   if (Error) {
//     window.alert(Error.Message);
//   }
//   return response.data
// }, error => {
//   if (error.response.status === 500) {
//     window.alert('服务器发生错误，请检查服务器');
//   } else if (error.response.status === 401) {
//     window.alert('401 Unauthorized');
//   } else {
//     console.log(error.response)
//   }

//   return Promise.reject(error) //接口500抛出异常（不走页面逻辑）
// })

