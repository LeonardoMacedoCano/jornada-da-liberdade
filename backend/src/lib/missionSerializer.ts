import { Mission, UserMissionProgress } from '@prisma/client'

export interface SerializedMission extends Omit<Mission, 'targetValue' | 'targetSmMultiple'> {
  targetValue: string | null
  targetSmMultiple: string | null
  isCompleted: boolean
  completedAt: Date | null
  startedAt: Date | null
}

export function serializeMission(mission: Mission, prog?: UserMissionProgress): SerializedMission {
  return {
    ...mission,
    targetValue: mission.targetValue?.toString() ?? null,
    targetSmMultiple: mission.targetSmMultiple?.toString() ?? null,
    isCompleted: prog?.isCompleted ?? false,
    completedAt: prog?.completedAt ?? null,
    startedAt: prog?.startedAt ?? null,
  }
}
