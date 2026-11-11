const produtos = [
  { id: 1, codigo: "ora", nome: "Ora-pro-burguer", descricao: "Hambúrguer com crispy de ora-pro-nóbis, queijo e molho especial.", preco: 38.90, categoria: "Hambúrgueres", imagem: "ora-pro-burguer.jpg" },
  { id: 2, codigo: "jabuti", nome: "Jabutiburguer", descricao: "Hambúrguer artesanal com queijo e um toque de jabuticaba.", preco: 42.90, categoria: "Hambúrgueres", imagem: "  jabutiburguer.jpg" },
  { id: 3, codigo: "smash", nome: "Sabará Smash Duo", descricao: "Duas carnes smash de 87 g, Catupiry, geleia de cebola, mussarela e pão brioche na manteiga.", preco: 32.90, categoria: "Hambúrgueres", imagem: "sabara-smash-duo.jpg" },
  { id: 4, codigo: "bacon", nome: "Do Ó Bacon", descricao: "Burger bovino de 200 g, cheddar, banana-da-terra caramelizada, queijo coalho e pão brioche.", preco: 34.90, categoria: "Hambúrgueres", imagem: "do-o-bacon.jpg" },
  { id: 5, codigo: "classico", nome: "Do Ó Clássico", descricao: "Burger de picanha de 250 g, cheddar, molho da casa, alface, cebola, tomate e pão brioche.", preco: 29.90, categoria: "Hambúrgueres", imagem: "do-o-classico.jpg" },
  { id: 6, codigo: "batata", nome: "Batata com cheddar e bacon", descricao: "Batatas crocantes com cheddar cremoso e bacon.", preco: 22.90, categoria: "Porções", imagem: "batata-cheddar-bacon.jpg" },
  { id: 7, codigo: "bolinho", nome: "Bolinho de ora-pro-nóbis (6 unidades)", descricao: "Seis bolinhos de ora-pro-nóbis para dividir.", preco: 19.90, categoria: "Porções", imagem: "bolinho-ora-pro-nobis.webp" },
  { id: 8, codigo: "geleia", nome: "Geleia de jabuticaba", descricao: "Geleia de jabuticaba com sabor caseiro.", preco: 4.80, categoria: "Extras", imagem: "geleia-jabuticaba.webp" },
  { id: 9, codigo: "sprite", nome: "Sprite", descricao: "Refrigerante sabor limão, lata.", preco: 6.00, categoria: "Bebidas", imagem: "sprite.png" },
  { id: 10, codigo: "jabusuco", nome: "Suco de jabuticaba", descricao: "Suco natural de jabuticaba.", preco: 8.00, categoria: "Bebidas", imagem: "suco-jabuticaba.webp" },
  { id: 11, codigo: "morango", nome: "Suco de morango", descricao: "Suco de morango refrescante.", preco: 9.00, categoria: "Bebidas", imagem: "suco-morango.webp" }
];

const carrinho = {};
let categoriaAtual = "Todos";
let usuarioAtual = JSON.parse(localStorage.getItem("doOUsuario") || "null");
let pedidosLocais = JSON.parse(localStorage.getItem("doOPedidos") || "[]");
const dinheiro = valor => Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function avisar(texto) { document.getElementById("mensagem-api").textContent = texto || ""; }

function mostrarProdutos() {
  const busca = document.getElementById("busca").value.trim().toLocaleLowerCase("pt-BR");
  const lista = document.getElementById("produtos");
  lista.innerHTML = "";
  const filtrados = produtos.filter(produto => {
    const categoriaCerta = categoriaAtual === "Todos" || produto.categoria === categoriaAtual;
    const texto = (produto.nome + " " + produto.descricao + " " + produto.categoria).toLocaleLowerCase("pt-BR");
    return categoriaCerta && texto.includes(busca);
  });
  if (!filtrados.length) { lista.innerHTML = "<p>Nenhum produto encontrado. Tente outra busca.</p>"; return; }
  filtrados.forEach(produto => {
    const card = document.createElement("article");
    card.className = "produto";
    const imagem = document.createElement("img"); imagem.src = produto.imagem; imagem.alt = produto.nome; imagem.loading = "lazy";
    imagem.onerror = function() { this.style.display = "none"; };
    const info = document.createElement("div"); info.className = "produto-info";
    const titulo = document.createElement("h3"); titulo.textContent = produto.nome;
    const descricao = document.createElement("p"); descricao.textContent = produto.descricao;
    const linha = document.createElement("div"); linha.className = "preco-linha";
    const preco = document.createElement("span"); preco.className = "preco"; preco.textContent = dinheiro(produto.preco);
    const botao = document.createElement("button"); botao.className = "adicionar"; botao.type = "button"; botao.textContent = "Adicionar";
    botao.addEventListener("click", () => { carrinho[produto.codigo] = (carrinho[produto.codigo] || 0) + 1; mostrarCarrinho(); avisar(produto.nome + " adicionado ao carrinho."); });
    linha.append(preco, botao); info.append(titulo, descricao, linha); card.append(imagem, info); lista.appendChild(card);
  });
}

function mudarQuantidade(codigo, mudanca) {
  carrinho[codigo] = (carrinho[codigo] || 0) + mudanca;
  if (carrinho[codigo] <= 0) delete carrinho[codigo];
  mostrarCarrinho();
}

function mostrarCarrinho() {
  const area = document.getElementById("carrinho"); area.innerHTML = "";
  let total = 0; let quantidadeTotal = 0;
  Object.keys(carrinho).forEach(codigo => {
    const produto = produtos.find(item => item.codigo === codigo); if (!produto) return;
    const quantidade = carrinho[codigo]; total += produto.preco * quantidade; quantidadeTotal += quantidade;
    const linha = document.createElement("div"); linha.className = "item-carrinho";
    const texto = document.createElement("div");
    const nome = document.createElement("strong"); nome.textContent = produto.nome;
    const valor = document.createElement("div"); valor.textContent = dinheiro(produto.preco * quantidade);
    texto.append(nome, valor);
    const controles = document.createElement("div"); controles.className = "quantidade";
    const menos = document.createElement("button"); menos.type = "button"; menos.textContent = "−"; menos.setAttribute("aria-label", "Diminuir " + produto.nome); menos.addEventListener("click", () => mudarQuantidade(codigo, -1));
    const numero = document.createElement("span"); numero.textContent = quantidade;
    const mais = document.createElement("button"); mais.type = "button"; mais.textContent = "+"; mais.setAttribute("aria-label", "Aumentar " + produto.nome); mais.addEventListener("click", () => mudarQuantidade(codigo, 1));
    controles.append(menos, numero, mais); linha.append(texto, controles); area.appendChild(linha);
  });
  if (!quantidadeTotal) area.innerHTML = "<p>Você ainda não adicionou produtos.</p>";
  document.getElementById("total").textContent = dinheiro(total);
  document.getElementById("contador-carrinho").textContent = quantidadeTotal;
}

document.querySelectorAll(".filtro").forEach(botao => botao.addEventListener("click", function() {
  document.querySelectorAll(".filtro").forEach(item => item.classList.remove("ativo"));
  this.classList.add("ativo"); categoriaAtual = this.dataset.categoria; mostrarProdutos();
}));
document.getElementById("busca").addEventListener("input", mostrarProdutos);

// O Desafio do Ó combina as preferências do cliente para sugerir um combo.
document.getElementById("form-desafio").addEventListener("submit", event => {
  event.preventDefault();
  const preferencia = document.getElementById("preferencia").value;
  const fome = document.getElementById("fome").value;
  const bebida = document.getElementById("bebida-desafio").value;
  let principal = "ora";
  let acompanhamento = "bolinho";
  let nomeCombo = "Rota dos Sabores Mineiros";
  let explicacao = "Uma combinação com personalidade mineira e um toque regional.";

  if (preferencia === "classico") {
    principal = "classico";
    nomeCombo = "Clássico do Largo";
    explicacao = "Um hambúrguer tradicional e suculento, inspirado naquele sabor que nunca falha.";
  } else if (preferencia === "agridoce") {
    principal = "jabuti";
    nomeCombo = "Surpresa de Jabuticaba";
    explicacao = "A jabuticaba traz um toque marcante para quem gosta de experimentar sabores diferentes.";
  }

  if (fome === "grande") acompanhamento = "batata";
  if (fome === "leve") acompanhamento = "geleia";
  const selecionados = [principal, acompanhamento, bebida];
  const itens = selecionados.map(codigo => produtos.find(produto => produto.codigo === codigo));
  const total = itens.reduce((soma, produto) => soma + produto.preco, 0);
  const area = document.getElementById("resultado-desafio");
  area.innerHTML = "";
  const selo = document.createElement("div"); selo.className = "selo-desafio"; selo.textContent = "❦";
  const titulo = document.createElement("h3"); titulo.textContent = nomeCombo;
  const texto = document.createElement("p"); texto.textContent = explicacao;
  const lista = document.createElement("ul"); lista.className = "itens-desafio";
  itens.forEach(produto => { const item = document.createElement("li"); item.textContent = produto.nome + " — " + dinheiro(produto.preco); lista.appendChild(item); });
  const preco = document.createElement("p"); preco.className = "preco-desafio"; preco.textContent = "Combo sugerido: " + dinheiro(total);
  const botao = document.createElement("button"); botao.type = "button"; botao.className = "botao desafio-botao"; botao.textContent = "Adicionar combo ao carrinho";
  botao.addEventListener("click", () => {
    selecionados.forEach(codigo => { carrinho[codigo] = (carrinho[codigo] || 0) + 1; });
    mostrarCarrinho();
    avisar("Seu combo “" + nomeCombo + "” foi adicionado ao carrinho!");
    document.getElementById("carrinho-pagina").scrollIntoView({ behavior: "smooth" });
  });
  area.append(selo, titulo, texto, lista, preco, botao);
});

function mascaraTelefone(campo) {
  const numeros = campo.value.replace(/\D/g, "").slice(0, 11);
  if (numeros.length > 10) campo.value = numeros.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  else if (numeros.length > 6) campo.value = numeros.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  else if (numeros.length > 2) campo.value = numeros.replace(/^(\d{2})(\d*)/, "($1) $2");
  else campo.value = numeros;
}
["telefone", "cad-telefone"].forEach(id => document.getElementById(id).addEventListener("input", event => mascaraTelefone(event.target)));
document.getElementById("numero").addEventListener("input", function() { this.value = this.value.replace(/[^0-9A-Za-z/-]/g, "").slice(0, 10); });

function abrirModal(tipo) {
  document.getElementById("modal-conta").classList.add("aberto"); document.getElementById("modal-conta").setAttribute("aria-hidden", "false");
  trocarAba(tipo); document.getElementById(tipo === "login" ? "login-email" : "cad-nome").focus();
}
function fecharModal() { document.getElementById("modal-conta").classList.remove("aberto"); document.getElementById("modal-conta").setAttribute("aria-hidden", "true"); }
function trocarAba(tipo) {
  const login = tipo === "login";
  document.getElementById("form-login").hidden = !login; document.getElementById("form-cadastro").hidden = login;
  document.getElementById("aba-login").classList.toggle("ativa", login); document.getElementById("aba-cadastro").classList.toggle("ativa", !login);
  document.getElementById("titulo-modal").textContent = login ? "Entrar na conta" : "Criar cadastro"; document.getElementById("mensagem-conta").textContent = "";
}
document.getElementById("abrir-login").addEventListener("click", () => abrirModal("login"));
document.getElementById("abrir-cadastro").addEventListener("click", () => abrirModal("cadastro"));
document.getElementById("perfil-login").addEventListener("click", () => abrirModal("login"));
document.getElementById("fechar-modal").addEventListener("click", fecharModal);
document.getElementById("aba-login").addEventListener("click", () => trocarAba("login"));
document.getElementById("aba-cadastro").addEventListener("click", () => trocarAba("cadastro"));
document.getElementById("modal-conta").addEventListener("click", e => { if (e.target.id === "modal-conta") fecharModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") fecharModal(); });

function salvarUsuario(usuario) { usuarioAtual = usuario; localStorage.setItem("doOUsuario", JSON.stringify(usuario)); mostrarPerfil(); mostrarPedidos(); }
document.getElementById("form-cadastro").addEventListener("submit", event => {
  event.preventDefault(); const telefone = document.getElementById("cad-telefone").value.replace(/\D/g, "");
  if (telefone.length !== 10 && telefone.length !== 11) { document.getElementById("mensagem-conta").textContent = "Informe um telefone com DDD e 10 ou 11 números."; return; }
  const dados = { nome: document.getElementById("cad-nome").value.trim(), email: document.getElementById("cad-email").value.trim().toLowerCase(), telefone, senha: document.getElementById("cad-senha").value };
  const usuarios = JSON.parse(localStorage.getItem("doOUsuarios") || "[]");
  if (usuarios.some(usuario => usuario.email === dados.email)) { document.getElementById("mensagem-conta").textContent = "Já existe um cadastro com este e-mail."; return; }
  usuarios.push(dados);
  localStorage.setItem("doOUsuarios", JSON.stringify(usuarios));
  salvarUsuario({ nome: dados.nome, email: dados.email, telefone: dados.telefone });
  document.getElementById("mensagem-conta").textContent = "Cadastro realizado com sucesso neste navegador!";
  setTimeout(fecharModal, 700);
});
document.getElementById("form-login").addEventListener("submit", event => {
  event.preventDefault(); const dados = { email: document.getElementById("login-email").value.trim().toLowerCase(), senha: document.getElementById("login-senha").value };
  const usuarios = JSON.parse(localStorage.getItem("doOUsuarios") || "[]");
  const usuario = usuarios.find(item => item.email === dados.email && item.senha === dados.senha);
  if (!usuario) { document.getElementById("mensagem-conta").textContent = "E-mail ou senha incorretos. Confira os dados ou faça seu cadastro."; return; }
  salvarUsuario({ nome: usuario.nome, email: usuario.email, telefone: usuario.telefone });
  document.getElementById("mensagem-conta").textContent = "Login realizado com sucesso!";
  setTimeout(fecharModal, 700);
});

function mostrarPerfil() {
  const area = document.getElementById("dados-perfil"); area.innerHTML = "";
  if (!usuarioAtual) { area.innerHTML = '<p>Você ainda não entrou em uma conta.</p><button class="botao" id="perfil-login-novo" type="button">Entrar ou cadastrar</button>'; document.getElementById("perfil-login-novo").addEventListener("click", () => abrirModal("login")); return; }
  const nome = document.createElement("p"); nome.textContent = "Nome: " + usuarioAtual.nome;
  const email = document.createElement("p"); email.textContent = "E-mail: " + usuarioAtual.email;
  const telefone = document.createElement("p"); telefone.textContent = "Telefone: " + (usuarioAtual.telefone || "Não informado");
  const sair = document.createElement("button"); sair.className = "botao"; sair.type = "button"; sair.textContent = "Sair da conta"; sair.addEventListener("click", () => { usuarioAtual = null; localStorage.removeItem("doOUsuario"); mostrarPerfil(); mostrarPedidos(); });
  area.append(nome, email, telefone, sair);
}

function mostrarPedidos() {
  const area = document.getElementById("lista-pedidos"); area.innerHTML = "";
  if (!usuarioAtual) { area.innerHTML = '<p>Entre na sua conta para consultar seus pedidos.</p><button class="botao" id="pedidos-login" type="button">Fazer login</button>'; document.getElementById("pedidos-login").addEventListener("click", () => abrirModal("login")); return; }
  const lista = pedidosLocais.filter(pedido => pedido.email === usuarioAtual.email);
  if (!lista.length) { area.innerHTML = "<p>Você ainda não tem pedidos salvos neste navegador.</p>"; return; }
  lista.slice().reverse().forEach(pedido => { const bloco = document.createElement("article"); bloco.className = "pedido-salvo"; const titulo = document.createElement("h3"); titulo.textContent = "Pedido #" + pedido.id; const data = document.createElement("p"); data.textContent = "Data: " + pedido.data; const itens = document.createElement("p"); itens.textContent = pedido.itens; const total = document.createElement("strong"); total.textContent = "Total: " + dinheiro(pedido.total); bloco.append(titulo, data, itens, total); area.appendChild(bloco); });
}

const temaSalvo = localStorage.getItem("doOTema");
if (temaSalvo === "escuro") document.body.classList.add("modo-escuro");
function atualizarBotaoTema() { document.getElementById("alternar-tema").textContent = document.body.classList.contains("modo-escuro") ? "☀️" : "🌙"; }
document.getElementById("alternar-tema").addEventListener("click", () => { document.body.classList.toggle("modo-escuro"); localStorage.setItem("doOTema", document.body.classList.contains("modo-escuro") ? "escuro" : "claro"); atualizarBotaoTema(); });

const menuMobile = document.getElementById("menu-mobile");
menuMobile.addEventListener("click", () => document.getElementById("navegacao").classList.toggle("menu-aberto"));
document.querySelectorAll("nav a").forEach(link => link.addEventListener("click", () => document.getElementById("navegacao").classList.remove("menu-aberto")));

document.getElementById("form-pedido").addEventListener("submit", event => {
  event.preventDefault(); const codigos = Object.keys(carrinho);
  if (!codigos.length) { alert("Adicione pelo menos um produto ao carrinho."); return; }
  const telefoneFormatado = document.getElementById("telefone").value; const telefone = telefoneFormatado.replace(/\D/g, "");
  if (telefone.length !== 10 && telefone.length !== 11) { alert("Digite um telefone válido com DDD."); document.getElementById("telefone").focus(); return; }
  const dados = { nome: document.getElementById("nome-entrega").value.trim(), telefone, rua: document.getElementById("rua").value.trim(), numero: document.getElementById("numero").value.trim(), bairro: document.getElementById("bairro").value.trim(), cidade: document.getElementById("cidade").value.trim(), observacao: document.getElementById("observacao").value.trim() };
  const linhas = []; let total = 0;
  codigos.forEach(codigo => { const produto = produtos.find(item => item.codigo === codigo); const qtd = carrinho[codigo]; total += produto.preco * qtd; linhas.push(qtd + "x " + produto.nome + " - " + dinheiro(produto.preco * qtd)); });
  const itensTexto = linhas.join("; "); const data = new Date().toLocaleString("pt-BR"); const email = usuarioAtual ? usuarioAtual.email : "visitante";
  const mensagem = "Olá! Quero fazer um pedido na Do Ó Lanches.\n\nNome: " + dados.nome + "\nTelefone: " + telefoneFormatado + "\nEndereço: " + dados.rua + ", " + dados.numero + " - " + dados.bairro + ", " + dados.cidade + (dados.observacao ? "\nObservações: " + dados.observacao : "") + "\n\nPedido:\n" + linhas.join("\n") + "\n\nTotal: " + dinheiro(total);
  const pedido = { id: Date.now().toString().slice(-7), data, email, itens: itensTexto, total, ...dados };
  pedidosLocais.push(pedido); localStorage.setItem("doOPedidos", JSON.stringify(pedidosLocais));
  avisar("Pedido salvo neste navegador. Confirme o envio da mensagem no WhatsApp.");
  mostrarPedidos();
  const link = "https://wa.me/5531985977513?text=" + encodeURIComponent(mensagem); window.open(link, "_blank");
  Object.keys(carrinho).forEach(codigo => delete carrinho[codigo]); mostrarCarrinho();
});

mostrarProdutos(); mostrarCarrinho(); mostrarPerfil(); mostrarPedidos(); atualizarBotaoTema();
