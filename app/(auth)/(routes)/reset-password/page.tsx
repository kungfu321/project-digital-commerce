'use client';

import { useRouter } from "next/navigation";

import Logo from "@/components/shared/logo";
import ResetPasswordForm from "@/components/shared/reset-password-form";
import { Button } from '@/components/ui/button';

const ResetPasswordPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  }

  return (
    <div>
      <Logo href="/" className="lg:pt-10 lg:pl-10" />
      <div className='max-w-md mx-auto mt-[20%]'>
        <div className='text-center mb-8'>
          <h3>Forgot your password?</h3>
          <p className='text-sm text-muted-foreground font-light'>{`Please enter the email address associated with your account, and we'll email you a link to reset your password.`}</p>
        </div>
        <ResetPasswordForm />
        <div className='text-center mt-4'>
          <Button
            variant="ghost"
            onClick={handleBack}
            className='text-primary'>Back</Button>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage;
