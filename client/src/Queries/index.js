import { gql } from '@apollo/client';

export const GET_USERS = gql`
  {
    getUsers{
      id,
      name,
      job_title,
      email,
      joining_date,
      content
    }
  }
`;

export const VIEW_USER = gql`
  query ($id: Int){
    getUser(id: $id) {
      id,
      name,
      job_title,
      email,
      joining_date,
      content
    }
  }
`;

export const ADD_USER = gql`
  mutation($name: String, $email: String, $job_title: String, $joining_date:Date, $content:Blob) {
    createUser (name: $name, email: $email, job_title: $job_title, joining_date:$joining_date, content:$content)
  }
`;

export const EDIT_USER = gql`
  mutation($id: Int, $name: String, $email: String, $job_title: String, $joining_date:Date, $content:Blob) {
    updateUser(id: $id, name: $name, email: $email, job_title: $job_title, joining_date:$joining_date, content:$content)
  }
`;

export const DELETE_USER = gql`
  mutation($id: Int) {
    deleteUser(id: $id)
  }
`;
