import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import api from "../../services/api";
import './repo.css';

export default function Repository() {
  const [newRepo, setNewRepository] = useState({});
  const [newIssues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { rep } = useParams();

  async function RepSearch() {
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${rep}`),
      api.get(`/repos/${rep}/issues?`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      })
    ]);

    setNewRepository(repository.data);
    setIssues(issues.data);
    setLoading(false);
  }

  useEffect(() => {
    RepSearch();
  }, []);

  return (
    <div className="page">
      {loading ? (
        <div className="Loading">⏳ Carregando...</div>
      ) : (
        <div className="container">
          <div className="Owner">
            <Link className="back-button" to="/">← Voltar</Link>
            <img
              className="avatarLogo"
              src={newRepo.owner.avatar_url}
              alt={newRepo.owner.login}
            />
            <h1>{newRepo.name}</h1>
            <p>{newRepo.description}</p>

            {/* Info extras */}
            <div className="repo-info">
              <span>⭐ {newRepo.stargazers_count} Stars</span>
              <span>🍴 {newRepo.forks_count} Forks</span>
              <span>👀 {newRepo.watchers_count} Watchers</span>
              <span>📌 {newRepo.open_issues_count} Issues</span>
              <span className="lang">
                🎨 {newRepo.language || "Não especificada"}
              </span>
              <span>
                ⏳ Última atualização:{" "}
                {new Date(newRepo.updated_at).toLocaleDateString("pt-BR")}
              </span>
              <span className={`badge ${newRepo.private ? "private" : "public"}`}>
                {newRepo.private ? "Privado 🔒" : "Público 🌍"}
              </span>
            </div>

            {/* Botões */}
            <div className="repo-buttons">
              <a
                href={newRepo.html_url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                🔗 Ver no GitHub
              </a>
              <a
                href={newRepo.owner.html_url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                👤 Dono: {newRepo.owner.login}
              </a>
            </div>

            {/* Topics */}
            {newRepo.topics && newRepo.topics.length > 0 && (
              <div className="topics">
                {newRepo.topics.map((topic, idx) => (
                  <span key={idx} className="topic-tag">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Lista de Issues */}
          <ul className="IssueList">
            {newIssues.map(issue => (
              <li className="listagem" key={String(issue.id)}>
                <img
                  className="userLogo"
                  src={issue.user.avatar_url}
                  alt={issue.user.login}
                />
                <div>
                  <strong>
                    <a href={issue.html_url} target="_blank" rel="noreferrer">
                      {issue.title}
                    </a>
                    {issue.labels.map(label => (
                      <span
                        className="label-tag"
                        style={{ backgroundColor: `#${label.color}` }}
                        key={String(label.id)}
                      >
                        {label.name}
                      </span>
                    ))}
                  </strong>
                  <p>Autor: {issue.user.login}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
