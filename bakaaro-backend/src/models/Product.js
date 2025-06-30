import mongoose from 'mongoose'; // Soo qaado Mongoose si loo sameeyo model

const productSchema = new mongoose.Schema({ // Qeex qaabka alaabta
    name: { type: String, required: true }, // Magaca alaabta (loo baahan yahay)
    brand: { type: String, required: true }, // Magaca brand (loo baahan yahay)
    category: { type: String, required: true }, // Qaybta alaabta (tusaale, Smartphones)
    price: { type: Number, required: true, min: 0 }, // Qiimaha (sifiro ama ka badan)
    quantity: { type: Number, required: true, min: 0 }, // Tirada kaydka
    barcode: { type: String, required: true, unique: true }, // Barcode waa gaar ah
    description: { type: String, default: '' }, // Sharaxaadda (ikhtiyaari)
    branch: { type: String, required: true }, // Laanta alaabta
    dateAdded: { type: Date, default: Date.now } // Taariikhda lagu daray
});

export default mongoose.model('Product', productSchema); // Samee oo soo dejiso model-ka Product