import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
import seaborn as sns
import statsmodels.api as sm
import pickle

from os import path
from dateutil.relativedelta import relativedelta
from statsmodels.tsa.stattools import acf
from statsmodels.tsa.stattools import pacf
from statsmodels.tsa.seasonal import seasonal_decompose

S = 72
d, D = 0, 0
p, q = 6, 0
P, Q = 3, 0 
order=(p, d, q)
seasonal_order=(P, D, Q, S)

data_col = ['T1D0', 'T1D1', 'T2D0', 'T3D0', 'T3D1']
peak_col = ['EarlyPeakTrafficTime', 'LatePeakTrafficTime', 'NormalTrafficTime']
holiday_col = ['BeforeNationalDay', 'NationalDayFront(1-4)', 'NationalDayTail(5-7)', 'Weekend', 'WorkingDay', 'WorkingWeekend']
weather_col = ['HeavyRain', 'LightRain', 'Rain', 'Sunny']
full_df = pd.read_pickle('../datasets/peak_new_full_task2.pkl')
full_df[weather_col] = full_df[weather_col].fillna(0)

output_template = "aa-Weather-SARIMAX-%d-%d-%d--%d-%d-%d--%d[%%s].pkl" % (order+seasonal_order)

for td in data_col:
    print("="*60)
    print("Start training: " + td)
    print("Model name:     " + output_template%(td))
    print("="*60)
    df_train =  full_df[td]
    df_train_log = df_train.map(lambda x:np.log(x+1))

    mod = sm.tsa.statespace.SARIMAX(
        endog=df_train,
        exog=full_df[holiday_col+weather_col],
        order=order,
        seasonal_order=seasonal_order,
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    
    results = mod.fit()
    print(results.summary())
    print("="*60)
    results.save(path.join("../models", output_template%(td)))

