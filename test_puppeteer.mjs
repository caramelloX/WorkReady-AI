import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    
    // click log in
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Log In'));
      if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 500));
    
    // type credentials
    await page.type('input[placeholder="Enter your username"]', 'student1'); 
    await page.type('input[placeholder="Enter your password"]', 'password'); 
    
    // click submit
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign in'));
      if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    const html = await page.evaluate(() => document.body.innerHTML);
    if (html.includes('student-screen-container')) {
      console.log('SUCCESSFULLY NAVIGATED TO STUDENT SCREEN');
    } else {
      console.log('FAILED TO NAVIGATE');
    }
    
    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
