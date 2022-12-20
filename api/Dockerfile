FROM python:3.9-slim
WORKDIR /code
RUN apt-get -y update
COPY ./requirements.txt /code/requirements.txt 
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./app /code/app
EXPOSE 8000
CMD ["uvicorn", "app.rapidAPI:app", "--host", "0.0.0.0", "--port", "8000"]

