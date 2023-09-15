/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const domain = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:3000'

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `${domain}/api/v1/users/updateMyPassword`
        : `${domain}/api/v1/users/updateMe`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
