import React, { Component } from "react";
import { FaGithubAlt, FaPlus, FaSpinner, FaLink, FaInfoCircle } from 'react-icons/fa';
import './index.css';
import { Link } from 'react-router-dom';
import api from "../../services/api";

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      this.setState({ loading: true });
      const { newRepo, repositories } = this.state;

      const repositoryExists = repositories.some(
        (repo) => repo.name === newRepo
      );
      if (repositoryExists) {
        throw new Error('Repositório já existe na lista.');
      }

      const response = await api.get(`/repos/${newRepo}`);
      const data = { name: response.data.full_name };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        error: false,
      });
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  };

  render() {
    const { newRepo, loading, repositories, error } = this.state;

    return (
      <div className="page">
        <div className="Container">
          <h1>
            <FaGithubAlt className="github" />
            Repositórios
          </h1>

          {/* Informativo bonito */}
          <div className="info-box">
            <FaInfoCircle className="info-icon" />
            <span>Digite no formato <strong>usuário/nome-do-repositório</strong> para buscar no GitHub</span>
          </div>

          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="ex: facebook/react"
              value={newRepo}
              onChange={this.handleInputChange}
              className={error ? "input-error" : "input"}
            />
            <button type="submit" className="SubmitButton">
              <div className="loading">
                {loading ? (
                  <FaSpinner className="spinner" size={14} />
                ) : (
                  <FaPlus className="add" color="#fff" size={14} />
                )}
              </div>
            </button>
          </form>

          {error && (
            <p className="error-message">⚠ Repositório inválido ou já existente.</p>
          )}

          <ul className="List">
            {repositories.map(rep => (
              <li key={rep.name} className="repo-card">
                <span>{rep.name}</span>
                <Link to={`/repository/${encodeURIComponent(rep.name)}`} className="details-link">
                  <FaLink /> Detalhes
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
