import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import productsService from './dao/services/products.service.js'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartRouter.js'
import viewsRouter from './routes/viewsRouter.js'
import connectMongoDB from './config/connectionString.config.js'
import messageManager from './dao/controllers/mongoDB/messageManagerMongo.js'
import sessionRouter from './routes/sessionRouter.js'
import MongoStore from 'connect-mongo'
import session from "express-session"
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { environment } from './config/config.js'

const msg = new messageManager()

const app = express()

connectMongoDB()

const server = app.listen(environment.port,()=>console.log("Listening in",environment.port))

//Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.use("/",viewsRouter)

//Carpeta de vistas
app.set('views', `${__dirname}/views`)

//Motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')

//Routes
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)
app.use("/api/sessions", sessionRouter)

//Session
app.use(
    session({
        store: new MongoStore({
            mongoUrl: environment.mongoUrl,
            ttl: 3600,
        }),
        secret: environment.mongoSecret,
        resave: false,
        saveUninitialized: false,
    })
)

//usando Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Socket
const socketServer = new Server(server)

socketServer.on('connection', async(socket)=>{
    console.log("Conectado al socket del server con ID: ", socket.id)

    const lstProd = await productsService.getProducts()
    socketServer.emit("listaProductos", lstProd)

    socket.on("altaProducto", async(obj)=>{
        try {
            await productsService.addProduct(obj)
            const lstProd = await productsService.getProducts()
            socketServer.emit("listaProductos",lstProd)
        } catch (error) {
            console.log("Error al crear producto: ", error.message)
        }
    })

    socket.on("deleteProduct", async(prodId)=>{
        try {
            await productsService.deleteProduct(prodId)
            const lstProd = await productsService.getProducts()
            socketServer.emit("listaProductos",lstProd)
        } catch (error) {
            console.log("Error al eliminar producto: ", error.message)
        }
    })

    socket.on("mensaje", async (info) => {
        try {
            await msg.createMessage(info)
            socketServer.emit("chat", await msg.getMessages())
        } catch (error) {
            console.log("Error al cargar chat: ", error.message)
        }
      })

})