import { actionCreate } from '../services/customer.service';

import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import NProgress from "nprogress";

import React, { Component } from 'react';

export default class Create extends Component {
    constructor(props) {
        super(props);

        this.inputChange = this.inputChange.bind(this);
        this.submit = this.submit.bind(this);

        this.closeModal = this.closeModal.bind(this);

        this.reloadPage = this.reloadPage.bind(this);

        this.state = {
            formValues: {
                email: undefined,
                first_name: undefined,
                last_name: undefined,
                DUI: undefined,
                NIT: undefined,
                address: undefined
            },
            clientCreated: false,
            showModal: false
        };
    }

    inputChange(e) {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            formValues: {
                ...prevState.formValues,
                [name]: value
            }
        }));
    }

    submit() {
        const { formValues } = this.state;

        NProgress.start();

        actionCreate(formValues).then(response => {
            this.props.retrieveCustomers();

            toast('Registro agregado con éxito', {
                type: 'success',
                position: 'bottom-right'
            });

            this.setState({
                formValues: {
                    email: undefined,
                    first_name: undefined,
                    last_name: undefined,
                    DUI: undefined,
                    NIT: undefined,
                    address: undefined
                },
                clientCreated: true
            });
        }).catch(error => {
            toast(error.message, {
                type: 'error',
                position: 'bottom-right'
            });
        }).finally(() => NProgress.done());
    }

    reloadPage() {
        this.props.retrieveCustomers();

        this.props.updateEmail();
    }

    closeModal() {
        this.setState({
            selectedCustomer: null,
            clientUpdated: false,
            showModal: false,
        });
    }

    render() {
        const { formValues, showModal, clientCreated } = this.state;

        return (
            <>
                <div className="input-group" style={{ marginBottom: 32 + 'px' }}>
                    <button
                        type='button'
                        className='btn btn-sm btn-success rounded-0'
                        onClick={() => this.setState({ showModal: true })}>
                        <i className='fas fa-plus'></i> Nuevo registro
                    </button>
                    <button
                        className='btn btn-light'
                        type='button'
                        onClick={this.reloadPage}
                    >
                        <i className='fab fa-digital-ocean'></i>
                    </button>
                </div>
                {
                    clientCreated ? this.closeModal() : (
                        <>
                            <Modal show={showModal} onHide={this.closeModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Nuevo registro</Modal.Title>
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
                                                        value={formValues.email}
                                                        onChange={this.inputChange}
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
                                                        value={formValues.first_name}
                                                        onChange={this.inputChange}
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-7">
                                                    <label htmlFor="last_name" className='form-label text-muted'>Apellido</label>
                                                    <input
                                                        type="text"
                                                        name="last_name"
                                                        className="form-control form-control-sm rounded-0"
                                                        id="last_name"
                                                        value={formValues.last_name}
                                                        onChange={this.inputChange}
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
                                                        value={formValues.DUI}
                                                        onChange={this.inputChange}
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
                                                        value={formValues.NIT}
                                                        onChange={this.inputChange}
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
                                                        value={formValues.address}
                                                        onChange={this.inputChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer className='border-0'>
                                    <>
                                        <Button variant="primary" className='btn-sm rounded-0' onClick={this.submit}>
                                            Completar registro
                                        </Button>
                                    </>
                                </Modal.Footer>
                            </Modal>
                        </>
                    )
                }
            </>
        );
    }
};