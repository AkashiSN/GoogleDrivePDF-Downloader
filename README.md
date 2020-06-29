# GoogleDrivePDF-Downloader

This script will help you to download protected view only PDF files from Google Drive easily.

## Support browser

- Chrome
- Firefox

## How to use

1. Open the script `pdf_downloader.js` and copy all the contents.
2. Then open the browser web console.
3. Paste the copied script into the console and press enter.
6. After few seconds the browser will prompt you to save a file.


## Other use

1. Create bookmark below.

```javascript
javascript:var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(b){return b.raw=b};$jscomp.createTemplateTagFirstArgWithRaw=function(b,d){b.raw=d;return b};var document_file_name=window.viewerData.itemJson[1],document_API=window.viewerData.itemJson[9],base_url="https://drive.google.com/viewerng/",jspdf=document.createElement("script");jspdf.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js";document.body.appendChild(jspdf);var get_api_urls=function(b){return new Promise(function(d,e){fetch(b).then(function(a){return a.text().then(function(a){return d(JSON.parse(a.slice(5)))})})["catch"](function(a){return e(a.status)})})},get_meta=function(b){return new Promise(function(d,e){fetch(b).then(function(a){return a.text().then(function(a){return d(JSON.parse(a.slice(5)))})})["catch"](function(a){return e(a.status)})})},get_img_urls=function(b,d){return new Promise(function(e){var a=[];for(i=0;i<b.pages;i++)a.push(base_url+d+"&"+Object.entries({page:i,skiphighlight:!0,w:b.maxPageWidth}).map(function(a){return a[0]+"="+a[1]}).join("&"));return e(a)})},fetch_img=function(b){return new Promise(function(d,e){fetch(b).then(function(a){return a.blob().then(function(a){a=new Blob([a],{type:"image/png"});var b=new FileReader;b.onload=function(){var a=new Image,e,f;a.onload=function(){e=a.naturalWidth;f=a.naturalHeight;return d([a.src,e,f])};a.src=b.result};b.readAsDataURL(a)})})["catch"](function(a){return e(a.status)})})},convert_data_urls=function(b){return new Promise(function(d){data_urls=[];c=0;b.forEach(function(b,a,f){fetch_img(b).then(function(b){data_urls.push({page:a,data:b[0],width:b[1],height:b[2]});c++;console.log("Downloaded page: "+a);if(c===f.length)return d(data_urls)})})})},generate_pdf=function(b){return new Promise(function(d){var e;b.forEach(function(a,b,k){console.log("Generate pdf: page: "+b+" width: "+a.width+" height: "+a.height);var f=a.width>a.height?"l":"p";var g=1.335*a.width,h=1.335*a.height;0===b?(e=new jsPDF(f,"px",[g,h]),e.addImage(a.data,"PNG",0,0,a.width,a.height,"","MEDIUM",0)):1<b&&(e.addPage([g,h],f),e.addImage(a.data,"PNG",0,0,a.width,a.height,"","MEDIUM",0));if(b===k.length-1)return d(e)})})};jspdf.onload=function(){get_api_urls(document_API).then(function(b){get_meta(base_url+b.meta).then(function(d){console.log("Target file: "+document_file_name+" "+d.pages+"page");get_img_urls(d,b.img).then(function(b){convert_data_urls(b).then(function(a){a.sort(function(a,b){return a.page<b.page?-1:a.page>b.page?1:0});generate_pdf(a).then(function(a){a.save(document_file_name)})})})})})};
```

2. Open tab and execute bookmarklet.