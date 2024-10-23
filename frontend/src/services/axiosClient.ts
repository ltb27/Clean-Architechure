import axios, {AxiosInstance} from "axios";
import dayjs from "dayjs";

// constants
const BASE_URL = "http://localhost:7100";
const LOGIN_URL = "api/auth/admin/login";
const REFRESH_TOKEN_URL = "api/auth/admin/refresh-token";
const TIMEOUT = 10000;

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
})

// check token expired
const isTokenExpired = (expirationDate:Date|null) => {
    if (!expirationDate) {
        return true;
    }

    return dayjs().isAfter(expirationDate);
}

const setAuthData = (data:any) => {
    authData = {
        token: data.token,
        expiration: data.expiration,
        refreshTokenExpiration: data.refreshTokenExpiration
    }

    localStorage.setItem("authData", JSON.stringify(authData))
}

// func để lấy thông tin data
const loadAuthData = () => {
    const data = localStorage.getItem("authData")

    if (data) {
        authData = JSON.parse(data)
    }
}

// load Auth data khi khởi tạo
loadAuthData()

// biến để tracking token
let isTokenRefreshing = false
let refreshTokenPromise : Promise<any> | null = null

// lưu trữ failed queue
// let failedQueue: any[] = []

// lưu trữ data auth
interface IAuthData {
    token: string | null
    expiration: Date | null
    refreshTokenExpiration: Date | null
}
let authData : IAuthData = {
    token: null,
    expiration: null,
    refreshTokenExpiration: null,
}

// func để xử lý failed queue
// const processQueue = (error: any, token = null) => {
//     failedQueue.forEach(prom => {
//         if (error) {
//             prom.reject(error)
//         } else {
//             prom.resolve(token)
//         }
//     })
//
//     failedQueue = []
// }

// request interceptor
api.interceptors.request.use(function (config) {
    // không thêm access token vào login và refresh token api
    if (config.url === LOGIN_URL || config.url === REFRESH_TOKEN_URL) {
        return config
    }

    // thêm token vào header request
    if (authData.token) {
        config.headers.Authorization = `Bearer ${authData.token}`
        config.headers["Request-Time"] = new Date().getTime();
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

const logout = () => {
    localStorage.removeItem("authData")
    window.location.href = "/login"
}

// response interceptor
api.interceptors.response.use(function (response) {
    // Nếu response trả về từ login api
    if (response.config.url === LOGIN_URL) {
        const {token, expiration, refreshTokenExpiration} = response.data

        // set auth data
        setAuthData({token, expiration, refreshTokenExpiration})
    }
    return response.data;
}, async function (error) {
    if (error.response) {
        const originalRequest = error.config;
        if (error.response.status !== 401 && originalRequest._retry) {
            logout()
            return Promise.reject(error);
        }

        if (isTokenExpired(authData.refreshTokenExpiration)) {
            logout()
            return Promise.reject(error);
        }

        return new Promise(function (resolve, reject) {
            if (!isTokenRefreshing) {
                isTokenRefreshing = true
                originalRequest._retry = true

                refreshTokenPromise = api.post(REFRESH_TOKEN_URL)
                    .then(response => {
                            const {token, expiration, refreshTokenExpiration} = response.data;
                            setAuthData({token, expiration, refreshTokenExpiration})
                            return token;
                        }
                    )
                    .catch(error => {
                        logout()
                        throw error
                    })
                    .finally(() => {
                        isTokenRefreshing = false;
                        refreshTokenPromise = null;
                    })
            }

            if (refreshTokenPromise) {
                return refreshTokenPromise
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return resolve(api(originalRequest));
                    })
                    .catch(error => reject(error))
            } else {
                logout()
                return reject(error)
            }
        })

        // // xử lý refresh token
        // if (isTokenRefreshing) {
        //     // nếu đang xử lý refresh token, thêm request lỗi vào queue
        //     return new Promise(function (resolve, reject) {
        //         failedQueue.push({resolve, reject})
        //     }).then(token => {
        //         originalRequest.headers.Authorization = `Bearer ${token}`;
        //         return api(originalRequest);
        //     })
        //         .catch(
        //             error => {
        //                 return Promise.reject(error);
        //             }
        //         )
        // }
        //
        // // bắt đầu xử lý refresh token
        // originalRequest._retry = true
        // isTokenRefreshing = true
        //
        // try {
        //     // call api refresh token
        //     const response = await api.post(REFRESH_TOKEN_URL)
        //
        //     const {token, expiration, refreshTokenExpiration} = response.data
        //
        //     // set auth data
        //     setAuthData({token, expiration, refreshTokenExpiration})
        //
        //     // xử lý queue request lỗi
        //     processQueue(null, token)
        //
        //     // gọi laị request trước đó với token mới
        //     originalRequest.headers.Authorization = `Bearer ${token}`;
        //     return api(originalRequest);
        // } catch (refreshError) {
        //     // xử lỹ các lỗi cho các request gốc và thử lại
        //     processQueue(error)
        //     // logout và xóa authData và reject luôn
        //     localStorage.removeItem("authData")
        //     window.location.href = "/login"
        //     return Promise.reject(refreshError);
        // } finally {
        //     isTokenRefreshing = false
        // }
    } else if (error.request) {
        console.error('Network Error');

    } else {
        // other error
        console.error('Error', error.message);
    }
    return Promise.reject(error);
});

export default api