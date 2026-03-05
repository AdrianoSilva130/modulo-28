import http from "k6/http";
import { check } from "k6";
import Utils from "../utils/utils.js";

export default class Addresses {
    #addressId;

    // Listar endereços
    list(token) {
        const res = http.get(`${Utils.getBaseUrl()}/addresses`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        check(res, { "listagem de endereços deve retornar 200": r => r.status === 200 });
        return res.json();
    }

    // Criar endereço
    create(token) {
        const random = Math.floor(Math.random() * 100000);
        const address = {
            street: `Rua ${random}`,
            number: `${random}`,
            city: "São Paulo",
            state: "SP",
            zipCode: `${10000000 + random}`
        };

        const res = http.post(
            `${Utils.getBaseUrl()}/addresses`,
            JSON.stringify(address),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        check(res, { "endereço criado com sucesso": r => r.status === 201 });
        if (res.status === 201) this.#addressId = res.json().id;

        return res.json();
    }

    getAddressId() {
        return this.#addressId;
    }
}