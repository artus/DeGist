/* config-overrides.js */

module.exports = {
    devServer: function (configFunction) {
        // Return the replacement function for create-react-app to use to generate the Webpack
        // Development Server config. "configFunction" is the function that would normally have
        // been used to generate the Webpack Development server config - you can use it to create
        // a starting configuration to then modify instead of having to create a config from scratch.
        return function (proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost)

            // Change the https certificate options to match your certificate, using the .env file to
            // set the file paths & passphrase.
            config.headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'

            }

            // Return your customised Webpack Development Server config.
            return config
        }
    }
}