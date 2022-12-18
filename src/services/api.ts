import React from 'react'
import axios from 'axios'


const api = axios.create({
    baseURL: 'https://rifasolidariacorrentedobem.store/api'
    // baseURL: 'http://localhost:5000'
})

export default api

