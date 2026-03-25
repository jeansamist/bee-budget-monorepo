import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
import React from 'react'

interface WelcomeEmailProps {
  firstName: string
  emailVerificationCode: string
}

export function EmailVerificationCodeEmailTemplate({
  firstName,
  emailVerificationCode,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code is {emailVerificationCode}!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-20">
          <Container className="w-[680px] max-w-full mx-auto bg-white p-8">
            <Heading className="text-2xl font-bold text-gray-800">BeeBudget</Heading>
            <Heading className="text-2xl font-bold text-gray-800">Hello, {firstName}! 👋</Heading>
            <Text className="text-gray-600">
              Thanks for signing up. Please confirm your email to get started.
            </Text>

            <Text className="text-gray-600 mt-6">
              Your verification code is: <strong>{emailVerificationCode}</strong>
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              If you didn't create an account, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
