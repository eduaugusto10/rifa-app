import React from 'react'
import axios from 'axios'


const api = axios.create({
    baseURL: 'http://18.216.236.25/api'
    // baseURL: 'http://localhost:5000'
})

export default api

