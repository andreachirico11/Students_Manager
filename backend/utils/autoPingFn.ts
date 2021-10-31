import * as http from 'http';

export default function checkForAutoPing() {
  if (process.env.AUTO_PING_URL) {
    console.log('autoping is ON');
    const [autoPingUrl, autoPingtime] = process.env.AUTO_PING_URL.split(',');
    setInterval(() => {
      http.get(autoPingUrl, (res) => {
        console.log('PING');
      });
    }, Number(autoPingtime));
  }
}
