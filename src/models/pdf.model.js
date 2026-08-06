import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
    dataId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    pdfFilePath: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const PDF = mongoose.model('PDF', pdfSchema);

export default PDF;