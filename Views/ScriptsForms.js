const TransitonButton = document.getElementById('Mudar');
const Divtransition = document.getElementById('Div-Transition');
const Forms = document.getElementById('Form');
const SignUser = document.getElementById('Sign-User');
const SignPassword = document.getElementById('Sign-Password');
const SignConfirmPassword = document.getElementById('Confirm-Sign-Password');
const LoginUser = document.getElementById('Login-User');
const LoginPassword = document.getElementById('Login-Password');
const Alertas = document.getElementById('Alerts');
const AlertsContent = document.getElementById('Alerts-Content');
const FormCamps = ['Login-Camps', 'Sign-Camps'];
const Body = document.getElementById('Body');
let Turn = false;

function TurnCamps(){
    if(!Turn){
        for(let Camp of document.getElementsByClassName(FormCamps[0])){
            Camp.disabled = true;
        }
        for(let Camp of document.getElementsByClassName(FormCamps[1])){
            Camp.disabled = false;
        }
        Turn = true;
    } else {
        for(let Camp of document.getElementsByClassName(FormCamps[1])){
            Camp.disabled = true;
        }
        for(let Camp of document.getElementsByClassName(FormCamps[0])){
            Camp.disabled = false;
        }
        Turn = false;
    }
}


function Alerts(Mensagem){
    AlertsContent.innerHTML = Mensagem;
    const Centro = (Body.offsetWidth/2) - (Alertas.offsetWidth / 2);
    Alertas.style.left = `${Centro}px`;
    Alertas.animate([
        {top: '30%', opacity: 0},
        {top: '20%', opacity: 0.5},
        {top: '18%', opacity: 1},
        {top: '20%', opacity: 0.5},
        {top: '30%', opacity: 0}
    ], {
        duration: 3000,
        easing: 'ease-in-out',
        fill: 'forwards',
    }); 
}

Forms.addEventListener('submit', async (event) => {
    event.preventDefault();
    if(!Turn){
        const FormsData = {Name: LoginUser.value, Password: LoginPassword.value, Validador: Turn};
        console.log(FormsData);
        await fetch('http://127.0.0.1:3000/Processar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(FormsData)
        })
        .then(Response => Response.json())
        .then(Response => {
            if(Response.redirect){
                window.location.href = Response.redirect; 
            } else {
                Alerts(Response.message);
            }
        }).catch(err => {
            console.error('Erro: '+ err);
        });
    } else {
        const FormsData = {Name: SignUser.value, Password: SignPassword.value, Validador: Turn};
        console.log(FormsData);
        if(SignPassword.value == SignConfirmPassword.value){           
            console.log(FormsData);
            await fetch('http://127.0.0.1:3000/Processar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(FormsData)
            })
            .then(Response => Response.json())
            .then(Response => { 
                Alerts(Response.message);
            }).catch(err => {
                console.error('Erro: '+ err);
            });
        } else {
            console.log('Senhas Incorretas!');
            Alerts('As senhas devem ser iguais!');
        }
    }
})


TransitonButton.addEventListener('click', () => {
    if(!Turn){
        Divtransition.animate([
            {left: '50%' , opacity: 1},
            {left: '25%', opacity: 0},
            {left: '0%', opacity: 1}
        ], {
            duration: 500,
            fill: 'forwards',
            easing: 'ease'
        });
        TurnCamps();
        document.getElementById('Title').innerHTML = 'Já Possui Uma Conta?';
        document.getElementById('Subtitle').innerHTML = 'Entre Aqui!';
        document.getElementById('Mudar').innerHTML = 'Entrar';
    } else {
        Divtransition.animate([
            {left: '0%' , opacity: 1},
            {left: '25%', opacity: 0},
            {left: '50%', opacity: 1}
        ], {
            duration: 500,
            fill: 'forwards',
            direction: "alternate"
        });
        TurnCamps();
        document.getElementById('Title').innerHTML = 'Não Possui Uma Conta?';
        document.getElementById('Subtitle').innerHTML = 'Cadastre-Se!';
        document.getElementById('Mudar').innerHTML = 'Cadastrar';
    }
});