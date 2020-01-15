import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'
import Navi from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectDash from './pages/ProjectsDash'
import UserTasks from './pages/UserTasks'
import SignIn from './pages/SignIn';
import AllProjects from './pages/AllProjects'
import { Row, Col } from 'react-bootstrap';
import './App.css';


function App() {
  const [user, setUser] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const history = useHistory()
  const [loading, setLoading] = useState(true)
    ;

  useEffect(() => {
    getUserInfo();
    getUsers();
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [])

  const getUsers = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/getusers`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
    if (resp.ok) {
        const data = await resp.json()
        setAllUsers(data)
        setLoading(false)
    }
}


  const doLogOut = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/logout`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    })
    if (resp.ok) {
      const data = await resp.json()
      if (data.success) {
        localStorage.clear('token')
        setUser(null)
      }
    history.push("/")
    }
  }

  const getUserInfo = async () => {
    const existingToken = localStorage.getItem("token");
    const accessToken =
      window.location.search.split("=")[0] === "?api_key"
        ? window.location.search.split("=")[1]
        : null;
    const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/getuserinfo`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${existingToken || accessToken}`
      }
    })

    if (resp.ok) {
      const data = await resp.json()
      localStorage.setItem("token", data.token)
      setUser(data.user)
      setLoading(false)
    } else {
      localStorage.clear("token")
      setLoading(false)
    }
  }

  if (loading === true) return <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
  <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
  </div>
  </div>

  if (!user) {
    return (
      <div className="logindiv" >
        <Row style={{ height: '100vh',}}>
          <Col className="login col-6" >
            <SignIn
              user={user}
              setUser={setUser}
            />
          </Col>
        </Row>
      </ div>
    )
  }

  return (
    <>
      <Navi
        user={user}
        doLogOut={doLogOut}
        allUsers={allUsers}
      />
      <Switch>
        <Route exact path='/' render={() => <Home 
        user={user} />} 
        />

        <Route path = "/project/:id" render={(projectPage={projectPage}) => <ProjectDash 
        user={user}
        allUsers={allUsers}
        {...projectPage} />} />

        <Route path = '/mytasks' render={() => <UserTasks 
        user={user}
        allUsers={allUsers}
        />} 
        />

        <Route path = '/allprojects' render={() => <AllProjects
        user={user}
        allUsers={allUsers}
        />} 
        />
        
      </Switch>    
      <Footer />
      

    </>
  );
}

export default App;
