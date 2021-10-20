const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            users: '/api/users',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads'
        }

        // Connection to the database
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Routes of the application
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS 
        this.app.use(cors());
        // Parse and Read of the body
        this.app.use(express.json());
        // Public directory
        this.app.use(express.static('public'));
        // File uploads
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.auth, require('../routes/auth')); 
        this.app.use(this.paths.categories, require('../routes/categories')); 
        this.app.use(this.paths.products, require('../routes/products')); 
        this.app.use(this.paths.search, require('../routes/search')); 
        this.app.use(this.paths.uploads, require('../routes/uploads')); 
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port} 🚀`);
        });
    }
}

module.exports = Server;