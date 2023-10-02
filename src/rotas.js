const express = require('express');

let { verificarSenhaDoBanco, criarConta, atualizarConta, excluirConta, verificarSaldo, imprimirExtrato } = require('./controladores/controledecontas');
let { deposito, saque, transferencia } = require('./controladores/transacoes');

const rotas = express();

rotas.get('/contas', verificarSenhaDoBanco);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarConta);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', deposito);
rotas.post('/transacoes/sacar', saque);
rotas.post('/transacoes/transferir', transferencia);
rotas.get('/contas/saldo', verificarSaldo);
rotas.get('/contas/extrato', imprimirExtrato);

module.exports = rotas;