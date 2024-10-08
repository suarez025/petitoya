import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap'; // Importa los componentes de Bootstrap necesarios
const apiUrl = import.meta.env.VITE_API_URL;

export const ValidacionToken = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  return (
    <Container className="request-reset-password d-flex flex-column justify-content-center">
      <Row className=" password  justify-content-center">

        <Col md={6} className="justify-content-center">
          <h2 className="text-center mb-4">Recuperación de Cuenta</h2>
          <Formik
            initialValues={{ correo_electronico: '' }}
            validationSchema={Yup.object({
              correo_electronico: Yup.string()
                .email('Correo electrónico inválido')
                .required('Correo electrónico es obligatorio'),
            })}
            onSubmit={(values, { setSubmitting, setFieldValue }) => {
              axios.post(`${apiUrl}/auth/request-password-reset`, values)
                .then(response => {
                  setMessage('Se ha enviado un código de verificación a tu correo electrónico.');
                  setFieldValue('id_cliente', response.data.id_cliente);
                  navigate('/verify-code', { state: { id_cliente: response.data.id_cliente } });
                })
                .catch(error => {
                  setError(error.response ? error.response.data.error : error.message);
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            <Form>
              {error && <div className="text-danger">{error}</div>}
              {message && <div className="text-success">{message}</div>}
              <div className="mb-3">
                <label htmlFor="correo_electronico" className="form-label">Correo Electrónico</label>
                <Field
                  type="email"
                  name="correo_electronico"
                  className="form-control"
                  placeholder="Correo Electrónico"
                />
                <ErrorMessage name="correo_electronico" component="div" className="text-danger" />
              </div>
              <div className='mx-4 d-flex align-items-center justify-content-center cuerpo text-uppercase text-uppercase'>
                <Button type="submit" className='bg-naranj border-0'>Enviar</Button>
              </div>
            </Form>
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default ValidacionToken;