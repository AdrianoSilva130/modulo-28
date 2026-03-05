import http from "k6/http";
import { check } from "k6";
import Utils from "../utils/utils.js";

export default class Clientes {
    #customerId;

    // Listar clientes
    list(token) {
        const res = http.get(`${Utils.getBaseUrl()}/customers`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        check(res, { 'listagem de clientes deve retornar 200': r => r.status === 200 });
        return res.json(); // retorna JSON
    }

    // Criar cliente com endereço válido
    create(token, cliente) {
        const res = http.post(
            `${Utils.getBaseUrl()}/customers`,
            JSON.stringify(cliente),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        check(res, { 'cliente criado com sucesso': r => r.status === 201 });
        if (res.status === 201) this.#customerId = res.json().id;
        return res.json(); // retorna o corpo JSON
    }

    // Deletar cliente pelo ID
    deleteById(token, id) {
        const res = http.del(
            `${Utils.getBaseUrl()}/customers/${id}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        check(res, { 'cliente deletado com sucesso': r => r.status === 200 });
        return res;
    }

    getCustomerId() {
        return this.#customerId;
    }
}