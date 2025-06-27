function createCover() {
    const inputs = document.querySelectorAll(".magazine-cover input");
    const pngLogos = ["Genevieve", "Pop Magazine"]

    let inputValues = {artist:"outtathisworld", artistColor: "#ffffff" ,url:"https://madelaine-petsch.com/albums/userpics/10005/2~7.jpeg", headline:"Tudo sobre sua nova era!", headlineColor: "#ffffff" , logoColor:"#ffffff"};

    inputs.forEach(input => {
        input.addEventListener("input", function() {
            inputValues = {...inputValues,[this.id]:this.value};
            DrawCover(inputValues)
        })
    })

    document.querySelector("#magazine-select").addEventListener("change", function () {
        DrawCover(inputValues);
    });

    DrawCover(inputValues);

    function DrawCover ({artist, artistColor, url, headline, headlineColor, logoColor}) {
        const magazine = document.querySelector("#magazine-select").value;
        console.log(magazine);

        let coverImage = document.querySelector(".mag-cover .mag-cover-img img");
        let logo = document.querySelector(".mag-cover .mag-cover-logo").firstChild;
        let textArtist = document.querySelector(".mag-cover .mag-cover-text .text-artist");
        let textHeadline = document.querySelector(".mag-cover .mag-cover-text .text-headline");
        
        DrawCoverImage(coverImage, url);
        DrawLogo(logo, logoColor, magazine);
        DrawArtist(textArtist, artist, artistColor);
        DrawHeadline(textHeadline, headline, headlineColor);
    };

    function DrawCoverImage(coverImage, url) {
        coverImage.setAttribute("src", url);
    }

    function DrawArtist(textArtist, artist, artistColor) {
        textArtist.innerHTML = artist;
        textArtist.style.color = artistColor;
    }

    function DrawHeadline(textHeadline, headline, headlineColor) {
        textHeadline.innerHTML = headline;
        textHeadline.style.color = headlineColor;
    }

    function DrawLogo(logo, logoColor, magazine) {
        if (pngLogos.includes(magazine)) {
            handlePng(logo, logoColor, magazine);
        } else {
            handleSvg(logo, logoColor, magazine);
        }
    };

    function handlePng(logo, logoColor, magazine) {
        let logoData = "static/imgs/logos/" + magazine.toLowerCase() + ".png";

        let parentDiv = logo.parentNode;
        parentDiv.innerHTML = '';
        parentDiv.parentNode.setAttribute("id", magazine.replace(/\s+/g, '-').toLowerCase());

        let blendWrapper = parentDiv.appendChild(document.createElement("div"));
        blendWrapper.setAttribute("class", "logo-blend-wrapper");

        logo = blendWrapper.appendChild(document.createElement("img"));
        logo.setAttribute("src", logoData);

        console.log(blendWrapper);

        let overlayDiv = blendWrapper.appendChild(document.createElement("div"));
        overlayDiv.setAttribute("class", "color-overlay");
        overlayDiv.style.backgroundColor = logoColor;
    }

    function handleSvg(logo, logoColor, magazine) {
        let logoData = "static/imgs/logos/" + magazine.toLowerCase() + ".svg";

        let parentDiv = logo.parentNode;
        parentDiv.innerHTML = '';
        parentDiv.parentNode.setAttribute("id", magazine.replace(/\s+/g, '-').toLowerCase());

        logo = parentDiv.appendChild(document.createElement("object"));
        logo.setAttribute("type", "image/svg+xml");
        logo.setAttribute("data", logoData);

        logo.style.visibility = 'hidden';

        logo.onload = () => {
            changeLogoColor(logo, logoColor, magazine);
            logo.style.visibility = 'visible';
        };
    }

    function changeLogoColor(logo, logoColor, magazine) {
        let svgDoc = logo.getSVGDocument();
        if (!svgDoc) return;

        let svgElem = svgDoc.querySelector("svg");
        let svgPaths = svgElem.querySelectorAll("path, polygon, polyline, ellipse, line");

        processLogos(svgElem, svgPaths);
        
        svgPaths.forEach(path => {
            path.style.fill = '';
            path.setAttribute("fill", logoColor);
            path.tagName == "line" ? path.setAttribute("stroke", logoColor) : null;
        });
    }

    function processLogos(svgElem, svgPaths){
        svgElem.querySelector("defs") ? svgElem.querySelector("defs").remove() : null;
        svgElem.querySelector("style") ? svgElem.querySelector("style").remove() : null;

        if (!svgElem.getAttribute('viewBox')) {
            let logoWidth = parseFloat(svgElem.getAttribute('width'), 10) + 2;
            let logoHeight = parseFloat(svgElem.getAttribute('height'), 10) + 2;

            if (!logoWidth || !logoHeight) {
                logoWidth = logoHeight = 0;

                if (svgElem.querySelector("g")) {
                    svgElem.querySelectorAll("g").forEach(g => {
                        logoWidth += g.getBBox().width;
                        logoHeight += g.getBBox().height;
                    })
                } else {
                    svgPaths.forEach(path => {
                        logoWidth += path.getBBox().width;
                        logoHeight += path.getBBox().height;
                    })
                }
            }

            svgElem.setAttribute("viewBox", "0 0 "+logoWidth+" "+logoHeight);
        }
    }
}