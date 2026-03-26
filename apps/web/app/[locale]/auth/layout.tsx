import { Card } from "@bee-budget/ui/card"
import Image from "next/image"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="relative min-h-screen w-full">
      <Image
        src={"/auth-background.jpg"}
        width={1920}
        height={1080}
        objectFit="cover"
        alt="Auth background"
        priority
        className="z-0 h-screen w-full object-cover"
      />

      <div className="absolute inset-0 z-10 overflow-auto bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto flex min-h-screen items-center justify-center px-2 py-6 sm:px-4 md:px-6 md:py-10 lg:justify-end">
          <Card className="w-full max-w-xl">{children}</Card>
        </div>
      </div>
    </main>
  )
}
