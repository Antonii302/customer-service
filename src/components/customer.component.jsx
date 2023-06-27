import { actionUpdate } from '../services/customer.service';
import { actionShiftStatus } from '../services/customer.service';

import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import NProgress from "nprogress";

import React, { Component } from 'react';

export default class Customer extends Component {
    constructor(props) {
        super(props);

        const { customer } = this.props;

        this.onShifStatus = this.onShifStatus.bind(this);
        this.submit = this.submit.bind(this);

        this.closeModal = this.closeModal.bind(this);

        this.state = {
            customer: customer,
            selectedCustomer: undefined,
            clientUpdated: false,
            showModal: false
        };
    }

    submit(id, customer) {
        NProgress.start();

        actionUpdate(id, customer).then(response => {
            this.props.retrieveCustomers();

            toast('Cambios realizados con éxito', {
                type: 'success',
                position: 'bottom-right'
            });

            this.setState({
                clientUpdated: true
            });
        }).catch(error => {
            toast(error.message, {
                type: 'error',
                position: 'bottom-right'
            });
        }).finally(() => NProgress.done());
    }

    onShifStatus(id) {
        if (window.confirm('¿Estás seguro que deseas cambiar el estado de este elemento?')) {
            NProgress.start();

            actionShiftStatus(id).then(response => {
                this.props.retrieveCustomers();

                toast('Cambios realizados con éxito', {
                    type: 'success',
                    position: 'bottom-right'
                });
            }).catch(error => {
                toast(error.message, {
                    type: 'error',
                    position: 'bottom-right'
                });
            }).finally(() => NProgress.done());
        }
    }

    openModal(customer) {
        this.setState({
            selectedCustomer: customer,
            showModal: true
        });
    }

    closeModal() {
        this.setState({
            selectedCustomer: null,
            clientUpdated: false,
            showModal: false,
        });
    }

    render() {
        const { customer, selectedCustomer, clientUpdated, showModal } = this.state;

        return (
            <div className='container-fluid shadow-sm mt-1 mb-4' >
                <div className='row d-block d-sm-none p-2'>
                    <div className='col'>
                        <p className='fs-6 text-secondary'>
                            {customer.id}
                        </p>
                    </div>
                </div>
                <div className='row p-2'>
                    <div className='d-none d-sm-block col-sm-4 col-md-3'>
                        <p className='fs-6 text-truncate'>
                            {customer.email}
                        </p>
                    </div>
                    <div className='col-8 d-sm-none d-md-block col-md-3'>
                        <p className='fs-6 text-primary'>
                            {customer.first_name + ' ' + customer.last_name}
                        </p>
                    </div>
                    <div className='col col-sm-3 col-md-2'>
                        {
                            (() => {
                                const is_active = customer.is_active;
                                return (
                                    <>
                                        <p className={'fs-6 ' + (is_active ? 'text-success' : 'text-secondary')}>
                                            <span>
                                                {
                                                    is_active ? 'Activo' : <><i className="fas fa-minus-circle"></i> Inactivo</>
                                                }
                                            </span>
                                        </p>
                                    </>
                                );
                            })()
                        }
                    </div>
                    <div className='col-9 col-sm-3'>
                        {
                            (() => {
                                const updated_at = customer.updated_at;
                                return (
                                    <>
                                        <p className={'fs-6 ' + (updated_at ? 'text-secondary' : 'text-danger')}>
                                            {
                                                updated_at ? updated_at : 'No se ha actualizado'
                                            }
                                        </p>
                                    </>
                                );
                            })()
                        }
                    </div>
                    <div className='col d-flex justify-content-center'>
                        <div className="dropdown">
                            <button type='button' className='btn btn-light dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'></button>
                            <ul className='dropdown-menu dropdown-menu-end' style={{ minWidth: 100 + 'px' }} aria-labelledby='dropdown'>
                                <li onClick={() => this.openModal(customer)}>
                                    <button type='button' className='fs-6 dropdown-item'>Editar cliente</button>
                                </li>
                                <li onClick={() => this.onShifStatus(customer.id)}>
                                    <button type='button' className='fs-6 dropdown-item'>Cambiar estado</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    clientUpdated ? this.closeModal() : (
                        <>
                            <Modal show={showModal} onHide={this.closeModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edición del registro</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form autocomplete='off'>
                                        <div className="container-fluid">
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <label htmlFor="email" className='form-label text-muted'>Correo electrónico</label>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        className="form-control form-control-sm rounded-0"
                                                        id="email"
                                                        value={selectedCustomer?.email || ''}
                                                        onChange={e => this.setState({ selectedCustomer: { ...selectedCustomer, email: e.target.value } })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-12 col-sm-5">
                                                    <label htmlFor="first_name" className='form-label text-muted'>Nombre</label>
                                                    <input
                                                        type="text"
                                                        name="first_name"
                                                        className="form-control form-control-sm rounded-0"
                                                        id="first_name"
                                                        value={selectedCustomer?.first_name || ''}
                                                        onChange={e => this.setState({ selectedCustomer: { ...selectedCustomer, first_name: e.target.value } })}
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-7">
                                                    <label htmlFor="last_name" className='form-label text-muted'>Apellido</label>
                                                    <input
                                                        type="text"
                                                        name="last_name"
                                                        className="form-control form-control-sm rounded-0"
                                                        id="last_name"
                                                        value={selectedCustomer?.last_name || ''}
                                                        onChange={e => this.setState({ selectedCustomer: { ...selectedCustomer, last_name: e.target.value } })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <label htmlFor="DUI" className='form-label text-muted'>DUI</label>
                                                    <input
                                                        type="text"
                                                        name="DUI"
                                                        className="form-control form-control-sm rounded-0"
                                                        id="DUI"
                                                        value={selectedCustomer?.DUI || ''}
                                                        onChange={e => this.setState({ selectedCustomer: { ...selectedCustomer, DUI: e.target.value } })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col">
                                                    <label htmlFor="NIT" className='form-label text-muted'>NIT</label>
                                                    <input
                                                        type="text"
                                                        name="NIT"
                                                        className="form-control form-control-sm rounded-0"
                                                        id="NIT"
                                                        value={selectedCustomer?.NIT || ''}
                                                        onChange={e => this.setState({ selectedCustomer: { ...selectedCustomer, NIT: e.target.value } })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col">
                                                    <label htmlFor="address" className='form-label text-muted'>Dirección</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        className="form-control form-control-sm rounded-0"
                                                        id="address"
                                                        value={selectedCustomer?.address || ''}
                                                        onChange={e => this.setState({ selectedCustomer: { ...selectedCustomer, address: e.target.value } })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer className='border-0'>
                                    <>
                                        <Button variant="primary" className='btn-sm rounded-0' onClick={() => this.submit(selectedCustomer.id, selectedCustomer)}>
                                            Completar registro
                                        </Button>
                                    </>
                                </Modal.Footer>
                            </Modal>
                        </>
                    )
                }
            </div >
        );
    }
}