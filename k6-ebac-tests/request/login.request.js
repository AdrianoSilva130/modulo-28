import http from "k6/http"
import { check } from "k6"
import Utils from "../utils/utils.js"

export default class Login {

    #token

    access(user, pass) {

        let response = http.post(`${Utils.getBaseUrl()}/login`,
            JSON.stringify({
                username: user,
                password: pass
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        )

        console.log("BODY:", response.body)

        this.#token = response.json().accessToken
        console.log("TOKEN:", this.#token)

        check(response, {
            "status deve ser 201": (r) => r.status === 201
        })
    }

    getToken() {
        return this.#token
    }
}