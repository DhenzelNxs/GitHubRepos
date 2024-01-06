import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import api from "../../services/api";
import '../Repository/repo.css'
import { Link } from 'react-router-dom'

export default function Repository() {
    
    
    const [newRepo, setNewRepository] = useState({})
    const [newIssues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const { rep } = useParams()


    async function RepSearch (){
        

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${rep}`),
            api.get(`/repos/${rep}/issues?`, {
                params: {
                    state: 'open',
                    per_page: 5,
                },
            })
            
        ])
        
       setNewRepository(repository.data)
       setIssues(issues.data)
       setLoading(false)
        
       
    }
    
   useEffect(() => {
    RepSearch()
   }, [])
    
    return(
        <div >
            {loading ? 
            <div className="Loading">Carregando</div> : 
            <div className="container">
                <div className="Owner">
                    <Link className="link" to="/">Voltar aos Repositórios</Link>
                    <img className="avatarLogo" src={newRepo.owner.avatar_url} alt={newRepo.owner.login}/>
                    <h1>{newRepo.name}</h1>
                    <p>{newRepo.description}</p>
                </div>
                <div className="IssueList">
                    {newIssues.map(issues => (
                        <li className="listagem" key={String(issues.id)}>
                            <img className="userLogo" src={issues.user.avatar_url} alt={issues.user.login}></img>
                            <div>
                                <strong>
                                    <a href={issues.html_url}>{issues.title}</a>
                                    {issues.labels.map(label => (
                                        <span className="span" key={String(label.id)}>
                                            {label.name}
                                        </span>
                                    ))}
                                </strong>
                                <p>{issues.user.login}</p>
                            </div>
                        </li>
                    ))}
                </div>
            </div>
            }
        </div>
    )
    
    
          
}