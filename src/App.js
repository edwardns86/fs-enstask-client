import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import Navi from './components/Navbar';
import Home from './pages/Home';
import ProjectDash from './pages/ProjectsDash'
import SignIn from './pages/SignIn';
import { Row, Col } from 'react-bootstrap';
import './App.css';


function App() {
  const [user, setUser] = useState(null)
  const [currentProject, setCurrentProject] = useState({})
  // const [projects , setProjects] = useState([])
    ;

  useEffect(() => {
    getUserInfo();
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [])

  const doLogOut = async () => {
    const resp = await fetch("https://127.0.0.1:5000/logout", {
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
    }
  }

  const getUserInfo = async () => {
    const existingToken = localStorage.getItem("token");
    const accessToken =
      window.location.search.split("=")[0] === "?api_key"
        ? window.location.search.split("=")[1]
        : null;
    const resp = await fetch("https://127.0.0.1:5000/getuserinfo", {
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

  // const projectPage = async (id) => {
  //   console.log('test', id)
  //   const resp = await fetch(`https://127.0.0.1:5000/project/${id}`, {
  //       headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Token ${localStorage.getItem('token')}`
  //       }
  //   })
  //   if (resp.ok) {
  //       const data = await resp.json()
  //       if (data.success) {
  //           console.log('data', data)
  //           setCurrentProject(data)
  //           const url = `https://localhost:3000/project/${id}`
  //           window.location.href = url;

  //       }
  //       console.log('data2', data)

        // const url = `https://localhost:3000/project/${id}`
        // window.location.href = url;
//     }
// }

  return (
    <>
      <Navi
        user={user}
        doLogOut={doLogOut}
      />
      <Switch>
        <Route exact path='/' render={() => <Home />} />
        <Route path = "/project/:id" render={(projectPage={projectPage}) => <ProjectDash {...projectPage} />} />
      </Switch>    

    </>
  );
}

export default App;
