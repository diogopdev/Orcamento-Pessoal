class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){
		for(let i in this) {

			if (this[i] == undefined || this[i] == null || this[i] == ''){
				return false
			}
		}

		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id == null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoID() {
		let proximoID = localStorage.getItem('id')

		return parseInt(proximoID) + 1
	}

	gravar(d) {
		let id = this.getProximoID()

		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}

	recuperarTodosRegistos(){
		let despesas = Array()

		let id = localStorage.getItem('id')
		console.log(id)
		for(let i = 1; i <= id; i++) {

			let despesa = JSON.parse(localStorage.getItem(i))
			if(despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}
		
		return despesas
	}

	pesquisar(despesa) {

		let despesasFiltradas = Array()

		despesasFiltradas = this.recuperarTodosRegistos()

		if (despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(i => i.ano == despesa.ano)
		}
		if (despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(i => i.mes == despesa.mes)
		}
		if (despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(i => i.dia == despesa.dia)
		}
		if (despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(i => i.tipo == despesa.tipo)
		}
		if (despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(i => i.descricao == despesa.descricao)
		}
		if (despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(i => i.valor == despesa.valor)
		}

		console.log(despesasFiltradas)

		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function registarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value, 
		valor.value
	)
	

	if (despesa.validarDados()){
		//sucesso
		document.getElementById('mensagemModal').innerHTML = 'Despesa registada com sucesso!'
		document.getElementById('headerModal').innerHTML = 'Sucesso!'
		document.getElementById('headerModal').className = 'text-success'
		document.getElementById('buttonModal').className = 'btn btn-success'
		$('#modalGravacao').modal('show')
		bd.gravar(despesa)
		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
	} else {
		//erro
		document.getElementById('mensagemModal').innerHTML = 'Preencha todos os campos!'
		document.getElementById('headerModal').innerHTML = 'Erro'
		document.getElementById('headerModal').className = 'text-danger'
		document.getElementById('buttonModal').className = 'btn btn-danger'
		$('#modalGravacao').modal('show')
	}
}


function carregaListaDespesas(despesas = Array(), filtro = false) {

	if(despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistos()
	}
	
	let listasDespesas = document.getElementById('listaDespesas')
	listasDespesas.innerHTML = ''

	despesas.forEach(function(d) {
		let linha = listasDespesas.insertRow()
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		
		switch(d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
		}
		linha.insertCell(1).innerHTML = d.tipo

		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = `${d.valor}€`

		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = 'id_despesa_' + d.id
		btn.onclick = function() {
			
			let id = this.id.replace('id_despesa_', '')
			
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)

	})

}



function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value 
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)

}