export default function TaskDetailLayout({
  children,
}: {
  children: React.ReactNode
  params: Promise<{ id: string; taskId: string }>
}) {
  return <>{children}</>
}
