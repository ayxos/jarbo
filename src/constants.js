module.exports = {
    getBearer: function(Auth, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('get', '/me');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) callback(xhr.response.user);
        });
        xhr.send();
    }
}