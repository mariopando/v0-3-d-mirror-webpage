"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"

export default function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm(prev => ({ ...prev, [name]: value }))
  }
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterForm(prev => ({ ...prev, [name]: value }))
  }
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulación de inicio de sesión
    setIsLoggedIn(true)
  }
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulación de registro
    setIsLoggedIn(true)
  }
  
  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  // Datos de muestra para pedidos
  const orders = [
    {
      id: "ORD-12345",
      date: "15/05/2023",
      total: 280000,
      status: "Entregado",
      items: [
        { name: "Espejo Infinito Cuadrado", quantity: 1, price: 280000 }
      ]
    },
    {
      id: "ORD-12346",
      date: "22/06/2023",
      total: 350000,
      status: "En proceso",
      items: [
        { name: "Espejo Infinito Rectangular", quantity: 1, price: 320000 },
        { name: "Controlador LED RGB", quantity: 1, price: 30000 }
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {isLoggedIn ? (
          <div className="max-w-6xl
