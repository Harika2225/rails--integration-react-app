import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
  query GetCustomer {
    customer {
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
