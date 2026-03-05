export default class Utils {
    static getBaseUrl() {
        switch (__ENV.NODE_ENV) {
            case 'development':
                return `http://host.docker.internal:3000/api`

            case 'production':
                return `http://localhost:3000/api`

            default:
                return 'http://localhost:3000/api'
        }

    }
}