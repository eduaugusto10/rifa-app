import React, { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import api from './services/api';

interface Rifa {
  id: number,
  status: string,
  name: string,
  order: number
}
interface RifaNum {
  numbers: number
}
function App() {
  const pixKey = "07529555-469d-498e-8c1c-8bc2e37dd29e"
  const [rifaNumbers, setRifaNumbers] = useState<Rifa[]>([])
  const [numberIMG, setNumberIMG] = useState<number>(1)
  const [chooseNumber, setChooseNumber] = useState<RifaNum[]>([])
  const [change, setChange] = useState<Boolean>(false)
  const [orders, setOrders] = useState<number>()
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const cpfRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const [textCopy, setTextCopy] = useState<String>("copiar")
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
          }).then(res => console.log(res))
            .catch(error => console.log(error))
        } catch (error) {
          console.log(error)
        }
      }
    }
    setChange(previous => !previous)

  }
  const handleReserve = (index: number) => {
    const reserve = [...rifaNumbers]
    const rifaNum = [...chooseNumber]
    if (reserve[index].status === "Disponível") {
      reserve[index].status = "Reservado"
      setRifaNumbers(reserve)

      rifaNum.push({ numbers: reserve[index].id })
      setChooseNumber(rifaNum)
    }
  }

  return (
    <div className="App">
      <div className='header'>
        <h1 style={{ color: "#fc8381" }}>Rifa Solidária - Corrente do Bem</h1>
      </div>
      <div className='apresentation'>
        <div className='text-card'>
          <h4>Este mês resolvi não apenas praticar o voluntariado, participando de ações sociais em ONG's, mas também doar algumas joias minhas
            da joalheria HStern para rifa-las e com valor arrecadado montar e doar kits de Natal para crianças de comunidades e em situação de rua. </h4>
          <ul>
            <li> Conjunto contendo 3 Aneis de ouro rosé 18K, sendo um deles com diamantes cognac - Coleção "MyCollection HStern" (R$ 5.750,00)</li>
            <li> Colar de ouro rosé e Ouro Nobre 18K com diamantes cognac - Coração flechado- Coleção "MyCollection HStern" (R$ 6.200,00)</li>
          </ul>
        </div>
        <img className='images' src={require(`./assets/${numberIMG}.jpeg`)} alt={"jóias"} width={300} height={300} />
      </div>
      <h4 className='valor-rifa'>O valor da rifa é de R$25,00 e poderá ser pago via PIX ou transferência bancária</h4>
      <h4 className='valor-rifa'>Escolha quantos números você quiser!</h4>
      <div className="grid-numbers">
        {rifaNumbers && rifaNumbers.map((rifa, index) => (
          <div className={`card-number ${rifa.status === "Vendido" ? 'sell' : rifa.status === "Reservado" ? 'reserved' : 'free'}`} key={index} onClick={() => handleReserve(index)}>
            <span >{rifa.status}</span>
            <span>{rifa.id}</span>
            <span className='name-buy'>{rifa.name.split(" ", 1)}</span>
          </div>
        ))}
      </div>
      <div className='card'>
        <h3>Número(s) escolhido(s): </h3>
        <div className='choose-numbers'>
          {chooseNumber && chooseNumber.map((choose) => (
            <span>{choose.numbers} , </span>
          ))}
        </div>
        <h3>Valor total: R$ {chooseNumber.length > 0 ? (chooseNumber.length * 25).toFixed(2) : "0.00"} </h3>
        {!change && (
          <form className='div-form' onSubmit={handleSubmit}>
            <h3>Insira seus dados para reservar</h3>
            <input type={'text'} placeholder="Nome*" ref={nameRef} maxLength={35} required />
            <input type={'text'} placeholder="E-mail*" ref={emailRef} maxLength={80} required />
            <input type={'number'} placeholder="Telefone" ref={phoneRef} />
            <input type={'number'} placeholder="CPF" ref={cpfRef} />
            <input type={'submit'} value="Reservar" style={{ cursor: 'pointer' }} />
            <span style={{ "fontSize": "13px" }}>Nome e e-mail são obrigatórios</span>
          </form>
        )}
        {change && (
          <div className='div-form'>
            <h3>Número(s) reservado(s) com sucesso!</h3>
            <h3>Para finalizar faça o PIX no valor acima</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(pixKey)
                setTextCopy("copiado!")
              }}>Chave PIX: {pixKey}
              <span style={{ "fontSize": "10px", backgroundColor: "#fff" }}> {textCopy} </span>
            </button>
            <ul className='pix'>
              <li>Insira na descrição do PIX: <span className='stronger'>{orders}</span></li>
              <li>E assim conseguiremos identificar o pagamento</li>
            </ul>
          </div>
        )}
        <h3>Regras da rifa</h3>
        <ul>
          <li> A data prevista para o sorteio sera dia 1/1/2023</li>
          <li> O sorteio dará pelo site <a href="https://sorteador.com.br/sorteio-de-numeros" target={"_blank"} rel={"noopener noreferrer"}>Sorteador</a></li>
          <li> Toda e qualquer duvida estarei disponível</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
