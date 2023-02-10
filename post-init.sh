#!/bin/bash

# add default viewer user "voldash" if not created
count=$(/usr/bin/curl -s http://admin:${GF_SECURITY_ADMIN_PASSWORD}@localhost:3000/api/users/search?query=voldash | jq '.totalCount')

if [ $count == "0" ]; then
	echo "creating default viewer voldash"
	/usr/bin/curl -s -X POST -H "Content-type: application/json" -d '{"login":"voldash","name":"Volcano Dashboard","password":"anothersecret"}' http://admin:${GF_SECURITY_ADMIN_PASSWORD}@localhost:3000/api/admin/users
fi
