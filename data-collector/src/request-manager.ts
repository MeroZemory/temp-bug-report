import { EventEmitter } from "events";
import { Queue } from "queue-typescript";
import moment, { Moment } from "moment";

type RequestHandler<Req, Res> = (request: Req) => Promise<Res>;

type RequestWithPromise<Req, Res> = {
  request: Req;
  resolve: (value: Res) => void;
  reject?: (error: any) => void;
};

/**
 * 요청을 관리하는 클래스입니다.
 *
 * @template Req 요청 타입
 * @template K 요청 핸들러 타입
 * @extends {EventEmitter}
 */
export class RequestManager<Req, Res> extends EventEmitter {
  private requestHandler: RequestHandler<Req, Res>;
  private rpmLimit: number;
  private requestQueue: Queue<RequestWithPromise<Req, Res>>;
  private urgentQueue: Queue<RequestWithPromise<Req, Res>>;
  private timestamps: Queue<Moment>;

  constructor(requestHandler: RequestHandler<Req, Res>, rpmLimit: number) {
    super();
    this.requestHandler = requestHandler;
    this.rpmLimit = rpmLimit;
    this.requestQueue = new Queue<RequestWithPromise<Req, Res>>();
    this.urgentQueue = new Queue<RequestWithPromise<Req, Res>>();
    this.timestamps = new Queue<Moment>();
    this.on("newRequest", () => this.processQueue());
  }

  /**
   * 요청을 큐에 추가하고 요청에 대한 promise를 반환합니다.
   * 요청 순서를 보장하려면 반환된 promise를 사용하세요.
   *
   * @param request
   * @param isUrgent 긴급 요청 여부
   * @returns {Promise<Res>} 요청 처리 promise
   */
  addRequest(request: Req, isUrgent = false): Promise<Res> {
    return new Promise<Res>((resolve, reject) => {
      const reqWithPromise: RequestWithPromise<Req, Res> = {
        request,
        resolve,
        reject,
      };
      if (isUrgent) {
        this.urgentQueue.enqueue(reqWithPromise);
      } else {
        this.requestQueue.enqueue(reqWithPromise);
      }
      this.emit("newRequest");
    });
  }

  /**
   * 큐에 있는 요청을 처리합니다.
   */
  private processQueue() {
    while (this.urgentQueue.length > 0 || this.requestQueue.length > 0) {
      // 각 요청은 독립적입니다.
      // Check rate limit
      if (
        this.timestamps.length >= this.rpmLimit &&
        this.getRPM() >= this.rpmLimit
      ) {
        const delay = 60 * 1000 - moment().diff(this.timestamps.front);
        setTimeout(() => this.processQueue(), delay);
        return; // rate limit exceeded
      }

      // Process request
      const targetQueue =
        this.urgentQueue.length > 0 ? this.urgentQueue : this.requestQueue;
      const reqWithPromise = targetQueue.dequeue();
      this.timestamps.enqueue(moment()); // add timestamp

      this.requestHandler(reqWithPromise.request)
        .then((res) => {
          reqWithPromise.resolve(res);
        })
        .catch((error) => {
          if (reqWithPromise.reject) {
            reqWithPromise.reject(error);
          } else {
            throw error;
          }
        });
      console.log("비동기 핸들링 요청 완료");
    }
  }

  /**
   * 1분 이상 지난 타임스탬프를 제거합니다.
   */
  private cleanTimestamps() {
    const oneMinuteAgo = moment().subtract(1, "minute");
    while (
      this.timestamps.length > 0 &&
      this.timestamps.front.isSameOrBefore(oneMinuteAgo)
    ) {
      this.timestamps.dequeue();
    }
  }

  /**
   * 1분 이내의 요청 수를 반환합니다.
   *
   * @returns {number} 남은 타임스탬프 수
   */
  private getRPM(): number {
    this.cleanTimestamps();
    return this.timestamps.length;
  }
}
