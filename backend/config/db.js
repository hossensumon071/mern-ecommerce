import mongoose from "mongoose";



const connectDB = async () => {
    try{

       await mongoose.connect(process.env.MONGOOSE_URI)
       console.log('successfully connected to mongodb')
    } catch(err) {
        console.error(`ERRO: ${err.message}`);
        process.exit(1)
    }
}

export default connectDB