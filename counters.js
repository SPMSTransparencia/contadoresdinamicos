var urlGeneric = 'https://transparencia.sns.gov.pt/api/records/1.0/search/?apikey=12ff0012d23b6a9210528d5fbbdab95f5680ec5ecf894f05c40e42b1';
var contador = '&dataset=contadores-dinamicos';
var indicadoresTipoUm=[];
var indicadoresTipoDois=[];
var indicadoresTipoTres=[];
var indicadoresTipoQuatro=[];
var segundosPorDia = 86400;
var idValue = '#cnt';
var idUrl = '#url';
var idLabel = '#lbl';
var idContadorSNS = '01';

/***Metodos genericos***/
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
/**Transparência**/
/**
 * Carrega os indicadores por tipo para o portal transparencia
 */
function loadIndicadoresTransparencia() {
	$.ajax({ 
	   type: "GET",
	   dataType: "jsonp",
	   url: urlGeneric + contador,
	   success: function(data){
			var dataSetSize = data.records.length;
			/**Separa os indicadores por tipo*/
			for (var i = 0; i < dataSetSize; i++) {
				var indicador = data.records[i];
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
			getContadorTransparencia(indicadoresTipoUm);
			getContadorTransparencia(indicadoresTipoDois);
			getContadorTransparencia(indicadoresTipoTres);
			getContadorTransparencia(indicadoresTipoQuatro);	
			}
	});
}
/**
*Pesquisa os indicadores para um tipo e escolhe um para apresentar na pagina transparência
*/
function getContadorTransparencia(indicadores) {
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
/**Inicia os contadores da Transparencia**/
function initCountersTransparencia(){
	loadIndicadoresTransparencia();
}
/**SNS**/
/**
 * Carrega os indicadores por tipo para o portal SNS
 */
function loadIndicadoresSNS() {
	$.ajax({ 
	   type: "GET",
	   dataType: "jsonp",
	   url: urlGeneric + contador,
	   success: function(data){
			/**Arranca os contadores por tipo*/	
			getContadorSNS(data.records);
		}
	});
}
/**
*Pesquisa os indicadores para um tipo e escolhe um para apresentar na pagina SNS
*/
function getContadorSNS(indicadores) {
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
		startCounter(valorBase,incrementoDiario,dataValorBase,nomeIndicador,indUrl,unidadeMedida,casasDecimais,tempoAtualizacao,idContadorSNS);
	}
}
/**Inicia oo contador do SNS**/
function initCountersSNS(){
	loadIndicadoresSNS();
}
