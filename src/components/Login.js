import React , {useState} from 'react';
import { Form, Button } from 'react-bootstrap';


const Login = (props) => {
    const [user, setUser] = useState({})

    const [input,setInput] = useState({})
    const handleOnChange = (e) => {
        setInput({ ...input,
            [e.target.name]:e.target.value
        })
    }

    const login = async(e)=>{
        e.preventDefault()
        const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/login` ,{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(input)
        });
        const data = await res.json()
        if (data.success){
            localStorage.setItem('token', data.token)
            setUser(data.user)
            window.location.replace('/')
        }
    }

    return (
<Form onChange={e=>handleOnChange(e)} onSubmit={(e)=>login(e)}>
    <h1>Login</h1>
    <img
                        src="https://i.imgur.com/W9k8Ei6.png"
                        width="100"
                        height="100"
                        className="d-inline-block align-top"
                        alt="logo"
                    />
    <Form.Group controlId="formBasicEmail">
        <Form.Control type="email" name="email" placeholder="Enter email" />
    </Form.Group>
    <Form.Group controlId="formBasicPassword">
        <Form.Control type="password" name="password" placeholder="Password" />
    </Form.Group>
    <Button block size="lg" variant="success" type="submit">
        Login
    </Button>
    <Button block size="lg" variant="danger" href='/register' >Register</Button>
    
</Form>
    )
}
export default Login