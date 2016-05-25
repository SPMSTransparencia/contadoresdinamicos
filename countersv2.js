/**Variaveis*/
var urlGeneric = 'https://transparencia.sns.gov.pt/api/records/1.0/search/?apikey=12ff0012d23b6a9210528d5fbbdab95f5680ec5ecf894f05c40e42b1&dataset=contadores-dinamicos';
var urlRecords = 'https://project-1077097263233676948.firebaseio.com/indicadores/records.json?auth=nNK0N1EfATzvaLAaWnWC3P2k2kn3GpIM5uXdP1eF';
var urlDate = 'https://project-1077097263233676948.firebaseio.com/indicadores/parameters/dateRefresh.json?auth=nNK0N1EfATzvaLAaWnWC3P2k2kn3GpIM5uXdP1eF';
var indicadoresTipoUm=[];
var indicadoresTipoDois=[];
var indicadoresTipoTres=[];
var indicadoresTipoQuatro=[];
var segundosPorDia = 86400;
var idValue = '#cnt';
var idUrl = '#url';
var idLabel = '#lbl';
var keyIndicadores = 'indicadores';
var milisegundosPorDia  = 86400000;
var database;
var config = {
	apiKey: "AIzaSyBAseiwal8ikbDrofBMh-I-BpYp57jOZ88",
	authDomain: "project-1077097263233676948.firebaseapp.com",
	databaseURL: "https://project-1077097263233676948.firebaseio.com",
	storageBucket: "",
  };

/**Executa o pedidos ajax a um url*/
function callByAjax(callUrl) {
	return $.ajax({ 
	   type: "GET",
	   dataType: "jsonp",
	   url: callUrl
	});
}
 
/** Carrega os indicadores */
function callIndicadores() {
	var fbOn = false;
	var call = callByAjax(urlRecords);		   
	call.success(function (data) {
		/**valida se ha dados no fb**/
		if(data != null && data.length > 0){
			fbOn = true
		}
		/**Se tiver dados arranca os indicadores*/
		if(fbOn){
			buildIndicadores(data);
		}
	});
	/**Chama a API se nao tiver resultados da Firebase*/
	if(!fbOn){
		var call = callByAjax(urlGeneric);
		call.success(function (data) {
			buildIndicadores(data.records);
		});
	}				
}

/**Arranca os contadores*/
function buildIndicadores(records){
	var dataSetSize = records.length;
	/**Separa os indicadores por tipo*/
	for (var i = 0; i < dataSetSize; i++) {
		var indicador = records[i];
		var tipoIndicador = indicador.fields.tipo;
		if(tipoIndicador === 1){
			indicadoresTipoUm.push(indicador);
		} else if(tipoIndicador === 2){
			indicadoresTipoDois.push(indicador);
		} else if(tipoIndicador === 3){
			indicadoresTipoTres.push(indicador);
		} else if(tipoIndicador === 4){
			indicadoresTipoQuatro.push(indicador);
		}
	}
	/**Arranca os contadores por tipo*/	
	getContador(indicadoresTipoUm);
	getContador(indicadoresTipoDois);
	getContador(indicadoresTipoTres);
	getContador(indicadoresTipoQuatro);
}


/**
 * Retorna um numero entre 0 (inclusive) e max (inclusive)
 */
function getRandom(max) {
    return Math.floor(Math.random() * (max + 1));
}
/**
*Verifica se a variavel e numerica
*/
function isNumber( input ) {
    return (input != '' && !isNaN( input )) || input === 0;
}
/**
* valida se a data esta no formato aaaa-mm-dd
*/
function isDateValid(date) {
	var re = /20[0-3][0-9]-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])/;
    return re.test(date);
}
/**
*Formata os valores
*/
function formataNumero(numero,casasDecimais,unidadeMedida) {
	var floatValue = parseFloat(Math.round((numero) * 100) / 100).toFixed(casasDecimais).replace('.',',');
	 return floatValue.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")+' '+unidadeMedida;
}
/**
*calcula o total de segundos entre duas datas
*/
function getSegundos(startDate,finalDate){
	return (finalDate.getTime() - startDate.getTime())/1000;		
}
/**
*Devolve a data do inicio do ano corrente
*/
function getDataInicioAno(){
	var dateNow = new Date();
	var yearNow = dateNow.getFullYear();
	return new Date(yearNow+'-01-01');
}
/**
*Devolve a data do inicio do dia
*/
function getDataInicioAno(){
	var inicioDia = new Date();
	inicioDia.setHours(0);
	inicioDia.setMinutes(0);
	inicioDia.setSeconds(0);
	inicioDia.setMilliseconds(0);
	return inicioDia;
}
/**
*Devolve o valor diario a incrementar com base no valor final do ano
*/
function getIncrementoDiario(valorBase){
	var now = new Date();
	var start = new Date(now.getFullYear(), 0, 0);
	var final = new Date(now.getFullYear()+1, 0, 0);
	var diff =  final - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);
	return Math.round((Math.abs(valorBase/day))* 100)/100;
}
/**
*Pesquisa os indicadores para um tipo e escolhe um para apresentar na pagina
*/
function getContador(indicadores) {
	var dataSetSize = indicadores.length;
	var indexIndicador = getRandom(dataSetSize - 1);
	if(isNumber(indexIndicador)){
		var indicador = indicadores[indexIndicador].fields;
		var valorBase = indicador.valor_base;
		var incrementoDiario = indicador.incremento_diario;
		var dataValorBase = indicador.data_valor_base;
		var nomeIndicador = indicador.nome_indicador;
		var unidadeMedida = indicador.unidade_medida;
		var tempoAtualizacao = indicador.tempo_atualizacao;
		var casasDecimais = indicador.casas_decimais;
		var indUrl = indicador.url;
		var idContador = '0'+indicador.tipo;
		startCounter(valorBase,incrementoDiario,dataValorBase,nomeIndicador,indUrl,unidadeMedida,casasDecimais,tempoAtualizacao,idContador);
	}
}
/**
* funcao contador
*/
function contadorCompleto(valorBase,incrementoDiario,dataValorBase,nomeIndicador,indUrl,unidadeMedida,casasDecimais,idContador){
	var valorPorSegundo = incrementoDiario / segundosPorDia;
	var dataInicio = new Date(dataValorBase);
	dataInicio.setHours(0);
	dataInicio.setMinutes(0);
	dataInicio.setSeconds(0);	
	dataInicio.setMilliseconds(0);
	var totalSegundosAgora = getSegundos(dataInicio,new Date());
	var valorAgora = valorBase + (valorPorSegundo * totalSegundosAgora);
	if (typeof unidadeMedida == 'undefined'){
		unidadeMedida = '';
	}
	$(idValue + idContador).text(formataNumero(valorAgora,casasDecimais,unidadeMedida));
	$(idLabel + idContador).html(nomeIndicador);
	$(idUrl + idContador).attr("href", indUrl);
}
/**
*Funcao para iniciar o contador
*/
function startCounter(valorBase,incrementoDiario,dataValorBase,nomeIndicador,indUrl,unidadeMedida,casasDecimais,tempoAtualizacao,idContador){
	//Se o valorBase > 0 ou > '0'
	if(isNumber(valorBase) && valorBase > 0){
		//Verifica se tem incrementoDiario
		if(isNumber(incrementoDiario) && incrementoDiario > 0){
			//Verifica se tem incrementoDiario
			if(isDateValid(dataValorBase)){
				//Faz o calculo com o valorBase o incrementoDiario e a dataValorBase
				//Executa a funcao
				contadorCompleto(valorBase,incrementoDiario,dataValorBase,nomeIndicador,indUrl,unidadeMedida,casasDecimais,idContador);
				//Configura o tempo de atualizacao da funcao
				setInterval(function () {
					contadorCompleto(valorBase,incrementoDiario,dataValorBase,nomeIndicador,indUrl,unidadeMedida,casasDecimais,idContador);
				}, 
				tempoAtualizacao);
			}else{
				//Faz o calculo com o valorBase e o incrementoDiario
				//Executa a funcao
				contadorCompleto(valorBase,incrementoDiario,getDataInicioAno(),nomeIndicador,indUrl,unidadeMedida,casasDecimais,idContador);
				//Configura o tempo de atualizacao da funcao
				setInterval(function () {
					contadorCompleto(valorBase,incrementoDiario,getDataInicioAno(),nomeIndicador,indUrl,unidadeMedida,casasDecimais,idContador);
				}, 
				tempoAtualizacao);
			}
		}else{
			//Faz o calculo com o valorBase
			//Executa a funcao
			contadorCompleto(0,getIncrementoDiario(valorBase),getDataInicioAno(),nomeIndicador,indUrl,unidadeMedida,casasDecimais,idContador);
			//Configura o tempo de atualizacao da funcao
			setInterval(function () {
				contadorCompleto(0,getIncrementoDiario(valorBase),getDataInicioAno(),nomeIndicador,indUrl,unidadeMedida,casasDecimais,idContador);
			}, 
			tempoAtualizacao);
		}
	
	}else{
		//Verifica se tem incrementoDiario
		if(isNumber(incrementoDiario) && incrementoDiario > 0){
			//Executa a funcao
			contadorCompleto(0,incrementoDiario,getDataInicioAno(),nomeIndicador,indUrl,unidadeMedida,casasDecimais,idContador);
			//Configura o tempo de atualizacao da funcao
			setInterval(function () {
				contadorCompleto(0,incrementoDiario,getDataInicioAno(),nomeIndicador,indUrl,unidadeMedida,casasDecimais,idContador);
			}, 
			tempoAtualizacao);
		}		
	}
}

/**Inicia os contadores dinamicos*/
function startIndicadores(){
	/**Inicializa o fb*/
	firebase.initializeApp(config);	
	database = firebase.database();
	/**arranca com os contadores*/
	callIndicadores();
}
function initCounters(){
	startIndicadores();
}
