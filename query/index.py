#!/usr/bin/python3
import cgitb, cgi
import imageio
import numpy as np
from sklearn import svm
import pickle
import sys, base64

print("content-type: text/html\r\n\r\n")
cgitb.enable()
DATABASE='apidb'
COLLECTION='digits'
#query the trained SVM for a prediction based on an encoded PNG data stream
def ml_query(BASE64_ENC_IMG):
    try:
        encoded=BASE64_ENC_IMG.split(',')[1]
        X=png2array(base64.b64decode(encoded))
        svm_data_file=open('svm_data_digits.pkl','rb')
        clf = pickle.load(svm_data_file)
        svm_data_file.close()
        return(clf.predict([X])[0],BASE64_ENC_IMG)
    except Exception as e:
        print(str(e))
        print("enter base64 uri for image.")
        return(False)

def png2array(IMAGE_FILE):
    im = np.asarray(imageio.imread(IMAGE_FILE))
    im_mono = im[:][:].T[0]/255
    im_mono_1d = im_mono.ravel()
    return(im_mono_1d)

form = cgi.FieldStorage()
if "img" in form:
    output,input=ml_query(form["img"].value)
    print(output)
    #print("<input type='hidden' name='drawn_input' value='" + input + "'>")
    #mongo_store_data(output, input)
