import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {ElNotification} from "element-plus";
import {GetHeaders} from "@/plugins/axiosutil";
import {VITE_APP_SERVER} from "@/env";

const Axios: AxiosInstance = axios.create({
    baseURL: VITE_APP_SERVER,
    timeout: 5000,
})


Axios.interceptors.request.use(function (request) {
    request.headers = GetHeaders()
    return request
})

Axios.interceptors.response.use(function (response: AxiosResponse<any>) {
    return response
}, function (error) {
    // errHandler(error.response)
    return error.response
})

export default Axios


function errHandler(response) {
    switch (response.status) {
        case 400:
            break
        case 500:
            ERROR_500(response)
            break
        default:
    }
}


/*
* @description 500错误 对应错误代码提示处理
* */
function ERROR_500(response) {
    let data = response.data
    switch (data.code) {
        case 999:
            ResponseNotify(response)
            break
        default:
            break
    }
}

function ResponseNotify(response) {
    let data = response.data
    ElNotification({
        type: 'error',
        title: '错误',
        message: data.msg,
    })
}

