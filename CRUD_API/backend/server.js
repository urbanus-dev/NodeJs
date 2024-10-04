
const http= require("http")
const router = require("./routes")
const port =4000
const  host ="localhost"
const reqlistener=(req, res)=>{
 res.setHeader("Content-Type","application/json")
    router(req,res)
}
const server=http.createServer(reqlistener)
server.listen(port,host,()=>{
    console.log(`Server is running on http://${host}:${port}`)
}
)
