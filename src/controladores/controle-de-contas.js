let { contas, banco, numeroConta, depositos, saques, transferencias } = require("../bancodedados");

const verificarSenhaDoBanco = (req, res, next) => {
    const senhaInformada = req.query.senha_banco;
    const senhaCorreta = banco.senha;

    if (!senhaInformada) {
        return res.status(400).json({ mensagem: "A senha é obrigatória!" });
    }
    if (senhaInformada !== senhaCorreta) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
    }
    next()
    return res.status(200).json(contas);
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const contaExistente = contas.find((conta) => conta.cpf === cpf || conta.email === email);

    if (contaExistente) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    };


    const novaConta = {
        "numero": Number(numeroConta++),
        "saldo": 0,
        "usuario": {
            "nome": nome,
            "cpf": cpf,
            "data_nascimento": data_nascimento,
            "telefone": telefone,
            "email": email,
            "senha": senha
        }
    };

    contas.push(novaConta);
    return res.status(201).send();
};

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    };

    const contaExistente = contas.find((conta) => conta.cpf === cpf || conta.email === email);

    if (contaExistente) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    };
    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "O numero da conta é invalido!" });
    };

    const atualizacao = {
        nome: nome,
        cpf: cpf,
        data_nascimento: data_nascimento,
        telefone: telefone,
        email: email,
        senha: senha
    };

    contas.push(atualizacao);
    return res.status(204).send();
};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "O numero da conta é invalido!" });
    };

    if (conta.saldo !== 0) {
        return res.status(404).json({ mensagem: "Para excluir a conta, o saldo precisa de R$00,00!" })
    }

    contas = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta);
    });

    return res.status(204).send();
};
const verificarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O numero da conta e senha são obrigatórios!" });
    };

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "O numero da conta é invalido!" });
    };

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "A senha digitada é inválida!" });
    };

    return res.status(200).json({ saldo: conta.saldo });

}
const imprimirExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O numero da conta e senha são obrigatórios!" });
    }
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "O numero da conta é invalido!" });
    };
    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "A senha digitada é inválida!" });
    };

    const depositosRealizados = depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta;
    });

    const saquesRealizados = saques.filter((saque) => {
        return saque.numero_conta === numero_conta;
    });

    const transferenciasRealizadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta;
    });

    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta;
    });

    return res.status(200).json({
        depositosRealizados, saquesRealizados,
        transferenciasRealizadas, transferenciasRecebidas
    });
}

module.exports = {
    verificarSenhaDoBanco,
    criarConta,
    atualizarConta,
    excluirConta,
    verificarSaldo,
    imprimirExtrato
};