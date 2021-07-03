//Ligando servidor
var express = require("express");
var i18n = require("i18n");
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

i18n.configure({
    locales: ["pt", "en"],
    directory: __dirname+"/locais",
    cookie: "receitas"
});

app.use(i18n.init);

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
            res.redirect("/home")
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
        res.redirect("/home")
    }
});

app.get("/home", function(req, res) {
    res.redirect("http://localhost:3000/home")
});

app.get('/api/usuario', function(req, res) {
    var usuario={
        nome: USUARIO_NOME_ATUAL,
        permissao: USUARIO_PERMISSAO_ATUAL
    }
    res.json(usuario)
})

//Visualizar todas as receitas
app.get("/api/receitas", function (req, res){
    //Valida login
   // if(USUARIO_PERMISSAO_ATUAL == ''){
     //   res.redirect("/");
    //}else{
        const receitas = require('./public/database/receitas.json')
        //Passando informações
        res.json(receitas);
    }
);

//Adicionar uma receita
app.put("/receitas", function (req, res){
    //Set formato do formato das views
    app.engine('.ejs', require('ejs').__express);
    app.set('view engine', 'ejs')

    //Valida login
    if(USUARIO_PERMISSAO_ATUAL == ''){
        res.redirect("/");
    }else{
        //Passando informações
        titulo = res.__("titlePagAddReceita");
        res.render('infoReceita', {nomeUsuario: USUARIO_NOME_ATUAL, permissaoUsuario: USUARIO_PERMISSAO_ATUAL, titulo: titulo, acao: "add"});
    }
});

//Visualizar uma receita
app.get("/receitas/:nomeReceita", function (req, res){
    //Set formato do formato das views
    app.engine('.ejs', require('ejs').__express);
    app.set('view engine', 'ejs')

    //Valida login
  //  if(USUARIO_PERMISSAO_ATUAL == ''){
       // res.redirect("/");
   // }else{
        //Passando informações
        nomeReceita = req.params.nomeReceita;
        const receitas = require('./public/database/receitas.json')
        receita = receitas.find(rec => rec.id == nomeReceita)
        res.json(receita);
// }
});

//Editar uma receita
app.put("/receitas/:nomeReceita", function (req, res){
    //Set formato do formato das views
    app.engine('.ejs', require('ejs').__express);
    app.set('view engine', 'ejs')

    //Valida login
    if(USUARIO_PERMISSAO_ATUAL == ''){
        res.redirect("/");
    }else{
        //Passando informações
        titulo = res.__("titlePagEditarReceita") + req.params.nomeReceita;
        res.render('infoReceita', {nomeUsuario: USUARIO_NOME_ATUAL, permissaoUsuario: USUARIO_PERMISSAO_ATUAL, titulo:  titulo, acao: "edit"});
    }
});

//Excluir uma receita
app.delete("/receitas/:nomeReceita", function (req, res){
    //Set formato do formato das views
    app.engine('.ejs', require('ejs').__express);
    app.set('view engine', 'ejs')

    //Valida login
    //if(USUARIO_PERMISSAO_ATUAL == ''){
      //  res.redirect("/");
  //  }else{
        //Passando informações
        titulo = res.__("titlePagExcluirReceita") + req.params.nomeReceita;
        res.render('receitas', {nomeUsuario: USUARIO_NOME_ATUAL, permissaoUsuario: USUARIO_PERMISSAO_ATUAL, titulo: titulo});
  //  }
});

app.listen(porta, () => {
    console.log(`Sistema iniciado com sucesso!`);
});