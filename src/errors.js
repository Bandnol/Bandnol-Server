export class MissingSearchQueryError extends Error {
  errorCode = "RS1300";

  constructor(reason = "검색어를 입력하세요.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class RecommendationNotFoundError extends Error {
  errorCode = "RS1301";

  constructor(reason = "추천 기록이 존재하지 않습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
