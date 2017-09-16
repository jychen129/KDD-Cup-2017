import plotly.plotly as py
import plotly.graph_objs as go


def get_plotly_fig(dataframe):
    data = []
    for td in dataframe.columns:
        trace = go.Scatter(x=dataframe.index,
                           y=dataframe[td], name=td, opacity=0.8)
        data.append(trace)

    layout = dict(
        title='Task2 Volume',
        xaxis=dict(
            rangeselector=dict(
                buttons=list([
                    dict(count=1,
                         label='1w',
                         step='week',
                         stepmode='backward'),
                    dict(count=2,
                         label='2d',
                         step='day',
                         stepmode='backward'),
                    dict(count=1,
                         label='1d',
                         step='day',
                         stepmode='backward'),
                    dict(step='all')
                ])
            ),
            rangeslider=dict(),
            type='date'
        )
    )
    
    fig = dict(data=data, layout=layout)
    return fig