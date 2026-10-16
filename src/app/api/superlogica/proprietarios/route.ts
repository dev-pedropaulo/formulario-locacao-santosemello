import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pesquisa = searchParams.get("pesquisa") || "";
  const cpf = searchParams.get("cpf") || "";

  const appToken = process.env.SUPERLOGICA_APP_TOKEN;
  const accessToken = process.env.SUPERLOGICA_ACCESS_TOKEN;

  if (!appToken || !accessToken) {
    return NextResponse.json(
      {
        configured: false,
        message:
          "Tokens do Superlógica não configurados no servidor (SUPERLOGICA_APP_TOKEN e SUPERLOGICA_ACCESS_TOKEN). Preencha manualmente ou configure as variáveis de ambiente na Vercel.",
        results: [],
      },
      { status: 200 }
    );
  }

  try {
    const termo = cpf || pesquisa;
    const url = `https://api.superlogica.net/v2/imob/proprietarios?status=0&pesquisa=${encodeURIComponent(
      termo
    )}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        app_token: appToken,
        access_token: accessToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        {
          configured: true,
          error: true,
          status: res.status,
          message: `Erro na API Superlógica: ${errText || res.statusText}`,
          results: [],
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      configured: true,
      error: false,
      results: Array.isArray(data) ? data : data ? [data] : [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        configured: true,
        error: true,
        message: error?.message || "Falha ao conectar com Superlógica",
        results: [],
      },
      { status: 500 }
    );
  }
}
