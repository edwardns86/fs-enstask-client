import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'
import Navi from './components/Navbar';
import Home from './pages/Home';
import ProjectDash from './pages/ProjectsDash'
import SignIn from './pages/SignIn';
import { Row, Col } from 'react-bootstrap';
import './App.css';


function App() {
  const [user, setUser] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const history = useHistory()
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
        console.log('All users',data)
        setAllUsers(data)
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
    } else {
      localStorage.clear("token")
    }
  }

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
        user={user}
        
        />} />
        <Route path = "/project/:id" render={(projectPage={projectPage}) => <ProjectDash 
        allUsers={allUsers}
        {...projectPage} />} />
      </Switch>    

    </>
  );
}

export default App;
