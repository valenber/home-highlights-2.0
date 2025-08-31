import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { token_hash, type, next = '/' } = request.query;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: token_hash as string,
    });

    if (!error) {
      // redirect user to specified redirect URL or root of app
      return response.redirect(next as string);
    }
  }

  // redirect the user to an error page with some instructions
  return response.redirect('/error');
}
