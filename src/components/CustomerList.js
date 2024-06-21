import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CUSTOMERS } from '../queries';
import { CREATE_CUSTOMER, UPDATE_CUSTOMER, DELETE_CUSTOMER } from '../mutations';
import CustomerModal from './CustomerModal';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import './styles.css'; // Ensure this path is correct

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const { loading, error, data } = useQuery(GET_CUSTOMERS);
  const [createCustomer] = useMutation(CREATE_CUSTOMER, {
    refetchQueries: [{ query: GET_CUSTOMERS }],
  });
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER, {
    refetchQueries: [{ query: GET_CUSTOMERS }],
  });
  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    refetchQueries: [{ query: GET_CUSTOMERS }],
  });

  useEffect(() => {
    if (data && data.customer) {
      setCustomers(data.customer);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleSubmit = async (customerData) => {
    try {
      await createCustomer({ variables: customerData });
    } catch (error) {
      console.error('Error submitting data:', error.message);
    }
  };

  const handleUpdateCustomer = async (customerId, customerData) => {
    try {
      await updateCustomer({ variables: { id: customerId, ...customerData } });
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerId ? { ...customer, ...customerData } : customer
        )
      );
    } catch (error) {
      console.error('Error updating customer:', error.message);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer({ variables: { id } });
    } catch (error) {
      console.error('Error deleting customer:', error.message);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditingCustomer(null);
    setOpenModal(false);
  };

  return (
    <div>
      <button
        className="ping-button"
        onClick={() => setOpenModal(true)}
        style={{ alignItems: 'revert-layer', textAlign: 'center' }}
      >
        Add Customer
      </button>
      <CustomerModal
        isOpen={openModal}
        onClose={handleCloseModal}
        onSubmit={(data) => {
          editingCustomer
            ? handleUpdateCustomer(editingCustomer.id, data)
            : handleSubmit(data);
        }}
        initialValues={editingCustomer}
      />
      <table>
        <thead>
          <tr style={{ color: 'black', backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Sno</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>First Name</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Last Name</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Phone</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Address</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}></th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr
              key={customer.id}
              style={{
                color: 'black',
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
              }}
            >
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{index + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.firstname}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.lastname}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.email}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.phone}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.address}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'center' }}>
                <MdEdit
                  style={{ fontSize: 20, color: 'red', cursor: 'pointer' }}
                  onClick={() => handleEditCustomer(customer)}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'center' }}>
                <MdDeleteOutline
                  style={{ fontSize: 20, color: 'red', cursor: 'pointer' }}
                  onClick={() => handleDeleteCustomer(customer.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
