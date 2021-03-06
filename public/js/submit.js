import axios from 'axios';

export const filterText = (htmlText, pClass) => {
    let result;
    result = htmlText.replaceAll('<p>', `<p class="${pClass}">`);
    return result;
}

export const createNew = async (type, data, loadPage) => {
    try {
        const hostname = "" || location.hostname;
        const res = await axios({
            method: 'POST',
            url: `http://${hostname}/api/${type}/`, 
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
}

export const updateCurrentData = async (type, data, loadPage, id) => {
    try {
        const hostname = "" || location.hostname;
        const res = await axios({
            method: 'PATCH',
            url: `http://${hostname}/api/${type}/${id}`, 
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
}

export const deleteCurrentData = async (type, id) => {
    try {
        const hostname = "" || location.hostname;
        const res = await axios({
            method: 'DELETE',
            url: `http://${hostname}/api/${type}/${id}`,    
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
}