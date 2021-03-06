import { notification } from 'antd';
import querystring from 'querystring';
import fetch from 'dva/fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  
  const defaultOptions = {
    credentials: 'include',
    mode: 'cors',
    method: 'POST',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if(newOptions.type === 'formData'){
      newOptions.headers = {
        Accept: 'text/plain, text/html,application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        ...newOptions.headers,
      }
    }else{
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
    }
    // newOptions.body = JSON.stringify(newOptions.body);
    newOptions.body = newOptions.type==="formData" ? querystring.stringify(newOptions.body) : JSON.stringify(newOptions.body);
  }else if(newOptions.method === 'GET' || newOptions.method === 'get'){
    url = newOptions.type ? `${url}?${querystring.stringify(newOptions.body)}` : '';
    delete newOptions.body;
  };
  if(!newOptions.export) {
    return fetch(url, newOptions)
    .then(response=> checkStatus(response))
    .then(response => response.json())
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      return error;
    });
  }else {
    let filename = '';
    return fetch(url, newOptions)
    .then(response=> checkStatus(response))
    .then(response => {
      filename = response.headers.get('Content-Disposition');
      if(!filename){
          return  response.json();
      }else {
          filename = filename.split('\'\'')[1];
          filename = window.decodeURI(filename);
          return response.blob();
      }
    })
    .then(blob => {
       if(filename){
           const url = window.URL.createObjectURL(blob);
           let a = document.createElement('a');
           a.href = url;
           a.download = filename;
           a.click();
       }else {
         return blob
       }
    })
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      return error;
    })
  }
}
