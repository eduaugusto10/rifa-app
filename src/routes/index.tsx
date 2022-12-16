import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Payment from '../pages/Payment'


const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path='/payment' element={<Payment />} />
            <Route path='/' element={<Home />} />
        </Routes>
    </BrowserRouter>
)

export default Router