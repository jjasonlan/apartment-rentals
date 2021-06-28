# apartment-rentals
A full stack apartment listings SPA with authentication and permissions, built using MERN stack

## Stack
Client - React
Server - Node/Express
Database - MongoDB
Testing - Jest, Supertest

## APIs
Users - barebones authentication and user roles, including signup and login  
Apartments - CRUD interface for apartment listings  
Google Maps - Map view created using Google Maps API  

## Functionality/Requirements
* Users must be able to create an account and log in.
* Implement a client role: * Clients are able to browse rentable apartments in a list and on a map.
* Implement a realtor role: * Realtors would be able to browse all rentable- and already rented apartments in a list and on a map.    * Realtors would be able to CRUD all apartments and set the apartment state to available/rented.
* Implement an admin role: * Admins would be able CRUD all apartments, realtors, and clients.
* When an apartment is added, each new entry must have a name, description, floor area size, price per month, number of rooms, valid geolocation coordinates, date added and an associated realtor.
* Geolocation coordinates should be added either by providing latitude/longitude directly or through address geocoding (https://developers.google.com/maps/documentation/javascript/geocoding).
* All users should be able to filter the displayed apartments by size, price, and the number of rooms.
* REST API. Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Firebase.com or similar services to create the API).
* In both cases, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
* If it’s a web application, it must be a single-page application. All actions need to be done client-side using AJAX, refreshing the page is not acceptable. (If a mobile application, disregard this).
* Functional UI/UX design is needed. You are not required to create a unique design, however, do follow best practices to make the project as functional as possible.

# How to Launch the App

```
cd apartment-rentals
npm install
npm start // starts the server
cd client
npm start // starts the client
```
Navigate to localhost:3000 and you'll be up and running!
