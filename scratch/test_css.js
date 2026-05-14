const { JSDOM } = require('jsdom');

function testCSS() {
    const css = "div { border: 5px solid black; width: 200px; margin: auto; }";
    const html = "<div id='test'>Hello</div>";
    
    const htmlToParse = `<html><head><style>${css}</style></head><body>${html}</body></html>`;
    const dom = new JSDOM(htmlToParse);
    const element = dom.window.document.querySelector('div');
    const style = dom.window.getComputedStyle(element);
    
    console.log("Width:", style.width);
    console.log("Border:", style.border);
    console.log("Margin Left:", style.marginLeft);
    console.log("Margin Right:", style.marginRight);
}

testCSS();
