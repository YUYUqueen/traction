import type { APIRoute } from 'astro';
import { generatePlaybook } from '../../lib/playbook';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { productDescription, productType, targetAudience } = body;

    if (!productDescription || typeof productDescription !== 'string') {
      return new Response(JSON.stringify({ error: 'productDescription is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (productDescription.length > 2000) {
      return new Response(JSON.stringify({ error: 'productDescription too long (max 2000 chars)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const playbook = await generatePlaybook({
      productDescription,
      productType,
      targetAudience,
    });

    return new Response(JSON.stringify(playbook), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Playbook generation failed:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate playbook. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
