const swaggerConfig = {
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Spotifiuby Payments API",
        },
        servers: [
            {
                url: 'http://localhost:4483',
                description: 'Local server'
            },
            {
                url: 'https://demo-payments-2.herokuapp.com',
                description: 'Prod server'
            }
        ]
    },
    apis: ["./src/main/routes.js"]
}

module.exports = {
    swaggerConfig
};
