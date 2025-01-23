const AddButton = document.getElementById('Add');
const ListButton = document.getElementById('List');
const RemoveButton = document.getElementById('Remove');
const Form = document.getElementById('Form');
const Container = document.getElementById('Container');
const Cancel = document.getElementById('Cancel');
const Title = document.getElementById('Title');
const Descricao = document.getElementById('Descricao');
const Valor = document.getElementById('Valor');
const Button = document.getElementById('Button');
const ListDiv = document.getElementById('ListDiv');
const CancelList = document.getElementById('CancelList');
const Alertas = document.getElementById('Alerts');
const AlertsContent = document.getElementById('Alerts-Content');
const Total = document.getElementById('Total');
const body = document.getElementById('body');
let Validador;


function FadeInAnimation(){
    Container.animate([
        {opacity: 1},
        {opacity: 0},
        {opacity: 0},
        {opacity: 1}
    ], {
        easing: 'ease',
        duration: 1250
    })
}

function Alerts(Mensagem){
    Alertas.style.display = 'block';
    AlertsContent.innerHTML = Mensagem;
    const Centro = (body.offsetWidth/2) - (Alertas.offsetWidth/ 2);
    Alertas.style.left = `${Centro}px`;
    Alertas.animate([
        {top: '30%', opacity: 0},
        {top: '18%', opacity: 0.5},
        {top: '10%', opacity: 1},
        {top: '18%', opacity: 0.5},
        {top: '30%', opacity: 0}
    ], {
        duration: 4000,
        easing: 'ease-in-out',
        fill: 'forwards',
    });
    setTimeout(() => {
        Alertas.style.display = 'none'
    }, 3000);
    
}

function Changes(Remove){
    AddButton.style.display = 'none';
    ListButton.style.display = 'none';
    RemoveButton.style.display = 'none';
    Title.style.display = 'none';
    Form.style.display = 'flex';
    if(Remove == true){
        Valor.style.display = 'none';
        Valor.disabled = true;
        Button.innerHTML = 'Remover';
        Validador = 3;
    } else {
        Valor.style.display = 'block';
        Valor.disabled = false;
        Button.innerHTML = 'Adicionar';
        Validador = 1;
    }
}

function ReverseChanges(){
    AddButton.style.display = 'block';
    ListButton.style.display = 'block';
    RemoveButton.style.display = 'block';
    Title.style.display = 'block';
    Form.style.display = 'none';

}

function ListAnimation(){
    AddButton.style.display = 'none';
    ListButton.style.display = 'none';
    RemoveButton.style.display = 'none';
    Title.style.display = 'none';
    ListDiv.style.display = 'flex';
    Validador = 2;
}

function ReverseListAnimation(){
    AddButton.style.display = 'block';
    ListButton.style.display = 'block';
    RemoveButton.style.display = 'block';
    Title.style.display = 'block';
    ListDiv.style.display = 'none';
}

CancelList.addEventListener('click', () => {
    setTimeout(ReverseListAnimation, 500);
    FadeInAnimation();
})

Cancel.addEventListener('click', () => {
    setTimeout(ReverseChanges, 500);
    FadeInAnimation();
});

AddButton.addEventListener('click', () => {
    setTimeout(Changes, 500);
    FadeInAnimation();
});

RemoveButton.addEventListener('click', () => {
    setTimeout(() => Changes(true), 500);
    FadeInAnimation();
});

ListButton.addEventListener('click', () => {
    setTimeout(ListAnimation, 500);
    FadeInAnimation()
});

Form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if(Validador == 1){
        const FormData = {Descricao: Descricao.value, Valor: Valor.value, Validador: Validador};
        await fetch('http://127.0.0.1:3000/ProcessarDados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(FormData)
        })
        .then(Response => Response.json())
        .then(Response => {
            FadeInAnimation();
            Total.innerHTML = `Total: ${Response.ValorAtualizado}`;
        });
    } else if (Validador == 2){
        const FormData = {Validador: Validador};
        await fetch('http://127.0.0.1:3000/ProcessarDados', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(FormData)
        })
        .then(Response => Response.json())
        .then()
    } else {
        const FormData = {Descricao: Descricao.value, Validador: Validador};
        await fetch('http://127.0.0.1:3000/ProcessarDados', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(FormData)
        })
        .then(Response => Response.json())
        .then(Response => {
            if(Response.ValorAtualizado != null){
                FadeInAnimation();
                Total.innerHTML = `Total: ${Response.ValorAtualizado}`;  
            } else {
                Alerts(Response.Message);
            }
        })
    }
    
});