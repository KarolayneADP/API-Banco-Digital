let { contas, depositos, saques, transferencias } = require("../bancodedados");

const deposito = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(404).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    };
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "O numero da conta é invalido!" });
    };
    if (valor === undefined || valor <= 0) {
        return res.status(404).json({ mensagem: "Depositos com valores negativos ou iguais á 0, não são permitidos!" })
    }
    conta.saldo += valor;

    const depositoRealizado = {
        data: new Date(),
        numero_conta: numero_conta,
        valor: valor
    };

    depositos.push(depositoRealizado);
    return res.status(204).send();
};

const saque = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(404).json({ mensagem: "O número da conta, valor e senha são obrigatórios!" });
    };
    let conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "O numero da conta é invalido!" });
    };
    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "A senha digitada é inválida!" });
    };
    if (conta.saldo < valor) {
        return res.status(400).json({ mensagem: "O saldo é insuficiente para saque!" });
    };
    conta.saldo -= valor;

    const saqueRealizado = {
        data: new Date(),
        numero_conta: numero_conta,
        valor: valor
    };

    saques.push(saqueRealizado);
    return res.status(204).send();
};
const transferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(404).json({ mensagem: "Todos os dados são obrigatórios!" });
    };
    let contaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    });

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: "O numero da conta de origem é invalido!" });
    };
    let contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    });

    if (!contaDestino) {
        return res.status(404).json({ mensagem: "O numero da conta de destino é invalido!" });
    };
    if (contaOrigem.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "A senha digitada é inválida!" });
    };
    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: "O saldo é insuficiente para transferência!" });
    };

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const transferenciaRealizada = {
        data: new Date(),
        valor: valor,
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino
    };

    transferencias.push(transferenciaRealizada);
    return res.status(204).send();
};

module.exports = {
    deposito,
    saque,
    transferencia
};