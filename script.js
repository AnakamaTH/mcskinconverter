const gifs = [
  "https://pa1.aminoapps.com/5845/5749d2581b8ff83d442fbee9935fcbc5f0715067_hq.gif",
  "https://pa1.aminoapps.com/5845/9cb2168430d3538abdda1ce6676bf3c37f517369_hq.gif",
  "https://pa1.aminoapps.com/5845/d6890eeb58a89ef075cdfbe7b940b231bec61a49_hq.gif",
  "https://pa1.aminoapps.com/5845/32c70e035bc4ac6802178e43be9066e445095bed_hq.gif",
  "https://i.pinimg.com/originals/e5/a1/7e/e5a17eb79c5472b5fea8ab36282f3696.gif",
  "https://pa1.aminoapps.com/5845/aa86445c253d52c324bfa0ce378bb049253e7f01_hq.gif",
  "https://pa1.aminoapps.com/5845/3e279f21d4b8e146c8076013eb93613d441d1c4b_hq.gif",
  "https://i.pinimg.com/originals/99/f4/36/99f43636e89075b308a720bff365b132.gif",
  "https://i.redd.it/r152bcq4zhv51.gif",
  "https://i.gifer.com/1toU.gif"
];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

if (!sessionStorage.getItem('gifQueue') || JSON.parse(sessionStorage.getItem('gifQueue')).length === 0) {
  sessionStorage.setItem('gifQueue', JSON.stringify(shuffleArray([...gifs])));
}

const gifQueue = JSON.parse(sessionStorage.getItem('gifQueue'));
const nextGif = gifQueue.shift();
sessionStorage.setItem('gifQueue', JSON.stringify(gifQueue));
document.querySelector(".overlay").style.backgroundImage = `url('${nextGif}')`;

document.getElementById('convertBtn').addEventListener('click', () => {
  const input = document.getElementById('skinInput');
  const status = document.getElementById('status');
  const result = document.getElementById('result');

  if (!input.files || input.files.length === 0) {
    status.textContent = "Please select a skin.";
    status.className = "";
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      if (img.width !== 64 || img.height !== 32) {
        status.textContent = "Skin must be 64x32!";
        status.className = "";
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      // Start with transparent canvas
      ctx.clearRect(0, 0, 64, 64);

      // Copy original skin
      ctx.drawImage(img, 0, 0);

      // === Add left leg (copy right leg) ===
      ctx.drawImage(canvas, 4, 16, 4, 4, 20, 48, 4, 4);  // Top
      ctx.drawImage(canvas, 8, 16, 4, 4, 24, 48, 4, 4);  // Bottom
      ctx.drawImage(canvas, 0, 20, 4, 12, 20, 52, 4, 12); // Outer
      ctx.drawImage(canvas, 4, 20, 4, 12, 24, 52, 4, 12); // Front
      ctx.drawImage(canvas, 8, 20, 4, 12, 28, 52, 4, 12); // Inner
      ctx.drawImage(canvas,12, 20, 4, 12, 16, 52, 4, 12); // Back

      // === Add left arm (copy right arm) ===
      ctx.drawImage(canvas, 44, 16, 4, 4, 36, 48, 4, 4);  // Top
      ctx.drawImage(canvas, 48, 16, 4, 4, 40, 48, 4, 4);  // Bottom
      ctx.drawImage(canvas, 40, 20, 4, 12, 36, 52, 4, 12); // Outer
      ctx.drawImage(canvas, 44, 20, 4, 12, 40, 52, 4, 12); // Front
      ctx.drawImage(canvas, 48, 20, 4, 12, 44, 52, 4, 12); // Inner
      ctx.drawImage(canvas, 52, 20, 4, 12, 32, 52, 4, 12); // Back

      const outImg = new Image();
      outImg.src = canvas.toDataURL("image/png");

      result.innerHTML = '';
      result.appendChild(outImg);

      const link = document.createElement("a");
      link.href = outImg.src;
      link.download = "converted_skin.png";
      link.textContent = "Download Converted Skin";
      link.style.display = "block";
      link.style.marginTop = "10px";
      result.appendChild(link);

      status.textContent = "Conversion complete!";
      status.className = "success";
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
