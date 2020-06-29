let document_file_name = window.viewerData.itemJson[1];
let document_API = window.viewerData.itemJson[9];
let base_url = "https://drive.google.com/viewerng/";

let jspdf = document.createElement("script");
jspdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js';
document.body.appendChild(jspdf);

let get_api_urls = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => {
            return response.text().then(
                text=> {
                    return resolve(JSON.parse(text.slice(5)));
                }
            )
        }).catch(response => {
            return reject(response.status);
        });
    });
}

let get_meta = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                return response.text().then(
                    text => {
                        return resolve(JSON.parse(text.slice(5)));
                    }
                );
            }).catch(response => {
                return reject(response.status);
            });
    })
}

let get_img_urls = (meta, url) => {
    return new Promise((resolve) => {
        let img_urls = []
        for (i = 0; i < meta.pages; i++) {
            let params = {
                "page": i,
                "skiphighlight": true,
                "w": meta.maxPageWidth
            }

            img_urls.push(base_url + url + '&' + Object.entries(params).map((e) => `${e[0]}=${e[1]}`).join('&'));
        }
        return resolve(img_urls);
    })
}

let fetch_img = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                return response.blob().then(
                    blob => {
                        let file = new Blob([blob], {type: 'image/png'});
                        let fileReader  = new FileReader();
                        fileReader.onload = function () {
                            let img = new Image(); 
                            let width, height;
                            img.onload = function () {
                                width = img.naturalWidth;
                                height = img.naturalHeight;
                                return resolve([img.src, width, height]);
                            }
                            img.src = fileReader.result;
                        }
                        fileReader.readAsDataURL(file);
                    }
                )
            }).catch(response => {
                return reject(response.status);
            });
    })
}

let convert_data_urls = (urls) => {
    return new Promise((resolve) => {
        data_urls = [];
        c = 0;

        urls.forEach((url, index, array) => {
            fetch_img(url).then((value) => {
                data_urls.push({
                    page: index,
                    data: value[0],
                    width: value[1],
                    height: value[2]})
                c++;
                console.log("Downloaded page: " + index)

                if (c === array.length) return resolve(data_urls);
            })
        })
    })
}

let generate_pdf = (data_urls) => {
    return new Promise((resolve) => {
        let doc;
        data_urls.forEach((value, index, array) => {
            console.log("Generate pdf: page: "+index+ " width: "+value.width+" height: "+value.height);
            let orientation;
            if (value.width > value.height) orientation = "l";
            else orientation = "p";
            
            let scalefactor = 1.335;
            let pageWidth = value.width * scalefactor;
            let pageHeight = value.height * scalefactor;

            if (index === 0) {
                doc = new jsPDF(orientation, "px", [pageWidth, pageHeight]);
                doc.addImage(value.data, "PNG", 0, 0, value.width, value.height, "", "MEDIUM", 0);
            } else if (index > 1) {
                doc.addPage([pageWidth, pageHeight], orientation);
                doc.addImage(value.data, "PNG", 0, 0, value.width, value.height, "", "MEDIUM", 0);
            }

            if (index === array.length - 1) return resolve(doc);
        })
    })
}

jspdf.onload = () => {
    get_api_urls(document_API).then(api_urls => {
        get_meta(base_url + api_urls.meta).then(meta => {
            console.log("Target file: " + document_file_name+" "+ meta.pages+ "page")
            get_img_urls(meta, api_urls.img).then(img_urls => {
                convert_data_urls(img_urls).then(data_urls => {
                    data_urls.sort(function(a,b){
                        if(a.page < b.page) return -1;
                        if(a.page > b.page) return 1;
                        return 0;
                    });
                    generate_pdf(data_urls).then(doc => {
                        doc.save(document_file_name);
                    })
                })
            })
        })
    })
}