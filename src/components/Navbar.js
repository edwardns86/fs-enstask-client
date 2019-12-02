import React from "react";
import { Navbar, Nav, NavDropdown, } from 'react-bootstrap';
import { GoGraph, GoCalendar, GoSearch } from "react-icons/go";
import { FaPlusCircle, FaUserCircle } from 'react-icons/fa';


const Navi = (props) => {

    return (

        <Navbar md={12} className='navbar' bg="light" expand="lg" >

            <Navbar.Brand href="#home"><img
                src="https://i.imgur.com/W9k8Ei6.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="logo"
            />Hi, {props.user.name} </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                    <NavDropdown className="nav-add-task ml-5 mr-5" title={
                        <span><FaUserCircle /> </span>
                    } id="basic-nav-dropdown" >
                        <NavDropdown.Item href="#action/3.1">Take to Another View</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => props.doLogOut(props.user.user_id)} >Logout</NavDropdown.Item>
                    </NavDropdown>
                <Nav className=" ml-auto">
                    <Nav.Link className="nav-add-task ml-5" href="#link"><FaPlusCircle /></Nav.Link>
                    <Nav.Link className="nav-add-task ml-5" href="/stats"><GoGraph /></Nav.Link>
                    <Nav.Link className="nav-add-task ml-5" href="/"><GoCalendar /></Nav.Link>
                    <Nav.Link className="nav-add-task ml-5" href="#link"><GoSearch /></Nav.Link>
                    
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    );
}

export default Navi