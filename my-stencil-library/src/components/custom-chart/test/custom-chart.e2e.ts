import { newE2EPage } from '@stencil/core/testing';

describe('custom-chart', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<custom-chart></custom-chart>');

    const element = await page.find('custom-chart');
    expect(element).toHaveClass('hydrated');
  });
});
