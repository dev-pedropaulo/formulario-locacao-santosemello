import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const appToken = process.env.SUPERLOGICA_APP_TOKEN;
  const accessToken = process.env.SUPERLOGICA_ACCESS_TOKEN;

  let bodyData;
  try {
    bodyData = await request.json();
  } catch {
    return NextResponse.json(
      { error: true, message: "Corpo da requisição inválido" },
      { status: 400 }
    );
  }

  if (!appToken || !accessToken) {
    return NextResponse.json(
      {
        configured: false,
        success: false,
        message:
          "Tokens do Superlógica não configurados no servidor (SUPERLOGICA_APP_TOKEN e SUPERLOGICA_ACCESS_TOKEN). O contrato não foi criado automaticamente no Superlógica, mas os dados foram preparados.",
        dataRecebida: bodyData,
      },
      { status: 200 }
    );
  }

  try {
    const url = "https://api.superlogica.net/v2/imob/contratos";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        app_token: appToken,
        access_token: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          configured: true,
          success: false,
          status: res.status,
          message: "Falha ao registrar contrato na API Superlógica",
          response: result,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      configured: true,
      success: true,
      message: "Contrato cadastrado com sucesso no Superlógica!",
      response: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        configured: true,
        success: false,
        message: error?.message || "Erro de conexão com o Superlógica",
      },
      { status: 500 }
    );
  }
}
