// ENDEREÇO EHTEREUM DO CONTRATO
var contractAddress = "0xB0a38B11663729Bf768Ed215A86962286a1eDaE9";

// Inicializa o objeto DApp
document.addEventListener("DOMContentLoaded", onDocumentLoad);
function onDocumentLoad() {
  DApp.init();
}

// Nosso objeto DApp que irá armazenar a instância web3
const DApp = {
  web3: null,
  contracts: {},
  account: null,

  init: function () {
    return DApp.initWeb3();
  },

  // Inicializa o provedor web3
  initWeb3: async function () {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ // Requisita primeiro acesso ao Metamask
          method: "eth_requestAccounts",
        });
        DApp.account = accounts[0];
        window.ethereum.on('accountsChanged', DApp.updateAccount); // Atualiza se o usuário trcar de conta no Metamaslk
      } catch (error) {
        console.error("Usuário negou acesso ao web3!");
        return;
      }
      DApp.web3 = new Web3(window.ethereum);
    } else {
      console.error("Instalar MetaMask!");
      return;
    }
    return DApp.initContract();
  },

  // Atualiza 'DApp.account' para a conta ativa no Metamask
  updateAccount: async function() {
    DApp.account = (await DApp.web3.eth.getAccounts())[0];
    atualizaInterface();
  },

  // Associa ao endereço do seu contrato
  initContract: async function () {
    DApp.contracts.Horses_race = new DApp.web3.eth.Contract(abi, contractAddress);
    return DApp.render();
  },

  // Inicializa a interface HTML com os dados obtidos
  render: async function () {
    inicializaInterface();
  },
  
};
// *** MÉTODOS (de consulta - view) DO CONTRATO ** //

  function verRateio() {
    return DApp.contracts.Horses_race.methods.apportionment().call();
  }
  
  function verPreco() {
    return DApp.contracts.Horses_race.methods.get_minimum_bet().call();
  }
  
  function verVencedor() {
    return DApp.contracts.Horses_race.methods.get_winning_horse().call();
  }
  
  function verPremio() {
    return DApp.contracts.Horses_race.methods.check_prize().call();
  }

  function verTotal() {
    return DApp.contracts.Horses_race.methods.get_amount().call();
  }
  
  // *** MÉTODOS (de escrita) DO CONTRATO ** //
  function apostar() {
    let valor = document.getElementById("valor").value;
    let cavalo =  document.getElementById("cavalo").value;
    return DApp.contracts.Horses_race.methods.make_bet(cavalo).send({ from: DApp.account, value: valor }).then(atualizaInterface);;
  }
  
  function correr() {
    return DApp.contracts.Horses_race.methods.run_horses().send({ from: DApp.account }).then(atualizaInterface);;
  }

  // *** ATUALIZAÇÃO DO HTML *** //

function inicializaInterface() {
    document.getElementById("btnCorrer").onclick = correr;
    document.getElementById("btnApostar").onclick = apostar;
    atualizaInterface(); 
}

function atualizaInterface() {
  verPreco().then((result) => {
    document.getElementById("preco").innerHTML =
      "Aposta minima: " + result / 1000000000000000000 + " ETH";
  });

  verVencedor().then((result) => {
    document.getElementById("ganhador").innerHTML = result;
  });

  verRateio().then((result) => {
    document.getElementById("rateio").innerHTML =
      result / 1000000000000000000 + " ETH";
  });

  verPremio().then((result) => {
    document.getElementById("premio").innerHTML =
      result / 1000000000000000000 + " ETH";
  });

  verTotal().then((result) => {
    document.getElementById("total").innerHTML =
      result / 1000000000000000000 + " ETH";
  });
}

