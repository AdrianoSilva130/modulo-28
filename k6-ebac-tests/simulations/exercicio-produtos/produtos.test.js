import { group } from 'k6';
import Login from '../../request/login.request.js';
import Produtos from '../../request/produtos.request.js';
import Utils from '../../utils/utils.js';

const data = JSON.parse(open('../../data/usuarios.json'));

export const options = {
    stages: [
        { duration: '5s', target: 5 },
        { duration: '10s', target: 10 },
        { duration: '5s', target: 10 },
        { duration: '10s', target: 0 }
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000']
    }
};

function randomPrice(min = 50, max = 500) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function () {
    const login = new Login();
    const produtos = new Produtos();

    let token;

    group('login', () => {
        login.access(data.usuarioOk.user, data.usuarioOk.pass);
        token = login.getToken();
    });

    group('fluxo de produtos', () => {
        // Listar produtos
        produtos.list(token);

        // Criar produto
        const produto = {
            name: `Produto-${Math.random()}`,
            description: "Produto criado via k6",
            itemPrice: randomPrice()
        };
        const body = produtos.create(token, produto);
        const productId = body.id;

        // Deletar o produto criado
        produtos.deleteById(token, productId);
    });
}