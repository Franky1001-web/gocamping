const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbURL = 'mongodb+srv://sumit_mittal:iitbhu1001@project.idynn.mongodb.net/project?retryWrites=true&w=majority';

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then((res) => console.log("db is connected"))
  .catch((err) => console.log(err));

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            owner: "6116c4736ef8407ebcde8cd7",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dcsfuojuo/image/upload/v1628533875/ImagesUpload/fyryv6nbdcsbzyodgjla.jpg',
                    fileName:  'ImagesUpload/fyryv6nbdcsbzyodgjla'
                },
                {
                    url: 'https://res.cloudinary.com/dcsfuojuo/image/upload/v1628533880/ImagesUpload/vqddn08dxfpnqznsoapi.jpg',
                    fileName: 'ImagesUpload/vqddn08dxfpnqznsoapi'
                }
            ],
            description: "Going for camping, do checkout this before you step out",
            price: 10,
            mapping: {
                 type: 'Point', 
                 coordinates: [ 79.2075568980951, 30.18908256286 ] 
                }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log("Work done!!");
})