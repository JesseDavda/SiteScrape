document.getElementById('request').onclick = () => {
    var url = document.getElementById('url_entry').value;

    axios.post("http://localhost:8080/url", { url:url })
        .then((response) => {
            console.log(response);
        })
        .catch((e) => {
            console.log(e);
        });
};
