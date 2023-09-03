import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client';
import { EDIT_USER } from '../Queries';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

function Edit() {
    const [job_title, setJob_title] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState(0);
 
    let navigate = useNavigate()

    useEffect(() => {
        setId(parseInt(localStorage.getItem('id')))//set the integer value
        setName(localStorage.getItem('name'))
        setEmail(localStorage.getItem('email'))
        setJob_title(localStorage.getItem('job_title'))
    }, [])

    const [ changeUser ] = useMutation(EDIT_USER,);

    const handelSubmit = async(e) => {
        e.preventDefault();
        let a=id, b=name, c=email, d=job_title;
        try{
            await changeUser({variables:{id:a, name:b, email:c, job_title:d}});
            navigate('/');
        }catch(error){alert(error)}
    }
    return (
        <div>
            <Form className="d-grid gap-2" 
                    style={{marginLeft:'20rem', marginRight:'20em'}}>
                <Form.Group className="mb-3">
                    <Form.Control value={name}
                        onChange={e => setName(e.target.value)}
                        type="text" placeholder="Enter Name" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="text" placeholder="Enter Email" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control value={job_title}
                        onChange={e => setJob_title(e.target.value)}
                        type="text" placeholder="Enter Job Title" />
                </Form.Group>
                <div>
                    <Link  to='/'>
                        <Button variant="primary" size="md">
                            Home
                        </Button>
                    </Link>
                    <Button
                        onClick={async(e) => await handelSubmit(e)
                        }variant="warning" type="submit" size="md">
                        Update
                    </Button>
                </div>
            </Form>
        </div>
    )
}
export default Edit;