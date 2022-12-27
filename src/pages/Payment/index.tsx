import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../App.css';

function Payment() {
    const location = useLocation()
    // const pixKey = "07529555-469d-498e-8c1c-8bc2e37dd29e"
    const pixKey = "amandaescaramal@yahoo.com.br"
    const [numberIMG, setNumberIMG] = useState<number>(1)
    const [textCopy, setTextCopy] = useState<String>("Copiar e-mail PIX")
    useEffect(() => {
        const interval = setInterval(() => {
            numberIMG < 6 ? setNumberIMG((previous) => previous + 1) : setNumberIMG(1)
        }, 4000);
        return () => clearInterval(interval);
    }, [numberIMG])


    return (
        <div className="App">
            <div className='header'>
                <h1 style={{ color: "#fc8381" }}>Rifa Solidária - Corrente do Bem</h1>
            </div>
            <div className='card'>
                <div className='div-form'>
                    <h3>Dados para transferência</h3>
                    <h3 className='zeroed'>Valor total: R$ {location.state.valueTotal} </h3>
                    <h3 className='zeroed'>Faça a tranferência do valor para a seguinte e-mail via PIX</h3>
                    <div style={{ backgroundColor: "#fff", padding: '5px', marginTop: '20px', marginBottom: '20px' }}>
                        <img src={require('../../assets/pix.png')} width={200} height={71} alt='imagem pix' />
                        <h5 style={{ marginBottom: '0' }}>Chave e-mail PIX</h5>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(pixKey)
                                setTextCopy("copiado!")
                            }}>{pixKey}
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(pixKey)
                                setTextCopy("copiado!")
                            }}
                            style={{ "fontSize": "13px", backgroundColor: "#fff" }}> {textCopy} </button>
                    </div>
                </div>
                <h3 style={{ padding: '0', marginTop: '20px', marginBottom: '0' }}>Regras da rifa</h3>
                <ul style={{ padding: '0', marginTop: '20px' }}>
                    <li> A data prevista para o sorteio sera dia 01/02/2023</li>
                    <li> O sorteio dará pelo site <a href="https://sorteador.com.br/sorteio-de-numeros" target={"_blank"} rel={"noopener noreferrer"}>Sorteador</a></li>
                    <li> Toda e qualquer duvida estarei disponível</li>
                </ul>
            </div>
        </div>
    );
}

export default Payment;
