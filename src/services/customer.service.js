import { request } from '../common/http-common';

export const actionGetAll = async (page, limit) => {
    const response = await request.get('customers');

    return response.data;
};

export const actionCreate = async (customer) => {
    const response = await request.post('customer/', customer);

    return response.data;
};

export const actionGetOne = async (id) => {
    const response = await request.get(`customer/${id}`);

    return response.data;
};

export const actionSearchBy = async (email) => {
    const response = await request.get(`customer/search?email=${email}`);

    return response.data;
};

export const actionUpdate = async (id, customer) => {
    const response = await request.put(`customer/${id}`, customer);

    return response.data;
};

export const actionShiftStatus = async (id) => {
    const response = await request.patch(`customer/${id}`);

    return response.data;
};