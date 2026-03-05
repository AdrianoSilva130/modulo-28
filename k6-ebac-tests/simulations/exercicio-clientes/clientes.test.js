import { group, check } from 'k6';
import http from 'k6/http';
import Login from '../../request/login.request.js';
import Clientes from '../../request/clientes.request.js';
import Utils from '../../utils/utils.js';

const data = JSON.parse(open('../../data/usuarios.json'));

export const options = {
    stages: [
        { duration: '1s', target: 2 },
        { duration: '5s', target: 5 },
        { duration: '1s', target: 5 },
        { duration: '5s', target: 0 },
    ],
    thresholds: { http_req_duration: ['p(95)<2000'] },
};

function random(min = 1000, max = 9999) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function () {
    const login = new Login();
    const clientes = new Clientes();

    let token;

    group('Login e gerar token', () => {
        login.access(data.usuarioOk.user, data.usuarioOk.pass);
        token = login.getToken();
        console.log('TOKEN GERADO:', token);
    });

    group('Fluxo de clientes completo', () => {

        // 1️⃣ Criar endereço válido
        const enderecoPayload = {
            address_1: `Rua ${random()}`,
            address_2: `Apto ${random()}`,
            city: "São Paulo",
            state: "SP",
            zip: 10000000 + random()
        };

        const enderecoRes = http.post(
            `${Utils.getBaseUrl()}/addresses`,
            JSON.stringify(enderecoPayload),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        check(enderecoRes, { 'endereço criado com sucesso': r => r.status === 201 });
        const novoEndereco = enderecoRes.json();
        console.log("ENDEREÇO CRIADO:", JSON.stringify(novoEndereco, null, 2));

        if (!novoEndereco.id) {
            console.error("Nenhum endereço válido retornado. Teste abortado.");
            return;
        }

        // 2️⃣ Criar cliente usando o endereço válido
        const clientePayload = {
            firstName: `Nome-${random()}`,
            lastName: `Sobrenome-${random()}`,
            email: `user${random()}@teste.com`,
            phone: `+5511${random()}`,
            address: { id: novoEndereco.id }
        };

        const createdCustomer = clientes.create(token, clientePayload);
        console.log("CLIENTE CRIADO COM ID:", createdCustomer.id);

        check(createdCustomer, { 'cliente criado com sucesso': c => !!c.id });

        // 3️⃣ Deletar cliente criado
        clientes.deleteById(token, createdCustomer.id);
        console.log("CLIENTE DELETADO:", createdCustomer.id);

    });
}