function createCover() {
    const inputs = document.querySelectorAll(".magazine-cover input");
    const pngLogos = ["genevieve", "pop-magazine", "v", "intouch", "eres"];
    const fixedColorLogos = ["ok", "us-weekly", "the-sun", "caras", "contigo"];
    const gossipMagazines = ["ok", "the-sun", "teen-people", "atrevida", "us-weekly", "intouch"];

    let inputValues = {
        artist: "outtathisworld",
        artistColor: "#ffffff",
        url: "https://madelaine-petsch.com/albums/userpics/10005/008~66.jpg",
        headline: "The Powerful Version 9 Issue",
        headlineColor: "#ffffff",
        logoColor: "#ffffff",
        issueMonth: "2025-09",
    };

    inputs.forEach((input) => {
        input.addEventListener("input", function () {
            inputValues = { ...inputValues, [this.id]: this.value };
            DrawCover(inputValues);
        });
    });

    document.querySelector("#magazine-select").addEventListener("change", function () {
        DrawCover(inputValues);
    });

    DrawCover(inputValues);

    function DrawCover({ artist, artistColor, url, headline, headlineColor, logoColor, issueMonth }) {
        const magazine = document.querySelector("#magazine-select").value;
        console.log(magazine);

        let coverImage = document.querySelector(".mag-cover .mag-cover-img img");
        let logo = document.querySelector(".mag-cover .mag-cover-logo").firstChild;
        let textArtist = document.querySelector(".mag-cover .mag-cover-text .text-artist");
        let textHeadline = document.querySelector(".mag-cover .mag-cover-text .text-headline");

        DrawCoverImage(coverImage, url);
        DrawLogo(logo, logoColor, magazine, issueMonth);
        DrawArtist(textArtist, artist, artistColor);
        DrawHeadline(textHeadline, headline, headlineColor);
    }

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

    function DrawLogo(logo, logoColor, magazine, issueMonth) {
        if (pngLogos.includes(magazine)) {
            handlePng(logo, logoColor, magazine, issueMonth);
        } else {
            handleSvg(logo, logoColor, magazine, issueMonth);
        }
    }

    function handlePng(logo, logoColor, magazine, issueMonth) {
        let logoData = "static/imgs/logos/" + magazine + ".png";

        let parentDiv = logo.parentNode;
        parentDiv.innerHTML = "";
        parentDiv.parentNode.setAttribute("id", magazine);

        let blendWrapper = parentDiv.appendChild(document.createElement("div"));
        blendWrapper.setAttribute("class", "logo-blend-wrapper");

        logo = blendWrapper.appendChild(document.createElement("img"));
        logo.setAttribute("src", logoData);

        console.log(blendWrapper);

        let overlayDiv = blendWrapper.appendChild(document.createElement("div"));
        overlayDiv.setAttribute("class", "color-overlay");
        overlayDiv.style.backgroundColor = logoColor;
        let issueMonthSpan = parentDiv.appendChild(document.createElement("span"));
        issueMonthSpan.innerHTML = new Date(issueMonth + "-02").toLocaleDateString("en-US", { year: "numeric", month: "long" });
    }

    function handleSvg(logo, logoColor, magazine, issueMonth) {
        let logoData = "static/imgs/logos/" + magazine + ".svg";

        let parentDiv = logo.parentNode;
        parentDiv.innerHTML = "";
        parentDiv.parentNode.setAttribute("id", magazine);

        logo = parentDiv.appendChild(document.createElement("object"));
        logo.setAttribute("type", "image/svg+xml");
        logo.setAttribute("data", logoData);

        logo.style.visibility = "hidden";

        logo.onload = () => {
            changeLogoColor(logo, logoColor, magazine);
            logo.style.visibility = "visible";
            let issueMonthSpan = parentDiv.appendChild(document.createElement("span"));
            issueMonthSpan.innerHTML = new Date(issueMonth + "-02").toLocaleDateString("en-US", { year: "numeric", month: "long" });
        };
    }

    function changeLogoColor(logo, logoColor, magazine) {
        let svgDoc = logo.getSVGDocument();
        if (!svgDoc) return;

        let svgElem = svgDoc.querySelector("svg");
        let svgPaths = svgElem.querySelectorAll("path, polygon, polyline, ellipse, line");

        processLogos(svgElem, svgPaths, magazine);

        svgPaths.forEach((path) => {
            if (!fixedColorLogos.includes(magazine)) {
                if (!path.classList.contains("no-color")) {
                    path.style.fill = "";
                    path.setAttribute("fill", logoColor);
                    path.tagName == "line" ? path.setAttribute("stroke", logoColor) : null;
                    magazine == "w" ? ((path.style.stroke = "white"), (path.style.strokeWidth = "14"), (path.style.paintOrder = "stroke")) : null;
                }
            }
        });
    }

    function processLogos(svgElem, svgPaths, magazine) {
        !fixedColorLogos.includes(magazine) ? (svgElem.querySelector("defs") ? svgElem.querySelector("defs").remove() : null) : null;
        !fixedColorLogos.includes(magazine) ? (svgElem.querySelector("style") ? svgElem.querySelector("style").remove() : null) : null;
        !fixedColorLogos.includes(magazine) ? (svgElem.querySelector("rect") ? svgElem.querySelector("rect").remove() : null) : null;

        if (!svgElem.getAttribute("viewBox")) {
            let logoWidth = parseFloat(svgElem.getAttribute("width"), 10) + 2;
            let logoHeight = parseFloat(svgElem.getAttribute("height"), 10) + 2;

            if (!logoWidth || !logoHeight) {
                logoWidth = logoHeight = 0;

                if (svgElem.querySelector("g")) {
                    svgElem.querySelectorAll("g").forEach((g) => {
                        logoWidth += g.getBBox().width;
                        logoHeight += g.getBBox().height;
                    });
                } else {
                    svgPaths.forEach((path) => {
                        logoWidth += path.getBBox().width;
                        logoHeight += path.getBBox().height;
                    });
                }
            }

            svgElem.setAttribute("viewBox", "0 0 " + logoWidth + " " + logoHeight);
        }
    }
}
