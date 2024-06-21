import { gql } from '@apollo/client';

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($firstname: String!, $lastname: String!, $email: String!, $phone: String!, $address: String!) {
    insert_customer_one(object: {
      firstname: $firstname,
      lastname: $lastname,
      email: $email,
      phone: $phone,
      address: $address
    }) {
      id
      address
      email
      firstname
      lastname
      phone
      createdat
      updatedat
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: Int!, $firstname: String!, $lastname: String!, $email: String!, $phone: String!, $address: String!) {
    update_customer_by_pk(pk_columns: {id: $id}, _set: {
      firstname: $firstname,
      lastname: $lastname,
      email: $email,
      phone: $phone,
      address: $address
    }) {
      id
      address
      email
      firstname
      lastname
      phone
      createdat
      updatedat
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: Int!) {
    delete_customer_by_pk(id: $id) {
      id
    }
  }
`;
