//Ligando servidor
var express = require("express");
const path = require('path');
var app = express();
var porta = 80;

//Constantes de conexão ao banco de dados
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

app.use(express.urlencoded({
    extended: true
}));

//Definindo locais dos arquivos
app.use(express.static(path.join(__dirname, "/public")));

//Rotas usuário login/cadastro
app.get("/login", function (req, res){
    //Set formato do formato das views
    app.engine('.ejs', require('ejs').__express);
    app.set('view engine', 'ejs')

    //Renderiza view
    res.render('login');
});

app.listen(porta, () => {
    console.log(`Sistema iniciado com sucesso!`);
});