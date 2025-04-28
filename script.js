let skins = [];
let boxes = [];
let selectedBox = null;

fetch('skins.json')
  .then(res => res.json())
  .then(data => skins = data)
  .catch(() => alert("Erro ao carregar skins."));

fetch('boxes.json')
  .then(res => res.json())
  .then(data => {
    boxes = data;
    const select = document.getElementById('box-select');
    boxes.forEach((box, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${box.name} - $${box.price.toFixed(2)}`;
      select.appendChild(option);
    });
    selectedBox = boxes[0];
  })
  .catch(() => alert("Erro ao carregar caixas."));

document.getElementById('box-select').addEventListener('change', (e) => {
  selectedBox = boxes[e.target.value];
});

function openBox() {
  if (!skins.length || !selectedBox) {
    alert("Carregando dados...");
    return;
  }

  const amount = parseInt(document.getElementById('amount-select').value);
  const rouletteArea = document.getElementById('roulette-area');
  rouletteArea.innerHTML = '';
  document.getElementById('result').innerHTML = '';

  for (let i = 0; i < amount; i++) {
    const container = document.createElement('div');
    container.className = 'roulette-container';
    const track = document.createElement('div');
    track.className = 'roulette-track';
    container.appendChild(track);

    const marker = document.createElement('div');
    marker.className = 'roulette-marker';
    container.appendChild(marker);

    rouletteArea.appendChild(container);

    const filteredSkins = skins.filter(skin => selectedBox.rarities.includes(skin.rarity));
    if (filteredSkins.length === 0) {
      alert("Nenhuma skin disponível para esta caixa.");
      return;
    }

    const totalChance = filteredSkins.reduce((acc, s) => acc + s.chance, 0);
    let roll = Math.random() * totalChance;
    let chosen;

    for (let skin of filteredSkins) {
      if (roll < skin.chance) {
        chosen = skin;
        break;
      }
      roll -= skin.chance;
    }

    if (!chosen) chosen = filteredSkins[Math.floor(Math.random() * filteredSkins.length)];

    let pool = [];
    for (let j = 0; j < 40; j++) {
      const random = filteredSkins[Math.floor(Math.random() * filteredSkins.length)];
      pool.push(random);
    }
    pool[pool.length - 5] = chosen;

    pool.forEach((skin) => {
      const div = document.createElement('div');
      div.className = 'skin-box';
      div.innerHTML = `
        <img src="${skin.image}" alt="${skin.name}">
        <p>${skin.name}</p>
      `;
      track.appendChild(div);
    });

    const skinWidth = 120;
    const targetIndex = pool.length - 5;
    const scrollAmount = (targetIndex * (skinWidth + 10)) - 240;

    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    void track.offsetWidth;
    setTimeout(() => {
      track.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      track.style.transform = `translateX(-${scrollAmount}px)`;
    }, 100);

    setTimeout(() => {
      const resultDiv = document.getElementById('result');
      const msg = `
        🎉 Você ganhou: <strong>${chosen.name}</strong> (${chosen.rarity})<br>
        💵 Valor de mercado: <strong>$${chosen.price.toFixed(2)}</strong><br><br>
      `;
      resultDiv.innerHTML += msg;
    }, 4000);
  }
}
``
