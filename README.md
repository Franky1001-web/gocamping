# gocamping

A website which i created as a part of learning process during my 3rd year in engineering graduation that takes you through the various campsites all around India. The motive of 
the project is to learn the working of technologies such as Node,
Express, MongoDB. It helped me to learn how can i make these work together asynchronously. 

This website has its front made from HTML for basic architecture and CSS and Bootstrap5 for stylings. 
The backend is constructed using NodeJs written using Express framework, MongoDB Atlas as database for the website.

The 2 most important APIs used here are Cloudinary for storing images and MapBox API for displaying locations of the campsite.
Another API is unsplash API for getting images.

It has got authentication as well as authorization implemented using Passport which is a node package.

It has got validation of forms done using JOI validation packages.

Since the HTML forms can not parse the images uploaded and send them to backend, it is done using Multer which parses the images and Multer-Cloudinary which automatically 
uploads the photos directly to cloudinary storage.

It has got the session feature once a user logs in and the data is stored in database itself
