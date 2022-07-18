# coding=utf-8
from pymongo import MongoClient

import os
from dotenv import load_dotenv
import pathlib

connection = MongoClient('localhost', 27017)
database = connection.spotify.apikey

current_path = str(pathlib.Path(__file__)
                   .parent
                   .resolve()).split("utils")[0]

ENV_FILE_TO_USE = current_path + '/.env'
load_dotenv(dotenv_path=ENV_FILE_TO_USE)

### Recordar tener la base de datos de mongo levantada ###
## sudo service mongod start (si no pone para que levante en el arranque)

# Después de cambiar el .env, se ejecuta en la misma carpeta donde esta este archivo
# y toma los valores configurados
mediaHost = os.getenv("REACT_APP_MEDIA_HOST_DEV").split("http://")[1]
paymentsHost = os.getenv("REACT_APP_PAYMENT_HOST_DEV").split("http://")[1]
userHost = os.getenv("REACT_APP_USERS_HOST_DEV").split("http://")[1]

database.update_one( { "apiKey": "938187f0c06221997960c36a7a85a30b2da2cb6e9a91962287a278c4ac1c7f8a" }, {"$set": {"name": "media", "apiKey": "938187f0c06221997960c36a7a85a30b2da2cb6e9a91962287a278c4ac1c7f8a", "active": True, "creationDate": "30/5/2022", "description": mediaHost} } )

database.update_one( { "apiKey": "f91eb70d3992147cf2b1552f47adb9ef5da778923ced5ff41fba592b3c9e2a15" }, {"$set": {"name": "payments", "apiKey": "f91eb70d3992147cf2b1552f47adb9ef5da778923ced5ff41fba592b3c9e2a15", "active": True, "creationDate": "30/5/2022", "description": paymentsHost} } )

database.update_one( { "apiKey": "72b60f6945b9beccf2a92c7da5f5c1963f4ec68240a1814b4ec5273cac5e7a44" }, {"$set": {"name": "users", "apiKey": "72b60f6945b9beccf2a92c7da5f5c1963f4ec68240a1814b4ec5273cac5e7a44", "active": True, "creationDate": "30/5/2022", "description": userHost} } )
