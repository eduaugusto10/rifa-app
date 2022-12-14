import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../App.css';
import api from '../../services/api';

interface Rifa {
    id: number,
    status: string,
    name: string,
    order: number
}
interface RifaNum {
    numbers: number
}
function Home() {

    const location = useLocation()
    const history = useNavigate()
    const [rifaNumbers, setRifaNumbers] = useState<Rifa[]>([])
    const [numberIMG, setNumberIMG] = useState<number>(1)
    const [chooseNumber, setChooseNumber] = useState<RifaNum[]>([])
    const [orders, setOrders] = useState<number>()
    const nameRef = useRef<HTMLInputElement | null>(null)
    const emailRef = useRef<HTMLInputElement | null>(null)
    const emailRecRef = useRef<HTMLInputElement | null>(null)
    const cpfRef = useRef<HTMLInputElement | null>(null)
    const phoneRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
        const interval = setInterval(() => {
            numberIMG < 6 ? setNumberIMG((previous) => previous + 1) : setNumberIMG(1)
        }, 4000);
        return () => clearInterval(interval);
    }, [numberIMG])

    useEffect(() => {
        api.get('/rifa')
            .then(res => {
                setRifaNumbers(res.data)
            })
            .catch(error => console.log(error))
    }, [])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (nameRef.current?.value != null && emailRef.current?.value != null) {
            const orderGen = Math.round(Math.random() * (99999 - 0 + 1) + 0)
            setOrders(orderGen)
            for (let i = 0; i < chooseNumber.length; i++) {
                try {
                    api.put(`/rifa/${chooseNumber[i].numbers}`, {
                        name: nameRef.current?.value,
                        email: emailRef.current?.value,
                        cpf: cpfRef.current?.value,
                        phone: phoneRef.current?.value,
                        status: "Reservado",
                        order: orderGen
                    }).then(res => history('/payment', {
                        state: {
                            orderGen,
                            valueTotal: (chooseNumber.length * 25).toFixed(2)
                        }
                    }))
                        .catch(error => console.log(error))
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
    const handleFindReserve = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            api.get(`/rifa/${emailRecRef.current?.value}`
            ).then(res => history('/payment', {
                state: {
                    orderGen: res.data.order,
                    valueTotal: (res.data.length * 25).toFixed(2)
                }
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const handleReserve = (index: number) => {
        const reserve = [...rifaNumbers]
        const rifaNum = [...chooseNumber]
        if (reserve[index].status === "Dispon??vel") {
            reserve[index].status = "Reservado"
            setRifaNumbers(reserve)

            rifaNum.push({ numbers: reserve[index].id })
            setChooseNumber(rifaNum)
        }
    }

    return (
        <div className="App">
            <div className='header'>
                <h1 style={{ color: "#fc8381" }}>Rifa Solid??ria - Corrente do Bem</h1>
            </div>
            <div className='apresentation'>
                <div className='text-card'>
                    <h4>Resolvi n??o apenas praticar o voluntariado, participando de a????es sociais em ONG's, mas tamb??m doar algumas joias minhas
                        da joalheria HStern para rifa-las e com valor arrecadado doar alimentos pesssoas em situa????o de rua.
                    </h4>
                    <ul>
                        <li> Conjunto contendo 3 Aneis de ouro ros?? 18K, sendo um deles com diamantes cognac - Cole????o "MyCollection HStern" (R$ 5.750,00)</li>
                        <li> Colar de ouro ros?? e Ouro Nobre 18K com diamantes cognac - Cora????o flechado- Cole????o "MyCollection HStern" (R$ 6.200,00)</li>
                    </ul>
                </div>
                <img className='images' src={require(`../../assets/${numberIMG}.jpeg`)} alt={"j??ias"} width={300} height={300} />
            </div>
            <h1>Escolha seus n??meros</h1>
            <h4 className='valor-rifa'>O valor de cada n??mero da rifa ?? de R$25,00 e poder?? ser pago via PIX, escolha quantos n??meros voc?? quiser!</h4>
            <div className="grid-numbers">
                {rifaNumbers && rifaNumbers.map((rifa, index) => (
                    <div key={rifa.id} className={`card-number ${rifa.status === "Vendido" ? 'sell' : rifa.status === "Reservado" ? 'reserved' : 'free'}`} onClick={() => handleReserve(index)}>
                        <span >{rifa.status}</span>
                        <span>{rifa.id}</span>
                        <span className='name-buy'>{rifa.name.split(" ", 1)}</span>
                    </div>
                ))}
            </div>
            <div className='card' style={{ backgroundColor: '#f7f5f5' }}>
                <h1>Pagar</h1>
                <form className='div-form' onSubmit={handleSubmit}>
                    <h3>N??mero(s) escolhido(s): </h3>
                    <div className='choose-numbers'>
                        {chooseNumber && chooseNumber.map((choose) => (
                            <span>{`${choose.numbers},`}</span>
                        ))}
                    </div>
                    <h3>Valor total: R$ {chooseNumber.length > 0 ? (chooseNumber.length * 25).toFixed(2) : "0.00"} </h3>
                    <h3>Insira seus dados:</h3>
                    <div className='form-input'>
                        <h4 className='h4adj' >Nome</h4>
                        <input type={'text'} placeholder="Nome*" ref={nameRef} maxLength={35} required />
                        <h4 className='h4adj'>E-mail</h4>
                        <input type={'text'} placeholder="E-mail*" ref={emailRef} maxLength={80} required />
                        <input type={'submit'} value="Pagar" style={{ cursor: 'pointer', marginLeft: '10px' }} />
                    </div>
                </form>
                <form className='div-form' onSubmit={handleFindReserve}>
                    <h3 style={{ margin: '0' }}>**Resgatar reserva**</h3>
                    <h5 style={{ margin: '0' }}>Fiz uma reserva em outro momento mas ainda n??o paguei!</h5>
                    <h3>Insira seu e-mail cadastrado:</h3>
                    <div className='form-input'>
                        <h4 className='h4adj'>E-mail</h4>
                        <input type={'text'} placeholder="E-mail*" ref={emailRecRef} maxLength={80} required />
                        <input type={'submit'} value="Recuperar e Pagar" style={{ cursor: 'pointer', marginLeft: '10px' }} />
                    </div>
                </form>
                <h3 style={{ padding: '0', marginTop: '20px', marginBottom: '0' }}>Regras da rifa</h3>
                <ul style={{ padding: '0', marginTop: '20px' }}>
                    <li> A data prevista para o sorteio sera dia 01/02/2023</li>
                    <li> O sorteio dar?? pelo site <a href="https://sorteador.com.br/sorteio-de-numeros" target={"_blank"} rel={"noopener noreferrer"}>Sorteador</a></li>
                    <li> Toda e qualquer duvida estarei dispon??vel</li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
