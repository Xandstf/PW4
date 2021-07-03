import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Receitas from './pages/Receitas';
import Receita from './pages/Receita';
import Home from './pages/Home';
import Cadastro from './pages/CadastroReceita'

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/receitas' component={Receitas}/>
          <Route path='/cadastro' component={Cadastro}/>
          
          <Route path="/:nome" children={<Receita />} />
          <Route path='/home' component={Home}/>
          <Route path='/' component={Home}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
