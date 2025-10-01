export enum AirGrade {
  GOOD = 1,
  NORMAL = 2,
  BAD = 3,
  TERRIBLE = 4
}

export const getGradeText = (grade: AirGrade | number | null): string => {
  switch (grade) {
    case AirGrade.GOOD:
      return "좋음"
    case AirGrade.NORMAL:
      return "보통"
    case AirGrade.BAD:
      return "나쁨"
    case AirGrade.TERRIBLE:
      return "매우 나쁨"
    default:
      return "알 수 없음"
  }
}

export const getGradeColor = (grade: AirGrade | number | null): string => {
  switch (grade) {
    case AirGrade.GOOD:
      return "blue"
    case AirGrade.NORMAL:
      return "green"
    case AirGrade.BAD:
      return "orange"
    case AirGrade.TERRIBLE:
      return "red"
    default:
      return "gray"
  }
}