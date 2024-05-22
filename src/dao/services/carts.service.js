import cartsModel from "../models/cartsModel.js"

const getOrCreateCart = async () => {
    let cart = await cartsModel.findOne().lean()
    if (!cart) {
      cart = await this.createCart()
    }
    return cart
  }

const getCarts = async () => {
    try {
        const carts = await cartsModel.find().lean();
        return carts
    } catch (err) {
        console.error('Error al obtener los carritos:', err.message)
        return []
    }
}


const getCartById = async (cartId) => {
    try {
        const cartById = await cartsModel.findById(cartId).populate("products.product").lean()
        return(cartById)
    } catch (err) {
        return err.message
    }
}

const createCart = async (products) => {
    try {
        let cartData = {};
        if (products && products.length > 0) {
            cartData.products = products
        }

        const cart = await cartsModel.create(cartData)
        return cart
    } catch (err) {
        console.error('Error al crear el carrito:', err.message)
        return err
    }
}


const addProductsToCart = async (cartId, productId, quantity) => {
    const cart = await cartsModel.findById(cartId)
    const product = cart.products.find(
      (product) => product.product.toString() === productId.toString()
    )
    if (product) {
      product.quantity += quantity
    } else {
      cart.products.push({ product: productId ,quantity })
    }
    return await cart.save()
  }

  
const updateProductsInCart = async (cid, products) => {
    try {
        return await cartsModel.findOneAndUpdate(
            { _id: cid },
            { products },
            { new: true })

    } catch (err) {
        return err
    }
}


const updateProductQuantity = async (cartId, productId, quantity) => {
    try {
        const cart = await cartsModel.findById(cartId)
        const product = cart.products.find(
          (product) => product.product.toString() === productId.toString()
        )
        if (product) {
          product.quantity = quantity
        } else {
          cart.products.push({ product: productId ,quantity })
        }
          return await cart.save()
    }
    catch (error) {
        console.error("No se pudo actualizar la cantidad del producto", error)
    }
}


const updateOneProduct = async (cid, products) => {
    
    await cartsModel.updateOne(
        { _id: cid },
        {products})
    return await cartsModel.findOne({ _id: cid })
}


const removeProductFromCart = async (cid, pid) => {
    const cart = await cartsModel.findById(cid)
    cart.products = cart.products.filter((product) => product._id.toString() !== pid)
    return cart.save()
  }


const clearCart = async (cid) => {
const cart = await cartsModel.findById(cid)
    if (!cart) {
      throw new Error("El carrito no existe")
    }
    cart.products = []
    return cart.save()
}

export default {
    getCarts,
    createCart,
    getCartById,
    addProductsToCart,
    updateProductsInCart,
    updateProductQuantity,
    removeProductFromCart,
    clearCart
  }