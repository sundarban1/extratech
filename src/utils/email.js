import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

/**
 * Render email template.
 *
 * @param {String} filename
 * @param {Object} params
 * @returns {*}
 */
export function render(filename, params) {
  let templateDir = path.resolve(__dirname, '../templates/');
  let encoding = 'utf-8';

  const templateFile = path.join(templateDir, `${filename}.html`);
  const html = fs.readFileSync(templateFile, encoding);
  const template = handlebars.compile(html);

  return template(params);
}
