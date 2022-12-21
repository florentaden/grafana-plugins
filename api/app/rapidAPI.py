import pandas as pd
import datetime 
import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# -- format of data path if in container (/amp/ftp/pub/sigrun/rapid is the original path)
FILENAME = "/rapid/{siteID}{period}.NEU" 

# -- list of columns of the table to return to Grafana
columns = ["time", "north", "err_north", "east", "err_east", "vertical", "err_vertical"]

# -- function to convert time from fraction of year (e.g. 2022.00938636) file to isoformat string readable by Grafana
def convert_time(val):
    val = float(val)
    year = int(val)
    try: # bissextile?
        datetime.datetime(year, 2, 29)
        days = 366
    except:
        days = 365
    delta = datetime.timedelta(days=days)*(val - year) # time delta in days
    date = datetime.datetime(year, 1, 1) + delta # 1 Jan + time delta
    return date.isoformat()

# -- function to read GNSS data based on siteID and period 
def read_gnss(siteID, period):
        
    filename = FILENAME.format(siteID=siteID, period=period)

    data = pd.read_csv(filepath_or_buffer=filename, 
                       usecols=[0, 1, 2, 4, 5, 7, 8], # does not read multiple time columns
                       converters={0: convert_time},
                       delimiter=r"\s+", # any number of space 
                       names=columns) 
    data.dropna(inplace=True) # there might be NaN when there are not enough columns
    return data
        
## -- API -- ##
app = FastAPI()

# -- allow any origin to query API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
)

# -- Home page gives instruction to build query
@app.get("/")
async def root():
    return "Build query as: 'http://kaizen.gns.cri.nz:8000/data/?siteID=<station-name>&period=<period>' !so far only period=8h is available!"

# -- query the API 
@app.get("/data/")
async def read_data(siteID: str, period: str = "8h"):
    try: data = read_gnss(siteID, period)
    except: return 

    # -- convert to JSON format for easy reading
    result = data.to_json(index=False, orient="table")
    parsed = json.loads(result)
    return parsed
