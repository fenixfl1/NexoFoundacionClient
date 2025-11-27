import { getSessionInfo } from 'src/lib/session'
import { Person } from 'src/services/people/people.types'
import { User } from 'src/services/users/users.types'

export function getAvatarLink(record?: Person | User): string {
  let avatar = getSessionInfo().avatar
  let name = getSessionInfo().name

  if (record) {
    avatar = record.AVATAR
    name =
      record?.['FULL_NAME'] ??
      `${record?.['NAME'] ?? ''} ${record?.['LAST_NAME'] ?? ''}`
  }

  return avatar || `https://ui-avatars.com/api/?name=${name}&background=random`
}
