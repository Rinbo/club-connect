import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

export const action = ({ request, params }: ActionArgs) => {
  return json({});
};
