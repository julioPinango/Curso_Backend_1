import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error de conexión a MongoDB:', err);
});

export default mongoose;
