import React from 'react'
import axios from 'axios'


const api = axios.create({
    baseURL: 'http://18.220.168.76/api'
    // baseURL: 'http://localhost:5000'
})

export default api

