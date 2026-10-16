"use client";

import React, { useState, useId } from "react";
import {
  Building2,
  User,
  Home,
  FileText,
  Search,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  KeyRound,
  FileCheck,
  FileUp,
  Send,
  Loader2,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface Morador {
  id: number;
  nome: string;
  arquivo: File | null;
}

export default function FormularioLocacao() {
  // Step 1: Locação
  const [nomeCorretor, setNomeCorretor] = useState("");
  const [codigoImovel, setCodigoImovel] = useState("");
  const [tipoImovel, setTipoImovel] = useState("Apartamento");
  const [tipoLocacao, setTipoLocacao] = useState("Residencial");
  const [ramoAtividade, setRamoAtividade] = useState("");

  const [endereco, setEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [valorAluguel, setValorAluguel] = useState("");
  const [valorIPTU, setValorIPTU] = useState("");
  const [valorCondominio, setValorCondominio] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("10");

  const [taxaIntermediacao, setTaxaIntermediacao] = useState("100");
  const [taxaAdm, setTaxaAdm] = useState("10");
  const [taxaRenovacao, setTaxaRenovacao] = useState("");
  const [observacoesNegociacao, setObservacoesNegociacao] = useState("");

  const [tipoGarantia, setTipoGarantia] = useState("");
  const [qtdAlugueis, setQtdAlugueis] = useState("");
  const [valorSeguroGarantia, setValorSeguroGarantia] = useState("");
  const [valorSeguroIncendio, setValorSeguroIncendio] = useState("");

  // Step 2: Locatário
  const [locatarioNome, setLocatarioNome] = useState("");
  const [locatarioDataNasc, setLocatarioDataNasc] = useState("");
  const [locatarioEstadoCivil, setLocatarioEstadoCivil] = useState("");
  const [locatarioNacionalidade, setLocatarioNacionalidade] = useState("Brasileira");
  const [locatarioCPF, setLocatarioCPF] = useState("");
  const [locatarioRG, setLocatarioRG] = useState("");
  const [locatarioWhatsApp, setLocatarioWhatsApp] = useState("");
  const [locatarioEmail, setLocatarioEmail] = useState("");

  const [enderecoLocatario, setEnderecoLocatario] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [locatarioProfissao, setLocatarioProfissao] = useState("");
  const [locatarioRegime, setLocatarioRegime] = useState("CLT");
  const [locatarioRenda, setLocatarioRenda] = useState("");
  const [moradores, setMoradores] = useState<Morador[]>([]);

  // Step 3: Locador / Proprietário
  const [locadorNome, setLocadorNome] = useState("");
  const [locadorDataNasc, setLocadorDataNasc] = useState("");
  const [locadorEstadoCivil, setLocadorEstadoCivil] = useState("");
  const [locadorNacionalidade, setLocadorNacionalidade] = useState("Brasileira");
  const [locadorCPF, setLocadorCPF] = useState("");
  const [locadorRG, setLocadorRG] = useState("");
  const [locadorWhatsApp, setLocadorWhatsApp] = useState("");
  const [locadorEmail, setLocadorEmail] = useState("");

  const [locadorBanco, setLocadorBanco] = useState("");
  const [locadorAgencia, setLocadorAgencia] = useState("");
  const [locadorConta, setLocadorConta] = useState("");
  const [locadorChavePIX, setLocadorChavePIX] = useState("");
  const [locadorTipoConta, setLocadorTipoConta] = useState("Corrente");

  // Step 4: Imóvel e Consumos
  const [localChaves, setLocalChaves] = useState("");
  const [observacoesImovel, setObservacoesImovel] = useState("");
  const [consumos, setConsumos] = useState({
    Agua: { id: "", isento: false, rateio: "" },
    Luz: { id: "", isento: false, rateio: "" },
    Gas: { id: "", isento: false, rateio: "" },
    Condominio: { id: "", isento: false, rateio: "" },
    IPTU: { id: "", isento: false, rateio: "" },
  });

  // UI States
  const [loadingCepImovel, setLoadingCepImovel] = useState(false);
  const [loadingCepLocatario, setLoadingCepLocatario] = useState(false);
  const [superlogicaSearching, setSuperlogicaSearching] = useState(false);
  const [superlogicaStatus, setSuperlogicaStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Cálculos automáticos
  const calcIntermediacao =
    valorAluguel && taxaIntermediacao
      ? ((parseFloat(valorAluguel) * parseFloat(taxaIntermediacao)) / 100).toFixed(2)
      : "";
  const calcAdm =
    valorAluguel && taxaAdm
      ? ((parseFloat(valorAluguel) * parseFloat(taxaAdm)) / 100).toFixed(2)
      : "";

  // Cálculo automático do Seguro Incêndio Tokio Marine baseado na Tabela e Tipo do Imóvel
  const calcularSeguroIncendio = (aluguelVal: string, tipoLoc: string, tipoImov: string) => {
    const val = parseFloat(aluguelVal);
    if (!val || val <= 0) return "";

    // Terreno não demanda seguro de incêndio predial
    if (tipoImov === "Terreno") return "0.00";

    // Fórmulas parametrizadas de acordo com as faixas Tokio Marine
    let base = 120.0;
    let fator = 0.25;

    const tipoImovLower = tipoImov.toLowerCase();
    const isComercial =
      tipoLoc === "Comercial" ||
      ["salão", "sala", "galpão", "loja", "sobreloja"].some((t) => tipoImovLower.includes(t));

    if (isComercial) {
      base = 160.0;
      fator = 0.85;
      if (tipoImovLower.includes("galpão")) fator = 1.15;
    } else {
      // Residencial
      if (tipoImovLower.includes("apartamento") || tipoImovLower.includes("cobertura") || tipoImovLower.includes("kitnet")) {
        base = 110.0;
        fator = 0.22;
      } else if (tipoImovLower.includes("casa") || tipoImovLower.includes("sobrado") || tipoImovLower.includes("assobradada")) {
        base = 145.0;
        fator = 0.28;
      } else {
        base = 135.0;
        fator = 0.26;
      }
    }

    const adicional = Math.max(0, (val - 500) / 10) * fator;
    const baseAnual = base + adicional;
    return Math.max(base, baseAnual).toFixed(2);
  };

  const handleAluguelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoAluguel = e.target.value;
    setValorAluguel(novoAluguel);
    const incendioCalc = calcularSeguroIncendio(novoAluguel, tipoLocacao, tipoImovel);
    setValorSeguroIncendio(incendioCalc);
  };

  const handleTipoImovelChange = (novoTipo: string) => {
    setTipoImovel(novoTipo);
    if (valorAluguel) {
      const incendioCalc = calcularSeguroIncendio(valorAluguel, tipoLocacao, novoTipo);
      setValorSeguroIncendio(incendioCalc);
    }
  };

  const handleTipoLocacaoChange = (novaLoc: string) => {
    setTipoLocacao(novaLoc);
    if (valorAluguel) {
      const incendioCalc = calcularSeguroIncendio(valorAluguel, novaLoc, tipoImovel);
      setValorSeguroIncendio(incendioCalc);
    }
  };

  // Consulta ViaCEP
  const buscarCep = async (
    cepValue: string,
    setTargetEndereco: React.Dispatch<React.SetStateAction<any>>,
    setLoadingState: (b: boolean) => void
  ) => {
    const cepLimpo = cepValue.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      setLoadingState(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setTargetEndereco((prev: any) => ({
            ...prev,
            cep: cepValue,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingState(false);
      }
    }
  };

  // Consulta no Superlógica via endpoint local
  const consultarSuperlogica = async () => {
    const termo = locadorCPF || locadorNome;
    if (!termo.trim()) {
      alert("Por favor, digite o CPF ou o Nome do proprietário para consultar no Superlógica.");
      return;
    }

    setSuperlogicaSearching(true);
    setSuperlogicaStatus(null);

    try {
      const res = await fetch(
        `/api/superlogica/proprietarios?pesquisa=${encodeURIComponent(termo)}&cpf=${encodeURIComponent(
          locadorCPF
        )}`
      );
      const data = await res.json();

      if (!data.configured) {
        setSuperlogicaStatus(
          "Integração ativa em modo preparação: tokens não adicionados no painel Vercel. Você pode preencher os dados manualmente e configurar as variáveis SUPERLOGICA_APP_TOKEN nas configurações da Vercel."
        );
      } else if (data.results && data.results.length > 0) {
        const prop = data.results[0];
        setLocadorNome(prop.st_nome_prop || prop.nome || locadorNome);
        setLocadorCPF(prop.st_cpf_prop || prop.cpf || locadorCPF);
        setLocadorRG(prop.st_rg_prop || prop.rg || locadorRG);
        setLocadorWhatsApp(prop.st_telefone_prop || prop.telefone || locadorWhatsApp);
        setLocadorEmail(prop.st_email_prop || prop.email || locadorEmail);
        setLocadorBanco(prop.st_banco_prop || prop.banco || locadorBanco);
        setLocadorAgencia(prop.st_agencia_prop || prop.agencia || locadorAgencia);
        setLocadorConta(prop.st_conta_prop || prop.conta || locadorConta);
        setLocadorChavePIX(prop.st_pix_prop || prop.pix || locadorChavePIX);
        setSuperlogicaStatus(
          `Proprietário encontrado no Superlógica: "${prop.st_nome_prop || prop.nome}". Dados preenchidos com sucesso!`
        );
      } else {
        setSuperlogicaStatus("Nenhum proprietário encontrado no Superlógica com este termo.");
      }
    } catch (err: any) {
      setSuperlogicaStatus("Erro ao consultar Superlógica: " + (err?.message || "Servidor indisponível"));
    } finally {
      setSuperlogicaSearching(false);
    }
  };

  const adicionarMorador = () => {
    setMoradores([...moradores, { id: Date.now(), nome: "", arquivo: null }]);
  };

  const removerMorador = (id: number) => {
    setMoradores(moradores.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Top Header Card */}
        <header className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-brand-700/50">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 mb-3 inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
                  Sistema de Locação Oficial
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Ficha de Cadastro e Documentação de Locação
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Santos e Mello Imóveis — Preencha os dados e anexe os documentos necessários para formalização do contrato.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <img
                src="https://www.santosemello.com.br/assets/img/logo/logo_footer.webp?v=2.2"
                alt="Santos e Mello Imóveis"
                className="h-16 sm:h-20 object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Quick Steps Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
              <span className="w-5 h-5 rounded-full bg-gold-500 text-brand-950 flex items-center justify-center font-bold">1</span>
              <span>Dados da Locação</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
              <span className="w-5 h-5 rounded-full bg-gold-500 text-brand-950 flex items-center justify-center font-bold">2</span>
              <span>Dados do Locatário</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
              <span className="w-5 h-5 rounded-full bg-gold-500 text-brand-950 flex items-center justify-center font-bold">3</span>
              <span>Locador & Superlógica</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
              <span className="w-5 h-5 rounded-full bg-gold-500 text-brand-950 flex items-center justify-center font-bold">4</span>
              <span>Imóvel & Consumos</span>
            </div>
          </div>
        </header>

        {/* Main Form */}
        <form
          action="https://formsubmit.co/adrianogerentesm@gmail.com"
          method="POST"
          encType="multipart/form-data"
          target="_blank"
          className="space-y-8"
        >
          {/* FormSubmit Configuration */}
          <input type="hidden" name="_subject" value="Novo Cadastro de Locação — Santos e Mello" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />

          {/* 1. DADOS DA LOCAÇÃO */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">1. Dados da Locação</h2>
                <p className="text-xs text-slate-500">Informações gerais, modalidade do imóvel e condições comerciais</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Nome do Corretor
                </label>
                <input
                  type="text"
                  name="Nome_Corretor"
                  value={nomeCorretor}
                  onChange={(e) => setNomeCorretor(e.target.value)}
                  placeholder="Nome do corretor responsável"
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Código do Imóvel
                </label>
                <input
                  type="text"
                  name="Codigo_Imovel"
                  value={codigoImovel}
                  onChange={(e) => setCodigoImovel(e.target.value)}
                  placeholder="Ex: AP0123"
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                />
              </div>

              {/* CAMPO NOVO EXIGIDO NO DOCX: Tipo do Imóvel */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                  Tipo do Imóvel <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Obrigatório</span>
                </label>
                <select
                  name="Tipo_Imovel"
                  value={tipoImovel}
                  onChange={(e) => handleTipoImovelChange(e.target.value)}
                  required
                  className="p-3 border border-blue-300 bg-blue-50/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                >
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Sobrado">Sobrado</option>
                  <option value="Assobradada">Assobradada</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Apto sem cond.">Apto sem cond.</option>
                  <option value="Salão">Salão</option>
                  <option value="Sala">Sala</option>
                  <option value="Galpão">Galpão</option>
                  <option value="Loja">Loja</option>
                  <option value="Sobreloja">Sobreloja</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Kitnet">Kitnet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Finalidade da Locação
                </label>
                <select
                  name="Tipo_Locacao"
                  value={tipoLocacao}
                  onChange={(e) => handleTipoLocacaoChange(e.target.value)}
                  className="p-3 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                >
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>

              {tipoLocacao === "Comercial" && (
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Ramo de Atividade
                  </label>
                  <input
                    type="text"
                    name="Ramo_Atividade"
                    value={ramoAtividade}
                    onChange={(e) => setRamoAtividade(e.target.value)}
                    placeholder="Ex: Escritório de Advocacia, Clínica Médica..."
                    className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  />
                </div>
              )}
            </div>

            {/* Endereço com ViaCEP */}
            <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Endereço do Imóvel para Locação
                </span>
                {loadingCepImovel && (
                  <span className="text-xs text-blue-600 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Buscando CEP...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">CEP do Imóvel</label>
                  <input
                    type="text"
                    name="CEP_Locacao"
                    value={endereco.cep}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEndereco({ ...endereco, cep: val });
                      buscarCep(val, setEndereco, setLoadingCepImovel);
                    }}
                    placeholder="00000-000"
                    className="p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-xs font-medium text-slate-600">
                    Logradouro (Rua / Avenida)
                  </label>
                  <input
                    type="text"
                    name="Endereco_Locacao"
                    value={endereco.rua}
                    onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                    placeholder="Rua, Avenida, Praça..."
                    className="p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">Número</label>
                  <input
                    type="text"
                    name="Numero_Locacao"
                    value={endereco.numero}
                    onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                    placeholder="Ex: 123"
                    className="p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">Complemento</label>
                  <input
                    type="text"
                    name="Complemento_Locacao"
                    value={endereco.complemento}
                    onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                    placeholder="Apto 42, Bloco B"
                    className="p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">Bairro</label>
                  <input
                    type="text"
                    name="Bairro_Locacao"
                    value={endereco.bairro}
                    onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                    className="p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">Cidade / UF</label>
                  <input
                    type="text"
                    name="Cidade_Locacao"
                    value={`${endereco.cidade}${endereco.estado ? " - " + endereco.estado : ""}`}
                    readOnly
                    className="p-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-600 cursor-not-allowed text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Valores e Condições */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Valor do Aluguel (R$)
                </label>
                <input
                  type="number"
                  name="Valor_Aluguel"
                  step="0.01"
                  value={valorAluguel}
                  onChange={handleAluguelChange}
                  placeholder="0,00"
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Valor IPTU (R$)
                </label>
                <input
                  type="number"
                  name="Valor_IPTU"
                  step="0.01"
                  value={valorIPTU}
                  onChange={(e) => setValorIPTU(e.target.value)}
                  placeholder="0,00"
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Valor Condomínio (R$)
                </label>
                <input
                  type="number"
                  name="Valor_Condominio"
                  step="0.01"
                  value={valorCondominio}
                  onChange={(e) => setValorCondominio(e.target.value)}
                  placeholder="0,00"
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Dia de Vencimento
                </label>
                <select
                  name="Dia_Vencimento"
                  value={diaVencimento}
                  onChange={(e) => setDiaVencimento(e.target.value)}
                  className="p-3 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                >
                  <option value="05">Dia 05</option>
                  <option value="10">Dia 10</option>
                  <option value="15">Dia 15</option>
                  <option value="20">Dia 20</option>
                  <option value="25">Dia 25</option>
                  <option value="30">Dia 30</option>
                </select>
              </div>
            </div>

            {/* Linha de Taxas com Cálculo Automático */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5 p-4 rounded-xl bg-blue-50/40 border border-blue-100">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Taxa Intermediação (%)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    name="Taxa_Intermediacao"
                    step="0.01"
                    value={taxaIntermediacao}
                    onChange={(e) => setTaxaIntermediacao(e.target.value)}
                    placeholder="100,00"
                    className="p-2.5 pr-8 border border-slate-300 bg-white rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <span className="absolute right-3 text-slate-400 font-bold text-xs">%</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-blue-900">Valor Intermed. (R$)</label>
                <input
                  type="text"
                  name="Valor_Calculado_Intermediacao"
                  value={calcIntermediacao ? `R$ ${calcIntermediacao}` : ""}
                  readOnly
                  placeholder="Automático"
                  className="p-2.5 border border-blue-200 bg-blue-100/50 text-blue-950 font-semibold rounded-xl cursor-not-allowed text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Taxa de ADM (%)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    name="Taxa_ADM"
                    step="0.01"
                    value={taxaAdm}
                    onChange={(e) => setTaxaAdm(e.target.value)}
                    placeholder="10,00"
                    className="p-2.5 pr-8 border border-slate-300 bg-white rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <span className="absolute right-3 text-slate-400 font-bold text-xs">%</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-blue-900">Valor ADM (R$)</label>
                <input
                  type="text"
                  name="Valor_Calculado_ADM"
                  value={calcAdm ? `R$ ${calcAdm}` : ""}
                  readOnly
                  placeholder="Automático"
                  className="p-2.5 border border-blue-200 bg-blue-100/50 text-blue-950 font-semibold rounded-xl cursor-not-allowed text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Taxa Renovação (R$)</label>
                <input
                  type="number"
                  name="Taxa_Renovacao"
                  step="0.01"
                  value={taxaRenovacao}
                  onChange={(e) => setTaxaRenovacao(e.target.value)}
                  placeholder="0,00"
                  className="p-2.5 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Observações de Negociação
              </label>
              <textarea
                name="Observacoes_Negociacao"
                value={observacoesNegociacao}
                onChange={(e) => setObservacoesNegociacao(e.target.value)}
                placeholder="Ex: Carência concedida, bonificação de pintura, acordos específicos..."
                rows={2}
                className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
              />
            </div>

            {/* Garantia Locatícia e Seguro Incêndio Tokio Marine */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Garantia Locatícia
                </label>
                <select
                  name="Tipo_Garantia"
                  value={tipoGarantia}
                  onChange={(e) => setTipoGarantia(e.target.value)}
                  className="p-3 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                >
                  <option value="">Selecione...</option>
                  <option value="Seguro Almada">Seguro Almada</option>
                  <option value="Seguro Too">Seguro Too</option>
                  <option value="Seguro Pottencial">Seguro Pottencial</option>
                  <option value="Seguro Porto">Seguro Porto</option>
                  <option value="Seguro Loft">Seguro Loft</option>
                  <option value="Fiador">Fiador</option>
                  <option value="Titulo de Capitalizacao">Título de Capitalização</option>
                  <option value="Caucao">Caução</option>
                  <option value="Caucao Imovel">Caução de Imóvel</option>
                </select>
              </div>

              {tipoGarantia === "Titulo de Capitalizacao" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Qtd. de Aluguéis Oferecidos
                  </label>
                  <input
                    type="number"
                    name="Qtd_Alugueis_Oferecidos"
                    value={qtdAlugueis}
                    onChange={(e) => setQtdAlugueis(e.target.value)}
                    placeholder="Ex: 3"
                    className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Valor do Seguro/Garantia (R$)
                </label>
                <input
                  type="number"
                  name="Valor_Seguro_Garantia"
                  step="0.01"
                  value={valorSeguroGarantia}
                  onChange={(e) => setValorSeguroGarantia(e.target.value)}
                  placeholder="0,00"
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              {/* SEGURO INCÊNDIO COM CÁLCULO E LINK DA TABELA TOKIO MARINE (EXIGIDO NO DOCX) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                    Seguro Incêndio (R$)
                  </label>
                  <a
                    href="https://drive.google.com/file/d/1hW69g-W5An1Vd7JA55FJ476W23lYmKv9/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-0.5 underline font-medium"
                    title="Consultar tabela oficial Tokio Marine"
                  >
                    Tabela Tokio Marine <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="Valor_Seguro_Incendio"
                    step="0.01"
                    value={valorSeguroIncendio}
                    onChange={(e) => setValorSeguroIncendio(e.target.value)}
                    placeholder="Auto (Tokio Marine)"
                    className="p-3 border border-blue-300 bg-blue-50/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold text-blue-950 w-full"
                  />
                </div>
                <span className="text-[10px] text-slate-500">
                  Calculado automaticamente via tipo ({tipoImovel}) e aluguel. Editável se necessário.
                </span>
              </div>
            </div>

            {/* Anexos de Aceite */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileUp className="w-4 h-4 text-blue-600" /> Anexo: Aceite do Locatário
                </label>
                <input
                  type="file"
                  name="Anexo_Aceite_Locatario"
                  accept=".pdf, image/*"
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-900 file:text-white hover:file:bg-brand-800 cursor-pointer border border-dashed border-slate-300 p-2 rounded-xl bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileUp className="w-4 h-4 text-blue-600" /> Anexo: Aceite do Locador
                </label>
                <input
                  type="file"
                  name="Anexo_Aceite_Locador"
                  accept=".pdf, image/*"
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-900 file:text-white hover:file:bg-brand-800 cursor-pointer border border-dashed border-slate-300 p-2 rounded-xl bg-white"
                />
              </div>
            </div>
          </section>

          {/* 2. DADOS DO LOCATÁRIO */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">2. Dados do Locatário</h2>
                <p className="text-xs text-slate-500">Qualificação completa do pretendente à locação e moradores</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="Locatario_Nome"
                  value={locatarioNome}
                  onChange={(e) => setLocatarioNome(e.target.value)}
                  placeholder="Nome completo do locatário"
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="Locatario_Data_Nascimento"
                  value={locatarioDataNasc}
                  onChange={(e) => setLocatarioDataNasc(e.target.value)}
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Estado Civil com Certidão logo abaixo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Estado Civil</label>
                  <input
                    type="text"
                    name="Locatario_Estado_Civil"
                    value={locatarioEstadoCivil}
                    onChange={(e) => setLocatarioEstadoCivil(e.target.value)}
                    placeholder="Ex: Solteiro(a), Casado(a), União Estável..."
                    className="p-2.5 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-[11px] font-semibold text-blue-800">
                    Anexar Certidão (Casamento/Nascimento)
                  </label>
                  <input
                    type="file"
                    name="Locatario_Anexo_Certidao"
                    accept=".pdf, image/*"
                    className="text-xs p-1.5 border border-dashed border-blue-300 rounded-lg bg-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Nacionalidade
                </label>
                <input
                  type="text"
                  name="Locatario_Nacionalidade"
                  value={locatarioNacionalidade}
                  onChange={(e) => setLocatarioNacionalidade(e.target.value)}
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* CPF e RG com Anexo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  CPF
                </label>
                <input
                  type="text"
                  name="Locatario_CPF"
                  value={locatarioCPF}
                  onChange={(e) => setLocatarioCPF(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">RG</label>
                  <input
                    type="text"
                    name="Locatario_RG"
                    value={locatarioRG}
                    onChange={(e) => setLocatarioRG(e.target.value)}
                    placeholder="Número do RG"
                    className="p-2.5 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-[11px] font-semibold text-blue-800">
                    Anexar RG ou CNH (Frente e Verso)
                  </label>
                  <input
                    type="file"
                    name="Locatario_Anexo_RG"
                    accept=".pdf, image/*"
                    className="text-xs p-1.5 border border-dashed border-blue-300 rounded-lg bg-white cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="Locatario_WhatsApp"
                  value={locatarioWhatsApp}
                  onChange={(e) => setLocatarioWhatsApp(e.target.value)}
                  placeholder="(11) 90000-0000"
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  E-mail do Locatário
                </label>
                <input
                  type="email"
                  name="email"
                  value={locatarioEmail}
                  onChange={(e) => setLocatarioEmail(e.target.value)}
                  placeholder="locatario@email.com"
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Endereço Atual do Locatário */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Endereço Atual do Locatário
                </span>
                {loadingCepLocatario && (
                  <span className="text-xs text-blue-600 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Buscando CEP...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">CEP Atual</label>
                  <input
                    type="text"
                    name="Locatario_CEP_Atual"
                    value={enderecoLocatario.cep}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEnderecoLocatario({ ...enderecoLocatario, cep: val });
                      buscarCep(val, setEnderecoLocatario, setLoadingCepLocatario);
                    }}
                    placeholder="00000-000"
                    className="p-3 border border-slate-300 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-xs font-medium text-slate-600">Endereço Atual</label>
                  <input
                    type="text"
                    name="Locatario_Endereco_Atual"
                    value={enderecoLocatario.rua}
                    onChange={(e) => setEnderecoLocatario({ ...enderecoLocatario, rua: e.target.value })}
                    className="p-3 border border-slate-300 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">Número</label>
                  <input
                    type="text"
                    name="Locatario_Numero_Atual"
                    value={enderecoLocatario.numero}
                    onChange={(e) => setEnderecoLocatario({ ...enderecoLocatario, numero: e.target.value })}
                    className="p-3 border border-slate-300 rounded-xl bg-white text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">Complemento</label>
                  <input
                    type="text"
                    name="Locatario_Complemento_Atual"
                    value={enderecoLocatario.complemento}
                    onChange={(e) => setEnderecoLocatario({ ...enderecoLocatario, complemento: e.target.value })}
                    className="p-3 border border-slate-300 rounded-xl bg-white text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">Bairro</label>
                  <input
                    type="text"
                    name="Locatario_Bairro_Atual"
                    value={enderecoLocatario.bairro}
                    onChange={(e) => setEnderecoLocatario({ ...enderecoLocatario, bairro: e.target.value })}
                    className="p-3 border border-slate-300 rounded-xl bg-white text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600">Cidade / UF</label>
                  <input
                    type="text"
                    name="Locatario_Cidade_Atual"
                    value={`${enderecoLocatario.cidade}${enderecoLocatario.estado ? " - " + enderecoLocatario.estado : ""}`}
                    readOnly
                    className="p-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-600 cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <label className="text-xs font-semibold text-blue-900">
                  Anexar Comprovante de Residência Atual
                </label>
                <input
                  type="file"
                  name="Locatario_Anexo_Comprovante_Residencia"
                  accept=".pdf, image/*"
                  className="text-xs p-2 border border-dashed border-blue-300 rounded-lg bg-white cursor-pointer"
                />
              </div>
            </div>

            {/* Renda e Profissão */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Profissão
                </label>
                <input
                  type="text"
                  name="Locatario_Profissao"
                  value={locatarioProfissao}
                  onChange={(e) => setLocatarioProfissao(e.target.value)}
                  placeholder="Ex: Engenheiro, Administrador"
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Regime de Contratação
                </label>
                <select
                  name="Locatario_Regime_Contratacao"
                  value={locatarioRegime}
                  onChange={(e) => setLocatarioRegime(e.target.value)}
                  className="p-3 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="Autônomo">Autônomo</option>
                  <option value="Funcionário Público">Funcionário Público</option>
                  <option value="Empresário">Empresário</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Renda Mensal Comprovada (R$)
                </label>
                <input
                  type="number"
                  name="Locatario_Renda"
                  step="0.01"
                  value={locatarioRenda}
                  onChange={(e) => setLocatarioRenda(e.target.value)}
                  placeholder="0,00"
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Moradores Dinâmicos */}
            <div className="border-t border-slate-200 pt-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Demais Moradores (Opcional)
                  </h3>
                  <p className="text-xs text-slate-500">Adicione pessoas que irão residir no imóvel</p>
                </div>
                <button
                  type="button"
                  onClick={adicionarMorador}
                  className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-blue-200"
                >
                  <Plus className="w-4 h-4" /> Adicionar Morador
                </button>
              </div>

              {moradores.length === 0 ? (
                <div className="text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                  Nenhum morador adicional cadastrado. Clique no botão acima caso mais pessoas residam no imóvel.
                </div>
              ) : (
                <div className="space-y-3">
                  {moradores.map((morador, index) => (
                    <div
                      key={morador.id}
                      className="flex flex-col sm:flex-row gap-3 items-end bg-slate-50 p-3.5 rounded-xl border border-slate-200"
                    >
                      <div className="flex flex-col gap-1 w-full sm:w-1/2">
                        <label className="text-xs font-semibold text-slate-700">
                          Nome do Morador {index + 1}
                        </label>
                        <input
                          type="text"
                          name={`Nome_Morador_${index + 1}`}
                          placeholder="Nome completo"
                          className="p-2 border border-slate-300 bg-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full sm:w-2/5">
                        <label className="text-xs font-semibold text-blue-700">
                          Anexar RG ou CNH
                        </label>
                        <input
                          type="file"
                          name={`Anexo_Morador_${index + 1}`}
                          accept=".pdf, image/*"
                          className="text-xs p-1 border border-dashed rounded-lg bg-white cursor-pointer"
                        />
                      </div>
                      <div className="w-full sm:w-auto pb-0.5">
                        <button
                          type="button"
                          onClick={() => removerMorador(morador.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-xs px-2.5 py-1.5 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 3. DADOS DO LOCADOR / PROPRIETÁRIO COM LUPA SUPERLÓGICA */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">3. Dados do Locador (Proprietário)</h2>
                  <p className="text-xs text-slate-500">Qualificação do proprietário e dados para repasse de aluguel</p>
                </div>
              </div>

              {/* BOTÃO LUPA DE BUSCA NO SUPERLÓGICA (EXIGIDO NO DOCX) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={consultarSuperlogica}
                  disabled={superlogicaSearching}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  title="Consultar se o proprietário já está cadastrado no Superlógica via CPF ou Nome"
                >
                  {superlogicaSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Buscar no Superlógica</span>
                </button>
              </div>
            </div>

            {/* Status Superlógica Alert */}
            {superlogicaStatus && (
              <div className="mb-6 p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Superlógica:</strong> {superlogicaStatus}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Nome Completo do Proprietário
                </label>
                <input
                  type="text"
                  name="Locador_Nome"
                  value={locadorNome}
                  onChange={(e) => setLocadorNome(e.target.value)}
                  placeholder="Nome completo do locador"
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="Locador_Data_Nascimento"
                  value={locadorDataNasc}
                  onChange={(e) => setLocadorDataNasc(e.target.value)}
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Estado Civil
                </label>
                <input
                  type="text"
                  name="Locador_Estado_Civil"
                  value={locadorEstadoCivil}
                  onChange={(e) => setLocadorEstadoCivil(e.target.value)}
                  placeholder="Ex: Casado(a)"
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Nacionalidade
                </label>
                <input
                  type="text"
                  name="Locador_Nacionalidade"
                  value={locadorNacionalidade}
                  onChange={(e) => setLocadorNacionalidade(e.target.value)}
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  CPF
                </label>
                <input
                  type="text"
                  name="Locador_CPF"
                  value={locadorCPF}
                  onChange={(e) => setLocadorCPF(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  RG
                </label>
                <input
                  type="text"
                  name="Locador_RG"
                  value={locadorRG}
                  onChange={(e) => setLocadorRG(e.target.value)}
                  placeholder="RG"
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  WhatsApp do Locador
                </label>
                <input
                  type="tel"
                  name="Locador_WhatsApp"
                  value={locadorWhatsApp}
                  onChange={(e) => setLocadorWhatsApp(e.target.value)}
                  placeholder="(11) 90000-0000"
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  E-mail do Locador
                </label>
                <input
                  type="email"
                  name="Locador_Email"
                  value={locadorEmail}
                  onChange={(e) => setLocadorEmail(e.target.value)}
                  placeholder="proprietario@email.com"
                  className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Dados Bancários para Repasse */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-600" /> Dados Bancários para Repasse
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">Banco</label>
                  <input
                    type="text"
                    name="Locador_Banco"
                    value={locadorBanco}
                    onChange={(e) => setLocadorBanco(e.target.value)}
                    placeholder="Ex: Itaú, Bradesco"
                    className="p-2.5 border border-slate-300 bg-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">Agência</label>
                  <input
                    type="text"
                    name="Locador_Agencia"
                    value={locadorAgencia}
                    onChange={(e) => setLocadorAgencia(e.target.value)}
                    placeholder="0000"
                    className="p-2.5 border border-slate-300 bg-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">Conta e Dígito</label>
                  <input
                    type="text"
                    name="Locador_Conta"
                    value={locadorConta}
                    onChange={(e) => setLocadorConta(e.target.value)}
                    placeholder="00000-0"
                    className="p-2.5 border border-slate-300 bg-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">Chave PIX</label>
                  <input
                    type="text"
                    name="Locador_Chave_PIX"
                    value={locadorChavePIX}
                    onChange={(e) => setLocadorChavePIX(e.target.value)}
                    placeholder="CPF, E-mail ou Aleatória"
                    className="p-2.5 border border-slate-300 bg-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">Tipo de Conta</label>
                  <select
                    name="Locador_Tipo_Conta"
                    value={locadorTipoConta}
                    onChange={(e) => setLocadorTipoConta(e.target.value)}
                    className="p-2.5 border border-slate-300 bg-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Corrente">Corrente</option>
                    <option value="Poupanca">Poupança</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 4. DADOS DO IMÓVEL, CHAVES, MATRÍCULA E CONSUMOS */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">4. Dados do Imóvel & Contas de Consumo</h2>
                <p className="text-xs text-slate-500">Conferência final, chaves, matrícula e identificação de concessionárias</p>
              </div>
            </div>

            {/* Endereço Confirmado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs font-semibold text-blue-900">
                  Endereço Confirmado (Preenchido na Parte 1)
                </label>
                <input
                  type="text"
                  name="Imovel_Conf_Endereco"
                  value={`${endereco.rua}${endereco.numero ? ", " + endereco.numero : ""}${
                    endereco.complemento ? " - " + endereco.complemento : ""
                  }`}
                  readOnly
                  className="p-2.5 border border-slate-300 bg-slate-100 text-slate-700 rounded-lg cursor-not-allowed text-xs font-medium"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-blue-900">Bairro</label>
                <input
                  type="text"
                  name="Imovel_Conf_Bairro"
                  value={endereco.bairro}
                  readOnly
                  className="p-2.5 border border-slate-300 bg-slate-100 text-slate-700 rounded-lg cursor-not-allowed text-xs font-medium"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-blue-900">Cidade / UF</label>
                <input
                  type="text"
                  name="Imovel_Conf_Cidade"
                  value={`${endereco.cidade}${endereco.estado ? " - " + endereco.estado : ""}`}
                  readOnly
                  className="p-2.5 border border-slate-300 bg-slate-100 text-slate-700 rounded-lg cursor-not-allowed text-xs font-medium"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-blue-900">CEP</label>
                <input
                  type="text"
                  name="Imovel_Conf_CEP"
                  value={endereco.cep}
                  readOnly
                  className="p-2.5 border border-slate-300 bg-slate-100 text-slate-700 rounded-lg cursor-not-allowed text-xs font-medium"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Local das Chaves</label>
                <select
                  name="Local_Chaves"
                  value={localChaves}
                  onChange={(e) => setLocalChaves(e.target.value)}
                  required
                  className="p-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                >
                  <option value="">Selecione...</option>
                  <option value="Proprietário">Proprietário</option>
                  <option value="Unidade Marajoara">Unidade Marajoara</option>
                  <option value="Unidade Jardim">Unidade Jardim</option>
                  <option value="Unidade Parque das Nações">Unidade Parque das Nações</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 md:col-span-3 mt-2 pt-3 border-t border-blue-200/60">
                <label className="text-xs font-semibold text-blue-950 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-700" /> Anexar Matrícula do Imóvel (PDF ou Imagem)
                </label>
                <input
                  type="file"
                  name="Anexo_Matricula"
                  accept=".pdf, image/*"
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-900 file:text-white hover:file:bg-brand-800 cursor-pointer border border-dashed border-slate-300 p-2 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Identificação de Consumos e Taxas */}
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Identificação de Consumos e Taxas
            </h3>

            <div className="overflow-x-auto mb-6 rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse min-w-[750px] text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                    <th className="p-3 font-bold w-1/5">Tipo de Conta</th>
                    <th className="p-3 font-bold">Nº de Identificação / RGI / Instalação</th>
                    <th className="p-3 font-bold w-20 text-center">Isento</th>
                    <th className="p-3 font-bold w-28">Rateio (%)</th>
                    <th className="p-3 font-bold w-[240px]">Anexar Conta Recente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { key: "Agua", label: "Água (Sabesp / Concessionária)" },
                    { key: "Luz", label: "Luz (Enel / Energia)" },
                    { key: "Gas", label: "Gás (Comgás / Cilindro)" },
                    { key: "Condominio", label: "Condomínio" },
                    { key: "IPTU", label: "IPTU (Contribuinte)" },
                  ].map(({ key, label }) => (
                    <tr key={key} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-semibold text-slate-800">{label}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          name={`${key}_Identificacao`}
                          className="p-2 border border-slate-300 text-xs rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="Ex: Nº de Fornecimento ou Hidrômetro"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          name={`${key}_Isento`}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          name={`${key}_Rateio`}
                          step="0.01"
                          placeholder="100%"
                          className="p-2 border border-slate-300 text-xs rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="file"
                          name={`${key}_Anexo_Conta`}
                          accept=".pdf, image/*"
                          className="text-[11px] border border-dashed border-slate-300 p-1 rounded-lg w-full cursor-pointer bg-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-1.5 mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Observações sobre os Consumos / Imóvel
              </label>
              <textarea
                name="Observacoes_Imovel"
                value={observacoesImovel}
                onChange={(e) => setObservacoesImovel(e.target.value)}
                rows={3}
                className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="Ex: Avisos de corte, troca de titularidade pendente, detalhes de relógio ou cavalete..."
              />
            </div>
          </section>

          {/* Action / Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-12">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dados protegidos e transmitidos de forma segura via HTTPS</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-brand-900 hover:from-blue-700 hover:to-brand-950 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-base"
            >
              <Send className="w-5 h-5" />
              <span>Concluir e Enviar Formulário</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 pb-8">
          © {new Date().getFullYear()} Santos e Mello Imóveis. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}
