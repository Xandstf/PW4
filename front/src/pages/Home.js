import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usuario: [],
		};
	}

	componentDidMount() {
		this.getUsuario();
	}

	// Retrieves the list of items from the Express app
	getUsuario = () => {
		fetch("/api/usuario")
			.then((res) => res.json())
			.then((usuario) => this.setState({ usuario }));
	};

	render() {
		const { usuario } = this.state;
		return (
			<div className="App">
				<h2 className="welcome-message">Boas vindas, {usuario.nome}</h2>

				<button className="back-button">
					<Link to={"./receitas"}>Visualizar receitas</Link>
				</button>

				<button className="back-button ${usuario.permissao}">
					<Link to={"./cadastro"}>Cadastrar Nova Receita</Link>
				</button>
			</div>
		);
	}
}
export default Home;
