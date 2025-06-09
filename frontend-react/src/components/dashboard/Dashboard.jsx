import axios from 'axios'
import {useEffect,useState} from 'react'
import axiosInstance from '../../axiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    // Fetch protected data from the backend
    const [ticker, setTicker] = useState('')
    const [error,setError]= useState(null)
    const [loading, setLoading] = useState(false)
    const [plot,setPlot] = useState()
    const [ma100,setMa100] = useState()
    const [ma200,setMa200] = useState()
    
    useEffect(()=> {
        const fetchProtectedData = async () => {
            try{
                const response = await axiosInstance.get('/protected-view/')
            }catch(error){
                console.error("Error fetching data:", error);
            }
    }
        fetchProtectedData();
    },[])

    const handleSubmit= async(e)=>{
      e.preventDefault()
      setLoading(true)
      try{
        const response = await axiosInstance.post('/predict/',{
          ticker: ticker
        })
        console.log(response.data)
        const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
        const plotUrl = `${backendRoot}${response.data.plot_img}`;
        const ma100Url = `${backendRoot}${response.data.plot_100_dma}`;
        const ma200Url = `${backendRoot}${response.data.plot_200_dma}`;
        console.log(plotUrl);
        setPlot(plotUrl); // Set the plot URL to state
        setMa100(ma100Url); // Set the 100-day moving average plot URL to state
        setMa200(ma200Url); // Set the 200-day moving average plot URL to state
        //set plot
        if(response.data.error){
          setError(response.data.error)
        }

      }catch(error){
        console.error("Error There is some error in the API request:", error);
      }finally{
        setLoading(false)
      }
    }
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6-mx-auto'>    
          <h1 className='text-center'>Dashboard</h1>
          <form onSubmit={handleSubmit}>
            <input  type="text" className='form-control' placeholder='Enter Stock Ticker' 
            onChange={(e) =>setTicker(e.target.value)} required
            />
            <small>{error && <div className='text-danger'></div>}</small>
            <button type='submit' className='btn btn-info mt-2'>
            {loading ? <span><FontAwesomeIcon icon={faSpinner} spin/>Please Wait...</span>:"See Prediction"}
            </button>
          </form>
        </div>  
        {/*Print prediction plot*/}
        <div className='prediction mt-5'>
          <div className='p-3'>
            {plot && (
              <img src={plot} style={{maxWidth:"100%"}}/>
            )}
          </div>
          <div className='p-3'>
            {ma100 && (
              <img src={ma100} style={{maxWidth:"100%"}}/>
            )}

          </div>
          <div className='p-3'>
            {ma200 && (
              <img src={ma200} style={{maxWidth:"100%"}}/>
            )}

          </div>
        </div>
    </div>
    </div>  
  )
}

export default Dashboard
