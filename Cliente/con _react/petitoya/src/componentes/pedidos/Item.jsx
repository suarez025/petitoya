import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente de Pedido
const Pedido = ({ id_pedido, id_cliente, estado, fecha_compra }) => (
    <div className="card custom-card">
        <div className="card-body">
            <h5 className="card-title">{`Pedido ID: ${id_pedido}`}</h5>
            <p className="card-text">{`Cliente: ${id_cliente}`}</p>
            <p className="card-text">{`Estado: ${estado}`}</p>
            <p className="card-text">{`Fecha de Compra: ${fecha_compra}`}</p>
        </div>
    </div>
);

export const Item = ({id_cliente}) => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/pedidos/pos`);
                setPedidos(response.data);
            } catch (error) {
                console.error('Error fetching Pedidos:', error);
            }
        };

        fetchPedidos();
}, [id_cliente]);

    return (
        <div className="sugerencias d-flex">
            {/* Renderiza los pedidos aquí */}
            {pedidos.map(pedido => (
                <Pedido
                    key={pedido.id_pedido}
                    id_pedido={pedido.id_pedido}
                    id_cliente={pedido.id_cliente}
                    estado={pedido.estado}
                    fecha_compra={pedido.fecha_compra}
                />
            ))}
        </div>
    );
};