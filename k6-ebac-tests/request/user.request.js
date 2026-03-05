import http from "k6/http"
import { check } from "k6"
import Utils from "../utils/utils"

export default class User {
    list(token) {
        let response = http.get(`${Utils.getBaseUrl()}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        check(response, { 'listagem deve retornar 201': r => r && r.status === 201 })
    }
}

