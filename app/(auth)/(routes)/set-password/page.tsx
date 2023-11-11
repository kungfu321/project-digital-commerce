'use client';

import Image from 'next/image';

import Logo from "@/components/shared/logo";
import { Button } from '@/components/ui/button';
import SetPasswordForm from '@/components/shared/set-password-form';

const SetPasswordPage = () => {
  const handleResendCode = () => {
  }

  return (
    <div>
      <Logo href="/" className="lg:pt-10 lg:pl-10" />
      <div className='max-w-md mx-auto mt-[20%]'>
        <div className='flex justify-center'>
          <Image src="/icons/email-sent.svg" alt='email sent' width={103} height={120} />
        </div>
        <div className='text-center mb-8'>
          <h3>Request sent successfully!</h3>
          <p className='text-sm text-muted-foreground font-light'>{`We've sent a 6-digit confirmation email to your email. Please enter the code in below box to verify your email.`}</p>
        </div>
        <SetPasswordForm />
        <div className='text-center mt-4'>
          <Button
            variant="ghost"
            onClick={handleResendCode}
            className='text-primary'>Resend code</Button>
        </div>
      </div>
    </div>
  )
}

export default SetPasswordPage;
