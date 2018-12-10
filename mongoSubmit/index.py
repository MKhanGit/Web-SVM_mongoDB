#!/usr/bin/python3
import cgitb, cgi
import pymongo

print("content-type: text/html\r\n\r\n")
cgitb.enable()

DATABASE='apidb'
COLLECTION='digits'

def mongo_store_document(document, HOST='localhost',PORT=27017):
        mclient = pymongo.MongoClient(HOST,PORT)
        db = mclient[DATABASE]
        collection = db[COLLECTION]
        docid=collection.insert_one(document).inserted_id
        #print("inserted to collection with id: ",docid)
        return(docid)

form = cgi.FieldStorage()
doc={}
for key in form.keys():
    doc[key]=form[key].value
ObjId=mongo_store_document(doc)
print("Stored in database w/ Id: ",ObjId)

'''
if "img" in form:
    output,input=ml_query(form["img"].value)
    print(output)
    mongo_store_data(output, input)
'''
