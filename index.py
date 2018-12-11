#!/usr/bin/python3
#Author: Mohsin Khan
#Main page for Image SVM Applet. Backend MongoDB using PyMongo driver

import cgi
import cgitb
import hashlib
import sys
import pymongo
import pprint
import datetime
print("content-type: text/html\r\n\r\n")
cgitb.enable()
#predefined mongo db and collection for the apidb
DATABASE='apidb'
COLLECTION='digits'

with open("./main.html",'r') as fh:
    html = fh.read()
print(html)
