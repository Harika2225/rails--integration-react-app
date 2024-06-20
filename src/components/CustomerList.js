import React, { useState, useEffect } from 'react';
import CustomerModal from './CustomerModal';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import './styles.css'; // Ensure this path is correct

const CustomerList = ({ customersApp }) => {
  const [customers, setCustomers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    // Fetch customers from the backend API
    const getCustomers = async () => {
      try {
        const response = await fetch('http://localhost:9020/api/getCustomer', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          console.error('Data is not an array:', data);
          setCustomers([]);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      }
    };
    getCustomers();
  }, []);

  const handleSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:9020/api/createCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setCustomers((prevCustomers) => [...prevCustomers, responseData]);
      } else {
        const errorText = await response.text();
        console.error('Error submitting data:', errorText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Example handleUpdateCustomer function
  const handleUpdateCustomer = async (customerId, customerData) => {
    try {
      const response = await fetch(`http://localhost:9020/api/updateCustomerById/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error('Customer not found');
      }

      const updatedCustomer = await response.json();

      // Update the state with the updated customer
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerId ? updatedCustomer : customer
        )
      );

      console.log('Customer updated successfully', updatedCustomer);
    } catch (error) {
      console.error('Error updating customer:', error.message);
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

  const handleDeleteCustomer = async (id) => {
    try {
      const response = await fetch(`http://localhost:9020/api/deleteCustomerById?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== id));
      } else {
        const errorText = await response.text();
        console.error('Error deleting customer:', errorText);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div>
      <button
        className="ping-button"
        onClick={() => setOpenModal(true)}
        style={{ alignItems: 'revert-layer', textAlign:'center' }}
      >
        Add Customer
      </button>
      <CustomerModal
        isOpen={openModal}
        onClose={handleCloseModal}
        onSubmit={(data) => {
          editingCustomer ? handleUpdateCustomer(editingCustomer.id, data) : handleSubmit(data);
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
              key={index}
              style={{
                color: 'black',
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
              }}
            >
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{index + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.firstName}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.lastName}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.email}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.phone}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{customer.address}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'center' }}>
                <MdEdit style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} onClick={() => handleEditCustomer(customer)} />
              </td>
              <td style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'center' }}>
                <MdDeleteOutline style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteCustomer(customer.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
