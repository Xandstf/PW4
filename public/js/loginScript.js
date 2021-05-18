function toogleOptionLogin(opcao){
    if(opcao=='entrar'){
        document.getElementsByClassName('loginSection')[0].style.display = 'block';
        document.getElementsByClassName('cadastroSection')[0].style.display = 'none';
        document.getElementsByClassName('senhaSection')[0].style.display = 'none';
        document.getElementsByClassName('emailSection')[0].style.display = 'none';
        document.getElementsByClassName('btnEntrar')[0].style.borderColor = 'var(--cor-destaque)';
        document.getElementsByClassName('btnCadastro')[0].style.borderColor = 'var(--cor-secundaria)';
    }
    else if(opcao=='cadastrar'){
        document.getElementsByClassName('loginSection')[0].style.display = 'none';
        document.getElementsByClassName('cadastroSection')[0].style.display = 'block';
        document.getElementsByClassName('senhaSection')[0].style.display = 'none';
        document.getElementsByClassName('emailSection')[0].style.display = 'none';
        document.getElementsByClassName('btnEntrar')[0].style.borderColor = 'var(--cor-secundaria)';
        document.getElementsByClassName('btnCadastro')[0].style.borderColor = 'var(--cor-destaque)';
    }
    else if(opcao=='senha'){
        document.getElementsByClassName('loginSection')[0].style.display = 'none';
        document.getElementsByClassName('cadastroSection')[0].style.display = 'none';
        document.getElementsByClassName('emailSection')[0].style.display = 'none';
        document.getElementsByClassName('senhaSection')[0].style.display = 'block';
        document.getElementsByClassName('btnEntrar')[0].style.borderColor = 'var(--cor-secundaria)';
        document.getElementsByClassName('btnCadastro')[0].style.borderColor = 'var(--cor-secundaria)';
    }
    else if(opcao=='email'){
        document.getElementsByClassName('loginSection')[0].style.display = 'none';
        document.getElementsByClassName('cadastroSection')[0].style.display = 'none';
        document.getElementsByClassName('senhaSection')[0].style.display = 'none';
        document.getElementsByClassName('emailSection')[0].style.display = 'block';
        document.getElementsByClassName('btnEntrar')[0].style.borderColor = 'var(--cor-secundaria)';
        document.getElementsByClassName('btnCadastro')[0].style.borderColor = 'var(--cor-secundaria)';
    }
}

window.onload = function(){
    if(document.getElementById("dataRecived").innerText.trim()=="senha"){
        document.getElementById("errorTextLogin").innerText = "Senha incorreta! Tente novamente.";
        document.getElementsByClassName('inputSenha')[0].style.borderColor = 'var(--cor-destaque)';
    }
    else if(document.getElementById("dataRecived").innerText.trim()=="usuario"){
        document.getElementById("errorTextLogin").innerText = "Usuário incorreto! Tente novamente ou cadastre-se.";
        document.getElementsByClassName('inputUsuario')[0].style.borderColor = 'var(--cor-destaque)';
        document.getElementsByClassName('inputSenha')[0].style.borderColor = 'var(--cor-destaque)';
    }else if(document.getElementById("dataRecived").innerText.trim()=="existente"){
        document.getElementsByClassName('loginSection')[0].style.display = 'none';
        document.getElementsByClassName('cadastroSection')[0].style.display = 'block';
        document.getElementsByClassName('btnEntrar')[0].style.borderColor = 'var(--cor-secundaria)';
        document.getElementsByClassName('btnCadastro')[0].style.borderColor = 'var(--cor-destaque)';
        document.getElementById("errorTextCadastro").innerText = "Este usuário ja existe! Tente outro ou faça login.";
        document.getElementsByClassName('inputCadastroUsuario')[0].style.borderColor = 'var(--cor-destaque)';
    }
}