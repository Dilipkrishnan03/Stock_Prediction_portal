import axios from 'axios';
import {useEffect,useState} from 'react';
import axiosInstance from '../../axiosinstance'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    useEffect(()=> {
        const fetchProtectedData = async () => {
            try{
                const response = await axiosInstance.get('/protected-view/');
  
            }catch(error){
                console.error("Error fetching protected data:", error);
            }
        }
        fetchProtectedData();
    },[]);

    const [ticker, setTicker] = useState('');
    const [error,setError]= useState(null);
    const [loading, setLoading] = useState(false);
    const [plot,setPlot] = useState(null);
    const [ma100,setMa100] = useState(null);
    const [ma200,setMa200] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);
    const handleSubmit= async(e)=>{
      e.preventDefault();
      setLoading(true);
      setError(null);
      setPlot(null);
      setMa100(null);
      setMa200(null);
      setCurrentPrice(null); 
      try{
        const response = await axiosInstance.post('/predict/',{
          ticker: ticker
        });

        if(response.data.error) {
          setError(response.data.error);
        } else {
          const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
         
          if (response.data.current_price !== undefined && response.data.current_price !== null) {
              setCurrentPrice(response.data.current_price);
          } else {
              setCurrentPrice(null); 
          }
          setPlot(response.data.plot_img ? `${backendRoot}${response.data.plot_img}` : null);
          setMa100(response.data.plot_100_dma ? `${backendRoot}${response.data.plot_100_dma}` : null);
          setMa200(response.data.plot_200_dma ? `${backendRoot}${response.data.plot_200_dma}` : null);
        }

      }catch(err){
        console.error("Error in API request:", err);
        setError("Failed to fetch prediction or stock data. Please check the ticker or try again later.");
        setPlot(null);
        setMa100(null);
        setMa200(null);
        setCurrentPrice(null); 
      }finally{
        setLoading(false);
      }
    };

    return (
      <div className='container' style={{ fontFamily: 'Georgia, serif' }}>
        <div className='row'>
          <div className='col-md-6-mx-auto'>
            <h1 className='text-center' style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              Dashboard
            </h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className='form-control'
                placeholder='Enter Stock Ticker (e.g., AAPL)'
                onChange={(e) => setTicker(e.target.value.toUpperCase())} 
                value={ticker} 
                required
              />
              <small>{error && <div className='text-danger mt-2'>{error}</div>}</small>
              <button type='submit' className='btn btn-info mt-2' disabled={loading}>
                {loading ? <span><FontAwesomeIcon icon={faSpinner} spin/> Please Wait...</span> : "See Prediction"}
              </button>
            </form>
{currentPrice !== null && !loading && !error && (
    <div
        className='mt-4 p-3'
        style={{
            backgroundColor: '#f8f9fa', 
            borderRadius: '15px',      
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
            textAlign: 'center',
            border: '1px solid #e0e0e0', 
            padding: '25px',            
            fontFamily: 'Arial, sans-serif' 
        }}
    >
        <h3 style={{
            fontSize: '1.6rem',      
            fontWeight: 'normal',     
            color: '#343a40',         
            marginBottom: '10px'      
        }}>
            Current Price for <span style={{ fontWeight: 'bold', color: '#0056b3' }}>{ticker}</span>:
        </h3>
        <p style={{
            fontSize: '2.8rem',       
            fontWeight: 'bolder',     
            color: '#28a745',         
            margin: '0'              
        }}>
            ${currentPrice.toFixed(2)}
        </p>
        <p style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            marginTop: '5px'
        }}>
            (Data from Yahoo Finance)
        </p>
    </div>
)}

          </div>

          <div className='prediction mt-5'>
            <div className='p-3'>
              {plot && (
                <img src={plot} style={{maxWidth:"100%"}} alt="Closing Price Plot"/>
              )}
            </div>
            <div className='p-3'>
              {ma100 && (
                <img src={ma100} style={{maxWidth:"100%"}} alt="100-Day Moving Average Plot"/>
              )}
            </div>
            <div className='p-3'>
              {ma200 && (
                <img src={ma200} style={{maxWidth:"100%"}} alt="200-Day Moving Average Plot"/>
              )}
            </div>
             {/* Message if no plots are available but no explicit error */}
            {!loading && !error && !plot && !ma100 && !ma200 && currentPrice === null && (
                <div className="text-center mt-3">
                    <p>Enter a stock ticker to see historical data and predictions.</p>
                </div>
            )}
             {!loading && error && !plot && !ma100 && !ma200 && (
                <div className="text-center mt-3 text-danger">
                    <p>No charts available due to an error or missing data.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    );
}

export default Dashboard;