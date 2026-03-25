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
}

export function WelcomeEmailTemplate({ firstName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Hi {firstName}, welcome!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-20">
          <Container className="w-[680px] max-w-full mx-auto bg-white p-8">
            <Heading className="text-2xl font-bold text-gray-800">BeeBudget</Heading>
            <Heading className="text-2xl font-bold text-gray-800">Welcome, {firstName}! 👋</Heading>
            <Text className="text-gray-600">
              Thanks for signing up. Now you can start your journey.
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              Please ignore this email if you did not create an account.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
