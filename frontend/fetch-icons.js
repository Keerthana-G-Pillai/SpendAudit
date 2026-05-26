const https = require('https');

const icons = [
  'openai',
  'anthropic',
  'figma',
  'notion',
  'githubcopilot',
  'googlegemini',
  'cursor'
];

async function fetchSvg(icon) {
  return new Promise((resolve) => {
    https.get(`https://unpkg.com/simple-icons@10.4.0/icons/${icon}.svg`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ icon, svg: data }));
    }).on('error', () => resolve({ icon, svg: null }));
  });
}

async function run() {
  for (const icon of icons) {
    const res = await fetchSvg(icon);
    if (res.svg && res.svg.includes('<svg')) {
      const match = res.svg.match(/<path\s+d="([^"]+)"/);
      if (match) {
        console.log(`'${icon}': '${match[1]}',`);
      } else {
        console.log(`// ${icon}: No path found`);
      }
    } else {
      console.log(`// ${icon}: Failed to fetch`);
    }
  }
}
run();
