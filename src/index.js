import {app} from "./app.js"
import {connectDB} from "./db/index.js"

port = process.env.PORT || 3000

connectDB()
    .then(()=>{
        app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
        })
    })
    .catch(err=>{
        console.log("Problem with connecting to port listing")
        console.error(err);
        process.exit(1);
    })