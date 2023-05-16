import mongoose from "mongoose";

const connectDB = async () => {
    try {
       const connection =  await mongoose.connect(process.env.MONGO_URI)
       const url = `Conectado en : ${connection.connection.host} : ${connection.connection.port}`
       console.log(url);

    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}
export default connectDB
