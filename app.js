//Ligando servidor
var express = require("express");
const path = require('path');
var app = express();
var porta = 80;

//Constantes de conexão ao banco de dados
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

//Inicializa banco de dados usuarios
const adapterUsuarios = new FileSync('./public/database/usuarios.json');
const dbUsuarios = low(adapterUsuarios);

//Usuário atual (Permissão e Nome)
var USUARIO_PERMISSAO_ATUAL = '';
var USUARIO_NOME_ATUAL = '';

app.use(express.urlencoded({
    extended: true
}));

//Definindo locais dos arquivos
app.use(express.static(path.join(__dirname, "/public")));

//Rotas usuário login/cadastro
app.get("/", function (req, res){
    //Set formato do formato das views
    app.engine('.ejs', require('ejs').__express);
    app.set('view engine', 'ejs')

    //Renderiza view de acordo com estado atual do sistema
    if(USUARIO_PERMISSAO_ATUAL == ''){
        res.render('login', {status: 'login'});
    }else if(USUARIO_PERMISSAO_ATUAL == 'senhaIncorreta'){
        res.render('login', {status: 'senha'});
    }else if(USUARIO_PERMISSAO_ATUAL == 'usuarioIncorreto'){
        res.render('login', {status: 'usuario'});
    }else if(USUARIO_PERMISSAO_ATUAL == 'usuarioExistente'){
        res.render('login', {status: 'existente'});
    }
});
app.post("/autenticar", function (req, res){
    //Variáveis
    var usuario = req.body.usuario;
    var senha = req.body.senha;

    //Autenticando
    if(dbUsuarios.has(usuario) == true){
        if(dbUsuarios.getState()[usuario]["senha"] == senha){//Sucesso
            USUARIO_PERMISSAO_ATUAL = dbUsuarios.getState()[usuario]["permissao"];
            USUARIO_NOME_ATUAL = dbUsuarios.getState()[usuario]["nome"];
            res.render('receitas', {nomeUsuario: USUARIO_NOME_ATUAL, permissaoUsuario: USUARIO_PERMISSAO_ATUAL});
        }else{//Senha incorreta
            USUARIO_PERMISSAO_ATUAL = 'senhaIncorreta';
            res.redirect("/");
        }
    }else{//Usuario inexistente
        USUARIO_PERMISSAO_ATUAL = 'usuarioIncorreto';
        res.redirect("/");
    }
});
app.post("/cadastrar", function (req, res){
    //Variáveis
    var nome = req.body.nome;
    var usuario = req.body.usuario;
    var senha = req.body.senha;

    //Verificações e Salvamento
    if(dbUsuarios.has(usuario) == true){//usuario existente
        USUARIO_PERMISSAO_ATUAL = 'usuarioExistente';
        res.redirect("/");
    }else{//Salvando no banco de usuarios
        dbUsuarios.set(usuario, {
            nome: nome,
            senha: senha,
            permissao: "VST"
        }).write()
        //Redirecionando para home
        USUARIO_PERMISSAO_ATUAL = dbUsuarios.getState()[usuario]["permissao"];
        USUARIO_NOME_ATUAL = dbUsuarios.getState()[usuario]["nome"];
        res.render('receitas', {nomeUsuario: USUARIO_NOME_ATUAL, permissaoUsuario: USUARIO_PERMISSAO_ATUAL});
    }
});

//Rotas sistema
app.get("/receitas", function (req, res){
    //Set formato do formato das views
    app.engine('.ejs', require('ejs').__express);
    app.set('view engine', 'ejs')

    //Valida login
    if(USUARIO_PERMISSAO_ATUAL == ''){
        res.redirect("/");
    }else{
        //Passando informações do usuário
        res.render('receitas', {nomeUsuario: USUARIO_NOME_ATUAL, permissaoUsuario: USUARIO_PERMISSAO_ATUAL});
    }
});

app.listen(porta, () => {
    console.log(`Sistema iniciado com sucesso!`);
});