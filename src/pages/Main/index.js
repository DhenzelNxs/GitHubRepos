import React, { Component } from "react";

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import './index.css'
import { Link, json } from 'react-router-dom'

import api from "../../services/api";


export default class Main extends Component{

    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        error: false,
    }

    componentDidMount(){
        const repositories = localStorage.getItem('repositories')

        if(repositories){
            this.setState({ repositories: JSON.parse(repositories)})
        }
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state
        

        if (prevState.repositories != this.state.repositories){
            localStorage.setItem('repositories', JSON.stringify(repositories))
        }
    }

    handleInputChange = e => {
        
        this.setState({ newRepo: e.target.value })        
        
    }

    handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          this.setState({ loading: true });
      
          const { newRepo, repositories } = this.state;
      
          // Verifique se o repositório já existe na lista
          const repositoryExists = repositories.some(
            (repo) => repo.name === newRepo
          );
      
          if (repositoryExists) {
            throw new Error('Repositório já existe na lista.');
          }
      
          const response = await api.get(`/repos/${newRepo}`);
      
          const data = {
            name: response.data.full_name,
          };
      
          console.log(response);
      
          this.setState({
            repositories: [...repositories, data],
            newRepo: '',
            loading: false,
            error: false, // Resetar o estado de erro se a operação for bem-sucedida
          });
        } catch (error) {
          this.setState({ error: true });
          alert('Erro ao buscar os dados: ' + error.message);
          this.setState({ loading: false });
        }
      };
      

    render(){
        const { newRepo, loading, repositories, error } = this.state;

        return(
            <div className="Container">
                
                <h1>
                <FaGithubAlt className="github"/>
                Repositórios
                </h1>
    
                <form onSubmit={this.handleSubmit}>
                    <input 
                    type="text"
                    placeholder="Adicionar repositório"
                    value={newRepo}
                    onChange={this.handleInputChange}
                    className={error ? "input-error":"input"}
                    ></input>
                
                
                <button type="submit" className="SubmitButton" >
                    <div className="loading">
                        { loading ? 
                        <FaSpinner className="spinner" size={14}></FaSpinner>    
                    :
                        <FaPlus className="add" color="#fff" size={14}/>
                    }
                    </div>    
                        
                </button>

                

                </form>

            <div className="List">
                    {repositories.map(rep => ( 
                        <li key={rep.name}>
                            <span>{rep.name}</span>
                            <Link to={`/repository/${encodeURIComponent(rep.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </div>

            </div>
        )
    }
}

