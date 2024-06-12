import axios from 'axios';

export const filterText = (htmlText, pClass) => {
  let result;
  result = htmlText.replaceAll('<p>', `<p class="${pClass}">`);
  return result;
};

export const createNew = async (type, data, loadPage) => {
  try {
    let hostname;
    if (process.env.NODE_ENV === 'development')
      hostname = 'http://localhost:3000';

    if (process.env.NODE_ENV === 'production')
      hostname = `https://${location.hostname}`;

    const res = await axios({
      method: 'POST',
      url: `${hostname}/api/${type}/`,
      data: data,
    });

    if (res.data.status === 'success') {
      alert(`Added New ${type.toUpperCase()} Successfully`);
      window.setTimeout(() => {
        location.assign(`/${loadPage}`);
      }, 1000);
    }
  } catch (err) {
    alert(err.response.data.message);
    console.log(err.response);
  }
};

export const updateCurrentData = async (type, data, loadPage, id) => {
  try {
    let hostname;
    if (process.env.NODE_ENV === 'development')
      hostname = 'http://localhost:3000';

    if (process.env.NODE_ENV === 'production')
      hostname = `https://${location.hostname}`;

    const res = await axios({
      method: 'PATCH',
      url: `${hostname}/api/${type}/${id}`,
      data: data,
    });

    if (res.data.status === 'success') {
      alert(`Update ${type.toUpperCase()} Successfully`);
      window.setTimeout(() => {
        location.assign(`/${loadPage}`);
      }, 1000);
    }
  } catch (err) {
    alert(err.response.data.message);
    console.log(err.response);
  }
};

export const deleteCurrentData = async (type, id) => {
  try {
    let hostname;
    if (process.env.NODE_ENV === 'development')
      hostname = 'http://localhost:3000';

    if (process.env.NODE_ENV === 'production')
      hostname = `https://${location.hostname}`;

    const res = await axios({
      method: 'DELETE',
      url: `${hostname}/api/${type}/${id}`,
    });

    if (res.status === 204) {
      alert(`Delete ${type.toUpperCase()} Successfully`);
      // location.reload(true);
      window.setTimeout(() => {
        location.assign(`/`);
      }, 1000);
    }
  } catch (err) {
    alert(err.response.data.message);
    console.log(err.response);
  }
};
