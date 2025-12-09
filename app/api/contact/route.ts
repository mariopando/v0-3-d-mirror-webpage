import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, mensaje } = body

    // Validate input
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son requeridos" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    // Get environment variables from server
    const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL
    const bearerToken = process.env.API_CONTACT_BEARER_TOKEN

    if (!apiUrl || !bearerToken) {
      console.error("Missing API configuration")
      return NextResponse.json(
        { error: "Configuración de API incompleta" },
        { status: 500 }
      )
    }

    // Make request to external API with Bearer token
    const externalResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        nombre,
        email,
        mensaje,
      }),
    })

    if (!externalResponse.ok) {
      const errorData = await externalResponse.text()
      console.error("External API error:", errorData)
      return NextResponse.json(
        { error: "Error al procesar tu solicitud" },
        { status: externalResponse.status }
      )
    }

    const responseData = await externalResponse.json()

    return NextResponse.json(
      {
        success: true,
        message: "Mensaje enviado correctamente",
        data: responseData,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    )
  }
}
