// ==================================================
// EMITIR RECIBO — COMPLETO E LIMPO ✅
// Sem upload de arquivo — apenas referência de texto
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Página carregada — tudo pronto!");

  // ------------------------------
  // MÁSCARAS com Regex
  // ------------------------------
  function aplicarMascaraCPF(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    return valor;
  }

  function aplicarMascaraWhats(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d{4})/, "$1-$2");
    return valor;
  }

  // ------------------------------
  // MOSTRAR/ESCONDER SERVIÇO AVULSO
  // ------------------------------
  function verificarPacote() {
    const valor = document.getElementById("rec-pacote")?.value || "";
    const campoExtra = document.getElementById("campo-servico-avulso");
    if (campoExtra) {
      if (valor.startsWith("Serviço Avulso")) {
        campoExtra.classList.remove("oculto");
      } else {
        campoExtra.classList.add("oculto");
      }
    }
  }

  // ------------------------------
  // VALIDAÇÕES
  // ------------------------------
  function validarNome(nome) {
    return nome.trim().length >= 5;
  }

  function validarFormatoCPF(cpf) {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
  }

  function validarCPFCompleto(cpf) {
    const numeros = cpf.replace(/\D/g, "");
    if (numeros.length !== 11) return false;
    if (/^(\d)\1+$/.test(numeros)) return false;
    const digitos = numeros.split("").map(Number);

    let soma1 = 0;
    for (let i = 0; i < 9; i++) soma1 += digitos[i] * (10 - i);
    let resto1 = (soma1 * 10) % 11;
    if (resto1 === 10) resto1 = 0;
    if (resto1 !== digitos[9]) return false;

    let soma2 = 0;
    for (let i = 0; i < 10; i++) soma2 += digitos[i] * (11 - i);
    let resto2 = (soma2 * 10) % 11;
    if (resto2 === 10) resto2 = 0;
    if (resto2 !== digitos[10]) return false;

    return true;
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validarWhats(whats) {
    if (!whats) return true;
    return /^\(\d{2}\) \d{5}-\d{4}$/.test(whats);
  }

  function dataISOHoje() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  function formatarData(dataISO) {
    const partes = (dataISO || "").split("-");
    if (partes.length !== 3) return new Date().toLocaleDateString("pt-BR");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function gerarNumeroRecibo() {
    const ano = new Date().getFullYear();
    const chave = `vetus-recibo-sequencia-${ano}`;
    try {
      const atual = Number(window.localStorage.getItem(chave) || "0");
      const proximo = atual + 1;
      if (!Number.isSafeInteger(proximo) || proximo < 1) {
        throw new Error("Sequência de recibos inválida");
      }
      window.localStorage.setItem(chave, String(proximo));
      return `VT-${ano}-${String(proximo).padStart(5, "0")}`;
    } catch {
      const agora = new Date();
      const dataHora = [
        agora.getFullYear(),
        String(agora.getMonth() + 1).padStart(2, "0"),
        String(agora.getDate()).padStart(2, "0"),
        String(agora.getHours()).padStart(2, "0"),
        String(agora.getMinutes()).padStart(2, "0"),
        String(agora.getSeconds()).padStart(2, "0"),
        String(agora.getMilliseconds()).padStart(3, "0"),
      ].join("");
      return `VT-${ano}-${dataHora}`;
    }
  }

  function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, (caractere) => {
      const entidades = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entidades[caractere];
    });
  }

  function atribuirNumeroRecibo(dados) {
    const numeroInput = document.getElementById("rec-numero");
    const numero = numeroInput?.value.trim() || gerarNumeroRecibo();
    if (numeroInput) numeroInput.value = numero;
    dados.numero = numero;
  }

  function mostrarErro(idCampo, idErro, mensagem) {
    const campo = document.getElementById(idCampo);
    const erro = document.getElementById(idErro);
    if (campo) {
      if (mensagem) {
        campo.classList.add("invalido");
        if (erro) erro.textContent = mensagem;
      } else {
        campo.classList.remove("invalido");
        if (erro) erro.textContent = "";
      }
    }
  }

  // ------------------------------
  // CARD DE AJUDA DO CPF
  // ------------------------------
  const iconeAjudaCpf = document.getElementById("icone-ajuda-cpf");
  const cardAjudaCpf = document.getElementById("card-ajuda-cpf");
  if (iconeAjudaCpf && cardAjudaCpf) {
    iconeAjudaCpf.addEventListener("click", (e) => {
      e.stopPropagation();
      cardAjudaCpf.classList.toggle("oculto");
    });
    document.addEventListener("click", (e) => {
      if (
        !iconeAjudaCpf.contains(e.target) &&
        !cardAjudaCpf.contains(e.target)
      ) {
        cardAjudaCpf.classList.add("oculto");
      }
    });
  }

  // ------------------------------
  // EVENTOS EM TEMPO REAL
  // ------------------------------
  const selectPacote = document.getElementById("rec-pacote");
  if (selectPacote) selectPacote.addEventListener("change", verificarPacote);

  const inputCpf = document.getElementById("rec-cpf");
  if (inputCpf) {
    inputCpf.addEventListener("input", function () {
      this.value = aplicarMascaraCPF(this.value);
      if (!this.value) mostrarErro("rec-cpf", "rec-cpf-erro", "");
      else if (!validarFormatoCPF(this.value))
        mostrarErro("rec-cpf", "rec-cpf-erro", "Formato: 000.000.000-00");
      else if (!validarCPFCompleto(this.value))
        mostrarErro(
          "rec-cpf",
          "rec-cpf-erro",
          "CPF inválido — confira os números",
        );
      else mostrarErro("rec-cpf", "rec-cpf-erro", "");
    });
  }

  const inputEmail = document.getElementById("rec-email");
  if (inputEmail) {
    inputEmail.addEventListener("blur", function () {
      if (!this.value) mostrarErro("rec-email", "rec-email-erro", "");
      else if (!validarEmail(this.value))
        mostrarErro("rec-email", "rec-email-erro", "E-mail inválido");
      else mostrarErro("rec-email", "rec-email-erro", "");
    });
  }

  const inputWhats = document.getElementById("rec-whats");
  if (inputWhats) {
    inputWhats.addEventListener("input", function () {
      this.value = aplicarMascaraWhats(this.value);
      if (!this.value) mostrarErro("rec-whats", "rec-whats-erro", "");
      else if (!validarWhats(this.value))
        mostrarErro("rec-whats", "rec-whats-erro", "Formato: (XX) XXXXX-XXXX");
      else mostrarErro("rec-whats", "rec-whats-erro", "");
    });
  }

  // ------------------------------
  // COLETAR DADOS DO FORMULÁRIO
  // ------------------------------
  function coletarDados() {
    const nome = (document.getElementById("rec-nome")?.value || "").trim();
    const cpf = document.getElementById("rec-cpf")?.value || "";
    const email = (document.getElementById("rec-email")?.value || "").trim();
    const whats = (document.getElementById("rec-whats")?.value || "").trim();
    const numero = document.getElementById("rec-numero")?.value.trim() || "";
    const pacoteValor = (
      document.getElementById("rec-pacote")?.value || ""
    ).split("|");
    let pacote = pacoteValor[0] || "";
    const valor = pacoteValor[1] || "0";
    const pagamento = document.getElementById("rec-forma")?.value || "";
    const comprovanteRef =
      (document.getElementById("rec-comprovante")?.value || "").trim() ||
      "";
    const obs = (document.getElementById("rec-obs")?.value || "").trim();
    const dataRecebimentoISO =
      document.getElementById("rec-data")?.value || dataISOHoje();
    const dataRecebimento = formatarData(dataRecebimentoISO);
    const dataHoje = new Date().toLocaleDateString("pt-BR");
    const valorFormatado =
      "R$ " + parseFloat(valor).toFixed(2).replace(".", ",");

    if (pacote === "Serviço Avulso") {
      const descricao = (
        document.getElementById("rec-servico-desc")?.value || ""
      ).trim();
      pacote = "Serviço Avulso: " + descricao;
    }

    return {
      numero,
      nome,
      cpf,
      email,
      whats,
      pacote,
      valorFormatado,
      pagamento,
      comprovanteRef,
      obs,
      dataRecebimento,
      dataHoje,
    };
  }

  function validarDados(dados) {
    if (!validarNome(dados.nome)) {
      mostrarErro("rec-nome", "rec-nome-erro", "Digite o nome completo");
      return false;
    }
    mostrarErro("rec-nome", "rec-nome-erro", "");

    if (!validarFormatoCPF(dados.cpf) || !validarCPFCompleto(dados.cpf)) {
      mostrarErro(
        "rec-cpf",
        "rec-cpf-erro",
        "CPF inválido — confira os números",
      );
      return false;
    }

    if (dados.email && !validarEmail(dados.email)) {
      mostrarErro("rec-email", "rec-email-erro", "E-mail inválido");
      return false;
    }
    mostrarErro("rec-email", "rec-email-erro", "");

    if (dados.whats && !validarWhats(dados.whats)) {
      mostrarErro("rec-whats", "rec-whats-erro", "Formato: (XX) XXXXX-XXXX");
      return false;
    }

    const pacoteOriginal = document.getElementById("rec-pacote")?.value || "";
    if (!pacoteOriginal) {
      mostrarErro("rec-pacote", "rec-pacote-erro", "Escolha um pacote/serviço");
      return false;
    }
    mostrarErro("rec-pacote", "rec-pacote-erro", "");

    if (pacoteOriginal.startsWith("Serviço Avulso")) {
      const desc = (
        document.getElementById("rec-servico-desc")?.value || ""
      ).trim();
      if (!desc) {
        alert("⚠️ Descreva qual é o serviço avulso!");
        return false;
      }
    }

    if (!document.getElementById("rec-forma")?.value) {
      mostrarErro(
        "rec-forma",
        "rec-forma-erro",
        "Escolha a forma de pagamento",
      );
      return false;
    }
    mostrarErro("rec-forma", "rec-forma-erro", "");

    return true;
  }

  // ------------------------------
  // GERAR TEXTO DO RECIBO
  // ------------------------------
  function gerarReciboTexto(dados) {
    const comprovante = dados.comprovanteRef
      ? `\nReferência do comprovante: ${dados.comprovanteRef}`
      : "";
    const observacoes = dados.obs ? `\nObservações: ${dados.obs}` : "";
    return `RECIBO DE PAGAMENTO Nº ${dados.numero}

VÉTUS GESTÃO DE ACESSO
Recebi de ${dados.nome}, CPF ${dados.cpf}, o valor de ${dados.valorFormatado}, referente a ${dados.pacote}.

Data do recebimento: ${dados.dataRecebimento}
Forma de pagamento: ${dados.pagamento}${comprovante}${observacoes}

Emitido em ${dados.dataHoje}
Wender Messias José da Silva
Vétus Gestão de Acesso — @vetusacessodigital`;
  }

  // ------------------------------
  // GERAR HTML PARA IMPRIMIR/PDF
  // ------------------------------
  function gerarReciboHTML(dados) {
    const numero = escaparHTML(dados.numero);
    const nome = escaparHTML(dados.nome);
    const cpf = escaparHTML(dados.cpf);
    const pacote = escaparHTML(dados.pacote);
    const valor = escaparHTML(dados.valorFormatado);
    const pagamento = escaparHTML(dados.pagamento);
    const dataRecebimento = escaparHTML(dados.dataRecebimento);
    const dataHoje = escaparHTML(dados.dataHoje);
    const comprovante = dados.comprovanteRef
      ? `<div class="campo"><span>Referência do comprovante</span><strong>${escaparHTML(dados.comprovanteRef)}</strong></div>`
      : "";
    const observacoes = dados.obs
      ? `<section class="observacoes"><span>Observações</span><p>${escaparHTML(dados.obs)}</p></section>`
      : "";
    return `
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Recibo de Pagamento</title>
<style>
@page { size: A4; margin: 18mm; }
* { box-sizing: border-box; }
body { margin: 0; background: #f2f4f8; color: #1f2937; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.55; }
.recibo { max-width: 780px; min-height: 900px; margin: 28px auto; padding: 46px 52px; background: #fff; border: 1px solid #e3e7ed; box-shadow: 0 10px 34px rgba(10, 35, 87, .12); }
.cabecalho { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding-bottom: 22px; }
.marca { display: flex; align-items: center; gap: 14px; color: #0A2357; }
.marca svg { width: 54px; height: 62px; flex: 0 0 auto; }
.marca-nome { font-family: Georgia, 'Times New Roman', serif; font-size: 25px; font-weight: 700; letter-spacing: 2px; }
.marca-nome span { display: block; margin-top: 3px; font-family: Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.6px; }
.identificacao { text-align: right; }
.identificacao h1 { margin: 0 0 6px; color: #0A2357; font-size: 17px; letter-spacing: 1.2px; }
.identificacao p { margin: 0; color: #6b7280; font-size: 12px; }
.identificacao strong { color: #0A2357; }
.linha-dourada { height: 3px; background: #D4AF37; margin-bottom: 30px; }
.declaracao { margin: 0 0 26px; font-size: 15px; line-height: 1.8; }
.declaracao strong { color: #0A2357; }
.valor { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin: 24px 0; padding: 18px 20px; border: 1px solid #e6dfc5; border-left: 4px solid #D4AF37; background: #fbfaf6; }
.valor span, .campo span, .observacoes span { display: block; color: #687080; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.valor strong { color: #0A2357; font-size: 25px; }
.grade { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; border-top: 1px solid #e5e7eb; }
.campo { min-width: 0; padding: 17px 0; border-bottom: 1px solid #e5e7eb; overflow-wrap: anywhere; }
.campo strong { display: block; margin-top: 5px; color: #202938; font-size: 14px; font-weight: 600; white-space: pre-wrap; }
.observacoes { margin-top: 22px; padding: 14px 16px; background: #f7f8fa; border-radius: 4px; }
.observacoes p { margin: 5px 0 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.rodape { margin-top: 42px; display: flex; justify-content: space-between; align-items: end; gap: 25px; }
.assinatura { width: 270px; padding-top: 10px; border-top: 1px solid #647084; text-align: center; font-size: 12px; }
.assinatura strong { display: block; color: #0A2357; }
.contato { color: #687080; font-size: 11px; text-align: right; }
.contato strong { display: block; margin-bottom: 4px; color: #0A2357; font-size: 12px; }
.nota { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #7b8290; font-size: 10px; text-align: center; }
@media print {
  body { background: #fff; }
  .recibo { width: 100%; max-width: none; min-height: 0; margin: 0; padding: 0; border: 0; box-shadow: none; }
  .valor { background: #fff; }
  .observacoes { background: #fff; border: 1px solid #e5e7eb; }
}
@media screen and (max-width: 640px) {
  .recibo { min-height: 0; margin: 10px; padding: 28px 22px; }
  .cabecalho, .rodape { align-items: flex-start; flex-direction: column; }
  .identificacao, .contato { text-align: left; }
  .grade { grid-template-columns: 1fr; }
}
</style>
</head>
<body>
<main class="recibo">
  <header class="cabecalho">
    <div class="marca">
      <svg viewBox="0 0 60 70" role="img" aria-label="Símbolo Vétus">
        <path d="M30 3 55 14v20c0 15-10 25-25 33C15 59 5 49 5 34V14L30 3Z" fill="#0A2357" stroke="#D4AF37" stroke-width="2.5"/>
        <path d="m17 21 13 27 14-27" fill="none" stroke="#D4AF37" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter"/>
      </svg>
      <div class="marca-nome">VÉTUS<span>GESTÃO DE ACESSO</span></div>
    </div>
    <div class="identificacao">
      <h1>RECIBO DE PAGAMENTO</h1>
      <p>Nº <strong>${numero}</strong></p>
    </div>
  </header>
  <div class="linha-dourada"></div>
  <p class="declaracao">Recebi de <strong>${nome}</strong>, inscrito(a) no CPF <strong>${cpf}</strong>, o valor de <strong>${valor}</strong>, referente a <strong>${pacote}</strong>.</p>
  <div class="valor"><span>Valor recebido</span><strong>${valor}</strong></div>
  <section class="grade">
    <div class="campo"><span>Cliente</span><strong>${nome}</strong></div>
    <div class="campo"><span>CPF</span><strong>${cpf}</strong></div>
    <div class="campo"><span>Serviço / pacote</span><strong>${pacote}</strong></div>
    <div class="campo"><span>Forma de pagamento</span><strong>${pagamento}</strong></div>
    <div class="campo"><span>Data do recebimento</span><strong>${dataRecebimento}</strong></div>
    ${comprovante}
  </section>
  ${observacoes}
  <footer class="rodape">
    <div class="assinatura"><strong>Wender Messias José da Silva</strong>Vétus Gestão de Acesso</div>
    <div class="contato"><strong>VÉTUS GESTÃO DE ACESSO</strong>@vetusacessodigital<br>Emitido em ${dataHoje}</div>
  </footer>
  <div class="nota">Recibo emitido após confirmação do recebimento do pagamento.</div>
</main>
</body>
</html>`;
  }

  function criarPDF(conteudo) {
    const janela = window.open(
      "",
      "_blank",
      "width=800,height=1000,scrollbars=yes",
    );
    if (!janela) {
      alert("⚠️ Permita pop-ups para este site!");
      return;
    }
    janela.document.open();
    janela.document.write(conteudo);
    janela.document.close();
    janela.focus();
    setTimeout(() => janela.print(), 350);
  }

  // ==================================================
  // BOTÕES
  // ==================================================

  // Gerar Recibo
  const btnGerar = document.getElementById("btn-gerar");
  if (btnGerar) {
    btnGerar.addEventListener("click", function () {
      console.log("🟢 Gerar clicado");
      const dados = coletarDados();
      if (!validarDados(dados)) return;
      atribuirNumeroRecibo(dados);
      criarPDF(gerarReciboHTML(dados));
    });
  } else {
    console.error("🔴 Botão btn-gerar não encontrado!");
  }

  // WhatsApp
  const btnWhats = document.getElementById("btn-whatsapp");
  if (btnWhats) {
    btnWhats.addEventListener("click", function () {
      console.log("🟢 WhatsApp clicado");
      const dados = coletarDados();
      if (!validarDados(dados)) return;
      if (!dados.whats) {
        alert("⚠️ Preencha o WhatsApp do cliente!");
        return;
      }
      atribuirNumeroRecibo(dados);
      const mensagem = `Olá ${dados.nome}! Tudo bem?

Aqui está o seu recibo referente ao serviço contratado:

${gerarReciboTexto(dados)}

Agradecemos pela confiança!
Qualquer dúvida, estamos à disposição.`;
      const numeroLimpo = dados.whats.replace(/\D/g, "");
      window.open(
        "https://wa.me/55" +
          numeroLimpo +
          "?text=" +
          encodeURIComponent(mensagem),
        "_blank",
      );
    });
  } else {
    console.error("🔴 Botão btn-whatsapp não encontrado!");
  }

  // E-mail
  const btnEmail = document.getElementById("btn-email");
  if (btnEmail) {
    btnEmail.addEventListener("click", function () {
      console.log("🟢 E-mail clicado");
      const dados = coletarDados();
      if (!validarDados(dados)) return;
      if (!dados.email) {
        mostrarErro("rec-email", "rec-email-erro", "Informe o e-mail para enviar");
        return;
      }
      atribuirNumeroRecibo(dados);
      const assunto =
        "Recibo de Pagamento — " + dados.pacote + " — Vétus Gestão de Acesso";
      const corpo =
        "Olá " +
        dados.nome +
        "!\n\n" +
        "Segue abaixo o seu recibo referente ao serviço contratado:\n\n" +
        gerarReciboTexto(dados) +
        "\n\n" +
        "Agradecemos muito pela confiança! \n" +
        "Ficamos à disposição para quaisquer dúvidas.\n\n" +
        "Atenciosamente,\n" +
        "Wender Messias José da Silva\n" +
        "Vétus Gestão de Acesso\n" +
        "@vetusacessodigital";
      const linkEmail =
        "mailto:" +
        dados.email +
        "?subject=" +
        encodeURIComponent(assunto) +
        "&body=" +
        encodeURIComponent(corpo);

      const avisoOk = document.getElementById("aviso-email");
      const janela = window.open(linkEmail, "_blank");
      if (avisoOk) {
        avisoOk.textContent = janela
          ? "✅ Rascunho preparado. Confira os dados e clique em Enviar no seu e-mail."
          : "⚠️ Não foi possível abrir o e-mail. Verifique se o navegador bloqueou a janela.";
        avisoOk.style.color = janela ? "green" : "#b45309";
        avisoOk.style.display = "block";
        setTimeout(() => (avisoOk.style.display = "none"), 5000);
      }
    });
  } else {
    console.error("🔴 Botão btn-email não encontrado!");
  }

  // Inicializa ao carregar
  const inputData = document.getElementById("rec-data");
  if (inputData && !inputData.value) inputData.value = dataISOHoje();
  verificarPacote();
});
