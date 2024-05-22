import ProductRepository from "../repositories/productsRepositories.js"
import CartRepository from "../repositories/cartsRepositories.js"
import UserRepository from "../repositories/usersRepositories.js"
import MessageRepository from "../repositories/messagesRepositories.js"
import TicketRepository from "../repositories/ticketsRepositories.js"
import Product from "../controllers/mongoDB/productManagerMongo.js"
import Cart from "../controllers/mongoDB/cartManagerMongo.js"
import Message from "../controllers/mongoDB/messageManagerMongo.js"
import Ticket from "../controllers/mongoDB/ticketManager.js"
import User from "../controllers/mongoDB/userManagerMongo.js"

const productDAO = new Product()
const cartDAO = new Cart()
const userDAO = new User()
const messageDAO = new Message()
const ticketDAO = new Ticket()

export const productRepository = new ProductRepository(productDAO)
export const cartRepository = new CartRepository(cartDAO)
export const userRepository = new UserRepository(userDAO)
export const messageRepository = new MessageRepository(messageDAO)
export const ticketRepository = new TicketRepository(ticketDAO)