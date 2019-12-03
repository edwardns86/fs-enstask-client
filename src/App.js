import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import Navi from './components/Navbar';
import Calendar from './components/Calendar';
import Projects from './components/HomeProjects';
import HomeDashboard from './components/HomeDashboard';
import SignIn from './pages/SignIn';
import { Row, Col, Button } from 'react-bootstrap';
import './App.css';


function App() {
  const [user, setUser] = useState(null)
  ;

  useEffect(() => {
    getUserInfo();
    window.history.replaceState({}, document.title, '/');
  }, [])

  const doLogOut = async ( ) => {
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
      <>
      <Row style={{ height: '90vh' }}>
        <Col className="login col-6" >
        <SignIn 
        user={user}
        setUser={setUser}
        />
      </Col>
      </Row>
      </>
    )
  }
  return (
    <>
      <Navi
        user={user}
        doLogOut={doLogOut}
      />
      <Row style={{ height: '90vh' }}>
        <Col className='projects' md={2}>
          <Projects 
          user={user}
          />
        </Col>
        <Col md='10'>
          <Row style={{ height: '100vh' }}>
            <Switch>
              <Col className='m-0 p-0' md={8}>
                <Route exact path='/' component={Calendar} />
                <Route path='/stats' component={HomeDashboard} />
              </Col>
            </Switch >

            <Col className='home-task-feed' md={4}>
              <h1>User Tasks </h1>
              <hr />
              <h2>CheckList</h2>
              <hr />
              <p> Create quick to dos and which can also become tasks </p>
              <h2> Due this Week </h2>
              <hr />
              <p>Show current user due tasks and any uncompleted highlighted</p>

            </Col>
          </Row>
        </Col>
      </Row>

    </>
  );
}

export default App;
