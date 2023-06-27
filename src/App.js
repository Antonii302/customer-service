import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';

import Create from './components/create.component';
import Customer from './components/customer.component';

import { actionGetAll, actionSearchBy } from './services/customer.service';

import React, { Component } from 'react';

import { toast, ToastContainer } from "react-toastify";
import NProgress from "nprogress";

import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';

import './App.css';

import 'bootstrap/dist/js/bootstrap';

class App extends Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);

    this.retrieveCustomers = this.retrieveCustomers.bind(this);
    this.state = {
      customers: [],
      email: '',
      isPageReady: false,
      currentPage: 1,
      itemsPerPage: 2
    }

    this.paginate = this.paginate.bind(this);
    this.updateEmail = this.updateEmail.bind(this);

    this.input = React.createRef();
  }

  componentDidMount() {
    this.retrieveCustomers();
  }

  search() {
    NProgress.start();

    actionSearchBy(this.state.email).then(response => {
      this.setState({
        customers: response.data
      });

      this.setState({
        currentPage: 1
      });
    }).catch(error => {
      toast(error.message, {
        type: 'error',
        position: 'bottom-right'
      });
    }).finally(() => NProgress.done());;
  }

  onChangeSearch(e) {
    const email = e.target.value;

    this.setState({
      email: email
    }, () => {
      this.input.current.focus();
    });
  }

  retrieveCustomers() {
    NProgress.start();

    actionGetAll().then(response => {
      this.setState({
        customers: response.data
      });
    }).catch(error => {
      toast(error.message, {
        type: 'error',
        position: 'bottom-right'
      });
    }).finally(() => {
      NProgress.done();

      this.setState({
        isPageReady: true
      });
    });
  }

  paginate(pageNumber) {
    this.setState({
      currentPage: pageNumber
    });
  }

  updateEmail() {
    this.setState({
      email: ''
    });
  }

  render() {
    const AuthenticatedContent = () => {
      const { isAuthenticated, logout, user } = useAuth0();

      const {
        customers,
        email,
        isPageReady,
        currentPage,
        itemsPerPage
      } = this.state;

      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;

      const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem)

      if (isPageReady) {
        return (
          <>
            <nav className='navbar navbar-expand navbar-light bg-light p-2'>
              <a href='/' className='navbar-brand'>
                <img src='./logo512.png' alt='Logotipo de la aplicación' width={52} height={52} />
              </a>

              <ul className='navbar-nav ms-auto'>
                <li className='nav-item dropdown'>
                  <a href='#' className='nav-link dropdown-toggle' id='navbarDropdown' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                    <i className='fas fa-user-circle'></i>
                    <span className='d-none d-sm-inline-block font-weight-light ms-1'>Mi cuenta</span>
                  </a>
                  <ul className='dropdown-menu dropdown-menu-end' style={{ minWidth: 250 + 'px' }} aria-labelledby='navbarDropdown'>
                    <li>
                      <button type='button' className='dropdown-item' onClick={() => logout()}>
                        <i className='fas fa-sign-out-alt'></i> Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>

            <div className='p-3'>
              <Create
                retrieveCustomers={this.retrieveCustomers}
                updateEmail={this.updateEmail} />

              <div className='input-group' style={{ marginBottom: 18 + 'px' }}>
                <button
                  className='btn btn-light'
                  type='button'
                  id='search-addon'
                  onClick={this.search}
                >
                  <i className='fas fa-search'></i>
                </button>
                <input
                  type='text'
                  className='form-control form-control-sm rounded-0'
                  placeholder='Buscar...'
                  aria-label='Caja de búsqueda'
                  aria-describedby='search-addon'
                  ref={this.input}
                  value={email}
                  onChange={this.onChangeSearch}
                />
              </div>
              {
                (() => {
                  if (customers.every((customer) => !customer)) {
                    return (
                      <>
                        <div className='alert alert-danger'>
                          <p className='fs-5'>¡Lo sentimos!</p>
                          <p className='fs-6'>No hemos encontrado registro alguno.</p>
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <p className='fs-5 fw-bold text-primary mb-1'>Lista de registros</p>
                        <p className='fs-6 text-secondary mb-4'>{customers.length} registros</p>

                        <div className='container-fluid'>
                          <div className='row bg-light d-none d-sm-flex p-2'>
                            <div className='col-sm-4 col-md-3'>
                              <p className='fs-6 text-secondary'>
                                Correo electrónico
                              </p>
                            </div>
                            <div className='d-none d-md-block col-md-3'>
                              <p className='fs-6 text-secondary'>
                                Nombre completo
                              </p>
                            </div>
                            <div className='col-sm-3 col-md-2'>
                              <p className='fs-6 text-secondary'>
                                ¿Está activo?
                              </p>
                            </div>
                            <div className='col-sm-3'>
                              <p className='fs-6 text-secondary'>
                                Fecha de edición
                              </p>
                            </div>
                            <div className='col'></div>
                          </div>
                        </div>
                        {
                          currentCustomers.map((customer) => (
                            <Customer
                              key={customer.id}
                              customer={customer}
                              retrieveCustomers={this.retrieveCustomers} />
                          ))
                        }
                        <div className='d-flex justify-content-center mt-4'>
                          <nav>
                            <ul className='pagination'>
                              {
                                Array.from(Array(Math.ceil(customers.length / itemsPerPage)).keys()).map((pageNumber) => (
                                  <>
                                    <li
                                      key={pageNumber}
                                      className={`page-item${currentPage === pageNumber + 1 ? ' active' : ''}`}
                                    >
                                      <button
                                        type='button'
                                        className='page-link'
                                        onClick={() => this.paginate(pageNumber + 1)}
                                      >
                                        {pageNumber + 1}
                                      </button>
                                    </li>
                                  </>

                                ))
                              }
                            </ul>
                          </nav>
                        </div>
                      </>
                    );
                  }
                })()
              }
            </div>
          </>
        );
      }
    }

    return (
      <>
        <AuthenticatedContent />

        <ToastContainer />
      </>
    );
  }
};

export default withAuthenticationRequired(App);
