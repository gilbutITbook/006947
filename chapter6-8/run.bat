@echo off
START "distributor" node distributor.js
START "goods" node microservice_goods.js
START "members" node microservice_members.js
START "purchases" node microservice_purchases.js
START "gate" node gate.js

