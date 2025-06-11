from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import StockPredictionSerializer
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import os
from django.conf import settings
from .utils import save_plot 
from sklearn.preprocessing import MinMaxScaler



class StockPredictionAPIView(APIView):
    def post(self,request):
        serializer= StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']
            current_price = None
            try:
                stock_info = yf.Ticker(ticker).info
                current_price = stock_info.get('regularMarketPrice')
                if current_price is None:
                    current_price = stock_info.get('currentPrice')
                    if current_price is None:
                        current_price = stock_info.get('previousClose')
            except Exception as e:
                print(f"Error fetching current price for {ticker}: {e}")
                pass 
            now = datetime.now()
            start = datetime(now.year - 10, now.month, now.day)
            end = now
            df = yf.download(ticker,start,end)
            print(df)
            if df.empty:
                return Response({'error':"No data found for charts. Current price might still be available.",
                                 'current_price': current_price,
                                 "status":status.HTTP_404_NOT_FOUND})
            df= df.reset_index()
            print(df)

            
            plt.switch_backend('AGG')
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label='Closing Price')
            plt.title(f'Closing price of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plt.grid(True) 

            # Save the plot to a file
            plot_img_path = f'{ticker}_plot.png'
            plot_img = save_plot(plot_img_path)

            # 100 Days Moving Average
            ma100 = df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label='Closing Price')
            plt.plot(ma100, 'r', label='100 DMA')
            plt.title(f'100 Days Moving Average of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plt.grid(True)
            plot_img_path = f'{ticker}_100_dma.png'
            plot_100_dma = save_plot(plot_img_path)

            # 200 Days Moving Average
            ma200 = df.Close.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label='Closing Price')
            plt.plot(ma100, 'r', label='100 DMA')
            plt.plot(ma200, 'g', label='200 DMA')
            plt.title(f'200 Days Moving Average of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plt.grid(True)
            plot_img_path = f'{ticker}_200_dma.png'
            plot_200_dma = save_plot(plot_img_path)
            
            return Response({
                'status': 'success',
                'current_price': current_price,
                'plot_img': plot_img,
                'plot_100_dma': plot_100_dma,
                'plot_200_dma': plot_200_dma,
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)