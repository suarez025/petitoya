import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import io from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = import.meta.env.VITE_API_URL;
const socket = io(apiUrl); // Ajusta la URL según tu configuración

const OrdersManagement = () => {
  const [ordersType, setOrdersType] = useState('pendiente');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    fetchOrders(ordersType);

    // Listener for socket notifications
    socket.on('notificacion', (data) => {
      toast.info(data.mensaje);
    });

    return () => {
      socket.off('notificacion'); // Clean up listener on component unmount
    };
  }, [ordersType]);

  const fetchOrders = async (type) => {
    let url = `${apiUrl}/super/${type}`;
    try {
      const response = await axios.get(url);
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error(`Error fetching ${type} orders:`, error.message);
      setError('Error al cargar los pedidos. Inténtelo de nuevo más tarde.');
    }
  };

  const handleUpdateOrderStatus = async (idPedido, nuevoEstado) => {
    try {
      await axios.put(`${apiUrl}/super/${idPedido}`, { nuevoEstado });
      const updatedOrders = orders.filter(order => order.id_pedido !== idPedido);
      setOrders(updatedOrders);
      setError(null);
      toast.success(`El estado del pedido ${idPedido} se ha actualizado a ${nuevoEstado}.`);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error al actualizar el estado del pedido. Inténtelo de nuevo más tarde.');
    }
  };

  const changeOrdersType = (type) => {
    setOrdersType(type);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  const fetchDetalles = async (idPedido) => {
    try {
      const response = await axios.get(`${apiUrl}/orders/detalles/${idPedido}`);
      setDetalles(response.data);
    } catch (error) {
      console.error('Error fetching detalles:', error);
    }
  };

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    fetchDetalles(order.id_pedido);
    setShowModal(true);
  };

  const handleDivClick = (event, order) => {
    if (!event.target.closest('.btn')) {
      handleShowModal(order);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="col-md-6">
          <h2>Pedidos {ordersType.charAt(0).toUpperCase() + ordersType.slice(1)}</h2>
        </div>
        <div className="col-md-6 d-flex justify-content-end align-items-center">
          <div className="btn-group" role="group" aria-label="Opciones de tipo de pedidos">
            <button
              type="button"
              className={`btn ${ordersType === 'pendiente' ? 'custom-button' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('pendiente')}
            >
              Pendientes
            </button>
            <button
              type="button"
              className={`btn ${ordersType === 'en proceso' ? 'custom-button' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('en proceso')}
            >
              En Proceso
            </button>
            <button
              type="button"
              className={`btn ${ordersType === 'por entrega' ? 'custom-button' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('por entrega')}
            >
              Por Entrega
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {orders.map(order => (
          <div key={order.id_pedido} className="col-md-6 mb-4">
            <div className="card" onClick={(event) => handleDivClick(event, order)} style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <h5 className="card-title">ID Pedido: {order.id_pedido}</h5>
                <p className="card-text">Cliente: {order.id_cliente}</p>
                <p className="card-text">Estado: {order.estado}</p>
                <p className="card-text">Fecha de Compra: {formatDate(order.fecha_compra)}</p>
                <div className="btn-group" role="group" aria-label="Opciones de estado">
                  {ordersType === 'pendiente' && (
                    <button
                      type="button"
                      className="btn btn-sm custom-button"
                      onClick={() => handleUpdateOrderStatus(order.id_pedido, 'en proceso')}
                    >
                      Marcar como En Proceso
                    </button>
                  )}
                  {ordersType === 'en proceso' && (
                    <button
                      type="button"
                      className="btn btn-sm custom-button"
                      onClick={() => handleUpdateOrderStatus(order.id_pedido, 'por entrega')}
                    >
                      Marcar como Por Entrega
                    </button>
                  )}
                  {ordersType === 'por entrega' && (
                    <button
                      type="button"
                      className="btn btn-sm custom-button"
                      onClick={() => handleUpdateOrderStatus(order.id_pedido, 'entregado')}
                    >
                      Marcar como Entregado
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <ToastContainer />

      {selectedOrder && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{`Pedido ID: ${selectedOrder.id_pedido}`}</h5>
            <p>{`Estado: ${selectedOrder.estado}`}</p>
            <p>{`Total a Pagar: $${selectedOrder.total_pagar}`}</p>
            <p>{`Fecha de Compra: ${formatDate(selectedOrder.fecha_compra)}`}</p>
            <h6>Productos:</h6>
            {detalles.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.nombre}</td>
                      <td>{detalle.descripcion}</td>
                      <td>{`$${detalle.precio}`}</td>
                      <td>{detalle.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Cargando detalles...</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default OrdersManagement;
