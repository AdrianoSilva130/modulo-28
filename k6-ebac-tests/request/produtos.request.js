import http from "k6/http";
import { check } from "k6";
import Utils from "../utils/utils.js";

export default class Produtos {

    #productId

    list(token) {
        const res = http.get(`${Utils.getBaseUrl()}/products`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        check(res, { 'listagem deve retornar 200': r => r.status === 200 });
        return res.json();
    }

    create(token, produto) {
        const res = http.post(
            `${Utils.getBaseUrl()}/products`,
            JSON.stringify(produto),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        check(res, { 'produto criado com sucesso': r => r.status === 201 });
        const body = res.json();
        this.#productId = body.id;
        return body;
    }

    deleteById(token, id) {
        const res = http.del(
            `${Utils.getBaseUrl()}/products/${id}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        check(res, { 'produto deletado com sucesso': r => r.status === 200 });
        return res;
    }

    getProductId() {
        return this.#productId;
    }
}