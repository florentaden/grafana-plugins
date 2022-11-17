import os
import pandas as pd
import datetime 
import json
from glob import glob
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def convert_time(val):
    val = float(val)
    year = int(val)
    try: 
        datetime.datetime(year, 2, 29)
        days = 366
    except:
        days = 365
    delta = datetime.timedelta(days=days)*(val - year)
    date = datetime.datetime(year, 1, 1) + delta
    return date.isoformat()


# data_path = "/amp/ftp/pub/sigrun/rapid" # original path
data_path = "/rapid" # path in the container (volume should be mounted)
filelist = glob(f"{data_path}/*.NEU")
columns = ["time", "north", "err_north", "east", "err_east", "vertical", "err_vertical"]

data = {}
for filename in filelist:
    station = os.path.splitext(os.path.basename(filename))[0]
    try:
        data[station] = pd.read_csv(filepath_or_buffer=filename, 
                                    usecols=[0, 1, 2, 4, 5, 7, 8], 
                                    converters={0: convert_time},
                                    delimiter=r"\s+", 
                                    names=columns)
        data[station].dropna(inplace=True)
    except Exception as err_msg:
        print(f"Failed to read {filename}: {err_msg}")

app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://kaizen.gns.cri.nz:3001"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
)

@app.get("/")
async def root():
    return "Build query such as:\n  'http://api-app:8000/data/?siteID=<station-name>&period=<period>'\n!so far only period=8h is available!"


@app.get("/data/")
async def read_data(siteID: str, period: str = "8h"):
    key = siteID+period
    result = data[key].to_json(index=False, orient="table")
    parsed = json.loads(result)
    return parsed
