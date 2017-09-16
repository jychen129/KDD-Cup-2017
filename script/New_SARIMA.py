# Handle table-like data and matrices
import numpy as np
import pandas as pd
import plotly.plotly as py
from pandas import DataFrame,Series
import csv
import pprint
from sklearn.cluster import KMeans,FeatureAgglomeration
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestRegressor
from sklearn import preprocessing
from sklearn.decomposition import PCA,FastICA
from sklearn.cross_decomposition import CCA
import statsmodels.api as sm
from statsmodels.tsa.stattools import acf  
from statsmodels.tsa.stattools import pacf
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller

# Visualisation
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.pylab as pylab
import seaborn as sns

# Others
import math
import datetime

train_volume = pd.read_csv(
    '../datasets/train/volume(table_6)_training.csv',
    parse_dates=True,
    index_col=[0]
)
train_volume2 = pd.read_csv(
    '../datasets/train/volume(table_6)_training2.csv',
    parse_dates=True,
    index_col=[0]
)

volume = pd.concat([
    train_volume,
    train_volume2
])
volume['counter'] = 1
volume['route'] = 'T' + \
    volume.tollgate_id.map(str) + 'D' + volume.direction.map(str)
del volume['tollgate_id']
del volume['direction']

del train_volume
del train_volume2

train_weather = pd.read_csv(
    '../datasets/train/weather_(table_7)_training_update.csv')
train_weather2 = pd.read_csv(
    '../datasets/train/weather_(table_7)_2.csv')

weather = pd.concat([
    train_weather,
    train_weather2
])
del train_weather
del train_weather2

volume_grouped = volume.groupby(['route']).resample('20min').count()[
    'counter'].unstack().T.fillna(0).astype(int)
holidays_index = pd.date_range('2016-9-30', '2016-10-9', freq='20min')
volume_grouped = volume_grouped.loc[volume_grouped.index.difference(
    holidays_index)]

index = volume_grouped.between_time('0:00','00:40').index
volume_grouped.loc[index,['T1D1','T3D1']] = 0
volume_grouped.index = pd.MultiIndex.from_arrays(
    [volume_grouped.index.date, volume_grouped.index.time], names=['date', 'time'])
volume_grouped = volume_grouped.unstack()


validate_index = pd.date_range('2016-10-20', '2016-10-24').date
training_index = volume_grouped.index.difference(validate_index)

pca = PCA(n_components=1)
pca_volume_grouped = pca.fit_transform(volume_grouped.loc[training_index].stack())


S = 72
d, D = 0, 0
p, q = 3, 1
P, Q = 3, 0
order=(p, d, q)
seasonal_order=(P, D, Q, S)

mod = sm.tsa.statespace.SARIMAX(
    endog=pca_volume_grouped.flatten(),
    order=order,
    seasonal_order=seasonal_order,
    enforce_stationarity=False,
    enforce_invertibility=False
)

results = mod.fit()

print(results.summary())
