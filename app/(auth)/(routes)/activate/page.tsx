import Logo from "@/components/shared/logo";
import ConfirmEmailForm from '@/components/shared/confirm-email-form';

const ActivatePage = () => {
  return (
    <div>
      <Logo href="/" className="lg:pt-10 lg:pl-10" />
      <div className='max-w-md mx-auto mt-[20%]'>
        <div className='text-center mb-8'>
          <h3>Confirm email address</h3>
          <p className='text-sm text-muted-foreground font-light'>{`We've sent a 6-digit confirmation email to your email. Please enter the code in below box to verify your email.`}</p>
        </div>
        <ConfirmEmailForm />
      </div>
    </div>
  )
}

export default ActivatePage;
