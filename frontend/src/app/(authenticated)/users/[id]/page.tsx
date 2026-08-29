import { UserProfilePage } from '@/features/users/components/UserProfilePage'

interface UserProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: UserProfilePageProps) {
  const { id } = await params

  return <UserProfilePage userId={id} />
}
