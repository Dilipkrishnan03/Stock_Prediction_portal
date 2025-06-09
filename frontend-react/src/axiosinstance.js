import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API_URL
const axiosInstance = axios.create({
    baseURL : baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default axiosInstance

// request Interceptor

axiosInstance.interceptors.request.use(
    function(config){
        console.log('request==>',config);
        const accessToken =localStorage.getItem("accessToken")
        if (accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        console.log(config)
        return config; 
    },
    function(error){
        return Promise.reject(error);
    }
)

//response Interceptor
 axiosInstance.interceptors.response.use(
    function(response){
        return response;
    },
    //Handle failed responses
    async function(error){
        const originalRequest=error.config;
        if(error.response.status === 401 && !originalRequest.retry){
            originalRequest.retry=true;
            // Refresh token added
            const refreshToken=localStorage.getItem('refreshToken')
            try{
                const response = await axiosInstance.post('/token/refresh/',{refresh:refreshToken})
                localStorage.setItem('accessToken',response.data.access)
                originalRequest.headers['Authorization']=`Bearer ${response.data.access}`
                return axiosInstance(originalRequest)
            }catch(error){
               localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                
            }
        }
        return Promise.reject(error);
    }
 )