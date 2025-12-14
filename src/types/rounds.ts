export enum RoundStatus {
    ACTIVE = 'active',
    COOLDOWN = 'cooldown',
    FINISHED = 'finished',
  }
  
  export const ROUND_STATUS_LABELS: Record<RoundStatus, string> = {
    [RoundStatus.ACTIVE]: 'Активен',
    [RoundStatus.COOLDOWN]: 'Cooldown',
    [RoundStatus.FINISHED]: 'Завершен',
  } as const
  
  export const ROUND_STATUS_TITLES: Record<RoundStatus, string> = {
    [RoundStatus.ACTIVE]: 'Активный раунд',
    [RoundStatus.COOLDOWN]: 'Ожидание',
    [RoundStatus.FINISHED]: 'Раунд завершен',
  } as const
  