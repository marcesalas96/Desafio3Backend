import fs from "fs"

export class ProductManager {
    constructor(fileName){
        this.products = []
        this.fileName = fileName
    }
    async loadData(){
        try {
            const fileExist = fs.existsSync(this.fileName)
            if(fileExist){
                this.products = await this.getProducts()

                return "Data cargada exitosamente"
            }
            else{
                return "No hay data"
            }
        } catch (error) {
            console.error(error);
        }
    }
    async addProduct(product){
        try {
            if(this.products.length > 0){
                if (this.products.find(productCodeExist => product.code === productCodeExist.code) ){
                    throw new Error(`El codigo ingresado ${product.code} ya esta asignado a otro producto`)
                } 
            }
            if(Object.keys(product).length === 6 ){
                if(this.products.length === 0){
                    const id = 1
                    product.id = id
                }
                else{
                    const lastIndex = (this.products.length - 1)
                    const lastId = this.products[lastIndex].id
                    product.id = (lastId + 1 )
                }
                this.products.push(product)
                await fs.promises.writeFile(this.fileName, JSON.stringify(this.products))
                return console.log(`Producto agregado exitosamente con ID: ${product.id}`)
            }
            else{
                throw new Error("Todos los campos son obligatorios")
            }
        } catch (error) {
            console.error(error)
        }
    }
    async getProducts(){
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8')
            data === "" ? 
            this.products = [] 
            :
            this.products = JSON.parse(data)
            return this.products
        } catch (error) {
            console.error(error)
        }
    }
    async getProductsById(id){
        try {
            this.products = await this.getProducts()
            const productById = this.products.find(product => product.id === Number(id))
            if(!productById){
                throw new Error(`Objecto con id ${id} no existe`)
            }
            return productById 
            
        } catch (error) {
            console.error(error)    
        }
    }
    async updateProductById(id, newProduct){
        try {
            const product = await this.getProductsById(id)
            const productKey = Object.keys(product)
            const newProductKey = Object.keys(newProduct)
            newProductKey.forEach(key => {
                if(productKey.includes(key)){
                    product[key] = newProduct[key]
                }
            })
            await fs.promises.writeFile(this.fileName, JSON.stringify(this.products))
            return `Producto con ${id} actualizado con éxito`
        } catch (error) {
            console.error(error);
        }
    }
    async deleteProduct(id){
        try {
            const productIndex = this.products.findIndex(product => product.id === Number(id))
            this.products.splice(productIndex,1)
            await fs.promises.writeFile(this.fileName, JSON.stringify(this.products))
            return(console.log(`Producto con id: ${id} eliminado con exito`))
        } catch (error) {
            console.error(error);
        }
    }
}
