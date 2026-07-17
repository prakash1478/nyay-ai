import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import useAuth from '../../hooks/useAuth.js'
import { emailPattern } from '../../utils/validators.js'
import { ROUTES } from '../../utils/constants.js'

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      await resetPassword(data.email)
      setSent(true)
    } catch (err) {
      toast.error(err?.message || 'Could not send reset link.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center animate-fade-in">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100 mb-2">
          Check your inbox
        </h1>
        <p className="text-sm text-ink-500 dark:text-parchment-400 mb-8">
          We've sent a password reset link to your email address.
        </p>
        <Link to={ROUTES.LOGIN} className="btn-secondary inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <p className="eyebrow mb-3">Account recovery</p>
      <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-parchment-100 mb-2">
        Reset your password
      </h1>
      <p className="text-sm text-ink-500 dark:text-parchment-400 mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required', pattern: emailPattern })}
        />
        <Button type="submit" isLoading={submitting} icon={Mail} className="w-full">
          Send reset link
        </Button>
      </form>

      <Link to={ROUTES.LOGIN} className="mt-8 flex items-center justify-center gap-1.5 text-sm text-ink-500 dark:text-parchment-400 hover:text-brass-600 dark:hover:text-brass-400 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to login
      </Link>
    </div>
  )
}
