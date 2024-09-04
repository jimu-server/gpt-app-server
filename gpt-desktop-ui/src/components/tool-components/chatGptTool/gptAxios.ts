import axios, {AxiosInstance} from "axios";
import {GetHeaders} from "@/plugins/axiosutil";
import {VITE_APP_OLLAMA_SERVER} from "@/env";

export const OllamaServer: AxiosInstance = axios.create({
    baseURL: VITE_APP_OLLAMA_SERVER,
    timeout: 5000,
})

OllamaServer.interceptors.request.use(headers)


function headers(request) {
    request.headers = {
        ...GetHeaders(),
        ...request.headers
    }
    return request
}