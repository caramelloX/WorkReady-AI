const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' }); // Try to go to login directly or just root
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    
    // click log in
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Log In'));
      if (btn) btn.click();
    });
    
    await page.waitForTimeout(500);
    
    // type credentials
    await page.type('input[placeholder="Enter your username"]', 'student1'); // assuming student1 exists
    await page.type('input[placeholder="Enter your password"]', 'password'); // assuming password
    
    // click submit
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign in'));
      if (btn) btn.click();
    });
    
    await page.waitForTimeout(2000);
    
    const html = await page.evaluate(() => document.body.innerHTML);
    if (html.includes('student-screen-container')) {
      console.log('SUCCESSFULLY NAVIGATED TO STUDENT SCREEN');
    } else {
      console.log('FAILED TO NAVIGATE');
      console.log('CURRENT HTML SNIPPET:', html.substring(0, 500));
    }
    
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
