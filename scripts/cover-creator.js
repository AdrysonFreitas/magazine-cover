function createCover() {
        let canvas = document.getElementById("mag-cover");
        const inputs = document.querySelectorAll(".magazine-cover input");
        const pngLogos = ["Clash", "Dork", "ERES", "Flaunt", "Gay Times", "Genevieve", "High Cut", "Paper", "Pop Magazine", "Vanguard Allure", "Weekly Young"]

        let inputValues = {artist:"outtathisworld", url:"https://madelaine-petsch.com/albums/userpics/10005/2~7.jpeg", headline:"Tudo sobre sua nova era!", logoColor:"#ffffff"};

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

        function DrawCover ({artist, url, headline, logoColor}) {
            const magazine = document.querySelector("#magazine-select").value;
            console.log(magazine);
            if (canvas.getContext) {

                //let pxRatio = window.devicePixelRatio;
                let ctx = canvas.getContext("2d");
                canvas.width = 500;
                canvas.height = 620;
                canvas.style.width = 500 + "px";
                canvas.style.height = 625 + "px";

                let img = new Image();
                //img.crossOrigin = "anonymous";
                img.onload = function () {
                    let ratio = img.width / img.height;
                    let newHeight = canvas.width / ratio;
                    let newWidth = canvas.width;
                    if (newHeight < canvas.height) {
                        newHeight = canvas.height;
                        newWidth = newHeight * ratio;
                    }
                    let xOffset = newWidth > canvas.width ? ((canvas.width - newWidth) / 2) : 0;

                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(img, xOffset, 0, newWidth, newHeight);

                    let logo = new Image();
                    logo.onload = function () {
                        let logoRatio = logo.width / logo.height;
                        console.log(logoRatio);
                        let logoWidth = canvas.width - 40;
                        let logoHeight = logoWidth / logoRatio;

                        let offCanvas = document.createElement("canvas");
                        offCanvas.width = canvas.width;
                        offCanvas.height = canvas.height;
                        let offCtx = offCanvas.getContext("2d");

                        offCtx.fillStyle = logoColor;
                        offCtx.fillRect(20, 20, logoWidth, logoHeight);
                        offCtx.globalCompositeOperation = "destination-in";
                        offCtx.drawImage(logo, 20, 20, logoWidth, logoHeight);

                        ctx.drawImage(offCanvas, 0, 0);

                        ctx.font = `bold 40px Satoshi-Variable`;
                        ctx.fillStyle = "#fff";
                        ctx.fillText(artist, 40, 505);
                        ctx.font = `20px Satoshi-Variable`;
                        ctx.fillStyle = "#fff";
                        ctx.fillText(headline, 40, 530);
                    };
                    let logoFormat = pngLogos.includes(magazine) ? ".png" : ".svg"
                    logo.src = "static/imgs/logos/" + magazine.toLowerCase() + logoFormat;
                };
                img.src = url;
            }
        }
}