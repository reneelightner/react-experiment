import { newSpecPage } from '@stencil/core/testing';
import { CustomChart } from '../custom-chart';

describe('custom-chart', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CustomChart],
      html: `<custom-chart></custom-chart>`,
    });
    expect(page.root).toEqualHtml(`
      <custom-chart>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </custom-chart>
    `);
  });
});
