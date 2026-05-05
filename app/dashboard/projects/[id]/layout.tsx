export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  return <>{children}</>
}
