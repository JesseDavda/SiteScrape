document.getElementById('request').onclick = () => {
    var url = document.getElementById('url_entry').value;
    document.getElementById('out').style.display = "flex";
    document.getElementById('text').style.display = "none";
    document.getElementById('loading').style.display = "block";

    axios.post("http://localhost:8080/url", { url:url })
        .then((response) => {
            document.getElementById('loading').style.display = "none";
            document.getElementById('text').style.display = "block";

            document.getElementById('url_out').innerHTML = "This is a breakdown for: " + url;
            document.getElementById('title').innerHTML = "Title: " + response.data.title;
            document.getElementById('links').innerHTML = "Number of links on the site: " + response.data.links;
            document.getElementById('unique_links').innerHTML = "Number of unique links on the site: " + response.data.unique_links;
            document.getElementById('googleAnalytics').innerHTML = "The page has google analytics: " + response.data.hasAnalytics;
            document.getElementById('connSecure').innerHTML = "Is the connection secure?: " + response.data.connectionSecure;
            document.getElementById('connEnc').innerHTML = "Is the connection encrypted?: " + response.data.connectionEncrypted;
            document.getElementById('socSecure').innerHTML = "Is the socket secure?: " + response.data.socketSecure;
            document.getElementById('socEnc').innerHTML = "Is the socket encrypted?: " + response.data.socketEncrypted;
        })
        .catch((e) => {
            console.log(e);
        });
};
