const { processHtmlForWhatsappCtasWithResults, processHtmlForWhatsappCtas } = require('./us01');

function processHtml(html, context = {}) {
  return processHtmlForWhatsappCtas(html, context);
}

function processHtmlWithAudit(html, context = {}) {
  return processHtmlForWhatsappCtasWithResults(html, context);
}

module.exports = { processHtml, processHtmlWithAudit, processHtmlForWhatsappCtas };
