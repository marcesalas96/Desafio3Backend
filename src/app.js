import {ProductManager} from "./Classes/ProductManager.js" 
import express  from "express"


const PORT = 8080
const productManager = new ProductManager("./db/products.json")
const app = express()


app.use(express.urlencoded({extended:true}))



app.get("/products", async (req, res) => {
    try {
        await productManager.loadData()
        const products = await productManager.getProducts()
        const {limit} = req.query
        if(limit){
            const productsWithLimit = products.slice(0,Number(limit))
            return res.send(productsWithLimit)
        }
        return res.send(products)    
    } catch (error) {
        res.status(400).send("Error", error)
    }
})
app.get("/products/:pid", async (req,res) => {
    try {
        await productManager.loadData()
        const {pid} = req.params
        if(isNaN(Number(pid))){
            throw new Error("El parametro ingresado no es un numero!")
        }
        const productById = await productManager.getProductsById(pid)
        if(!productById){
            throw new Error(`No hay un producto con el id: ${pid}`)
        }
        return res.send(productById)
    } catch (error) {
        res.status(401).send({Error: error.message})
    }
})

app.listen((PORT), error => {
    error ? console.log(error) : console.log(`Server listening PORT : ${PORT}`);
})
