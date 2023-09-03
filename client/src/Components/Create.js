import React, { useState } from 'react'
import { ADD_USER } from '../Queries';
import { useMutation } from '@apollo/client';
import { Button, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

function Create() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [job_title, setJob_title] = useState('');
    
    let history = useNavigate();

    const [ addUser ] = useMutation(ADD_USER,);

    const handelSubmit = async (e) => {
        e.preventDefault();  // Prevent reload
        let b=name, c=email, d=job_title;
        try{
            await addUser({variables:{name:b, email:c, job_title:d}})
            history('/')//redirect to home
        }catch(error){alert(error)}
    }
    return (
        <div >
            <Form className="d-grid gap-2" 
                style={{marginLeft:'20rem', marginRight:'20em'}}>
                  
                <Form.Group className="mb-3" 
                    controlId="formBasicName">
                    <Form.Control onChange=
                        {e => setName(e.target.value)}
                        type="text" placeholder="Enter Name" required />
                </Form.Group>
                  
                <Form.Group className="mb-3" 
                    controlId="formBasicEmail">
                    <Form.Control onChange=
                        {e => setEmail(e.target.value)}
                        type="text" placeholder="Enter Email" required />
                </Form.Group>

                <Form.Group className="mb-3" 
                    controlId="formBasicJobTitle">
                    <Form.Control onChange=
                        {e => setJob_title(e.target.value)}
                        type="text" placeholder="Enter Job Title" required />
                </Form.Group>
                <div>
                    <Link to='/'>
                        <Button variant="info" size="md">
                            Home
                        </Button>
                    </Link>
                    <Button
                        onClick={async(e) => await handelSubmit(e)}
                        variant="primary" type="submit">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    )
}
  
export default Create